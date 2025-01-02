package lnd_ops

import (
	"context"
	"fmt"
	"github.com/lightningnetwork/lnd"
	"github.com/lightningnetwork/lnd/lnrpc"
	"github.com/lightningnetwork/lnd/lnrpc/walletrpc"
	"github.com/lightningnetwork/lnd/walletunlocker"
	"strings"
)

const (
	defaultRecoveryWindow = 2500
)

func Unlock(ctx context.Context, c *lnd.Config, password string) error {
	client, cleanUp, err := getWalletUnlockerClient(c)
	if err != nil {
		return err
	}
	defer cleanUp()

	var recoveryWindow int32

	req := &lnrpc.UnlockWalletRequest{
		WalletPassword: []byte(password),
		RecoveryWindow: recoveryWindow,
		StatelessInit:  true,
	}
	_, err = client.UnlockWallet(ctx, req)
	if err != nil {
		return err
	}

	fmt.Println("\nlnd successfully unlocked!")

	return nil
}

func GetState(ctx context.Context, c *lnd.Config) (*lnrpc.GetStateResponse, error) {
	client, cleanUp, err := getStateServiceClient(c)
	if err != nil {
		return nil, err
	}
	defer cleanUp()

	req := &lnrpc.GetStateRequest{}
	return client.GetState(ctx, req)
}

func GetInfo(ctx context.Context, c *lnd.Config) (*lnrpc.GetInfoResponse, error) {
	client, cleanUp, err := getClient(c)
	if err != nil {
		return nil, err
	}
	defer cleanUp()

	req := &lnrpc.GetInfoRequest{}
	return client.GetInfo(ctx, req)
}

func GenSeed(ctx context.Context, c *lnd.Config, aezeedPass string) ([]string, error) {
	client, cleanUp, err := getWalletUnlockerClient(c)
	if err != nil {
		return nil, err
	}
	defer cleanUp()
	// Neither a seed nor a master root key was specified, the user wants
	// to create a new seed.
	// Otherwise, if the user doesn't have a mnemonic that they
	// want to use, we'll generate a fresh one with the GenSeed
	// command.

	genSeedReq := &lnrpc.GenSeedRequest{
		AezeedPassphrase: []byte(aezeedPass),
	}
	seedResp, err := client.GenSeed(ctx, genSeedReq)
	if err != nil {
		return nil, fmt.Errorf("unable to generate seed: %w", err)
	}

	return seedResp.CipherSeedMnemonic, nil
}

func InitWallet(ctx context.Context, c *lnd.Config, walletPassword, existMnemonic, aezeedPass, existXprv string) error {
	client, cleanUp, err := getWalletUnlockerClient(c)
	if err != nil {
		return err
	}
	defer cleanUp()

	err = walletunlocker.ValidatePassword([]byte(walletPassword))
	if err != nil {
		return err
	}

	var (
		cipherSeedMnemonic      []string
		extendedRootKey         string
		extendedRootKeyBirthday uint64
		recoveryWindow          int32
	)
	switch {
	// Use an existing cipher seed mnemonic in the aezeed format.
	case existMnemonic != "":
		// We'll now prompt the user to enter in their 24-word
		// mnemonic.

		// We'll trim off extra spaces, and ensure the mnemonic is all
		// lower case, then populate our request.
		existMnemonic = strings.TrimSpace(existMnemonic)
		existMnemonic = strings.ToLower(existMnemonic)

		cipherSeedMnemonic = strings.Split(existMnemonic, " ")

		if len(cipherSeedMnemonic) != 24 {
			return fmt.Errorf("wrong cipher seed mnemonic "+
				"length: got %v words, expecting %v words",
				len(cipherSeedMnemonic), 24)
		}

		recoveryWindow = defaultRecoveryWindow

	// Use an existing extended master root key to create the wallet.
	case existXprv != "":
		extendedRootKey = strings.TrimSpace(existXprv)

		extendedRootKeyBirthday = 0

		recoveryWindow = defaultRecoveryWindow

	}

	// With either the user's prior cipher seed, or a newly generated one,
	// we'll go ahead and initialize the wallet.
	req := &lnrpc.InitWalletRequest{
		WalletPassword:                     []byte(walletPassword),
		CipherSeedMnemonic:                 cipherSeedMnemonic,
		AezeedPassphrase:                   []byte(aezeedPass),
		ExtendedMasterKey:                  extendedRootKey,
		ExtendedMasterKeyBirthdayTimestamp: extendedRootKeyBirthday,
		RecoveryWindow:                     recoveryWindow,
		ChannelBackups:                     nil,
		StatelessInit:                      false,
	}
	_, err = client.InitWallet(ctx, req)
	return err
}

func ListAddresses(ctx context.Context, c *lnd.Config) (*walletrpc.ListAddressesResponse, error) {
	walletClient, cleanUp, err := getWalletClient(c)
	if err != nil {
		return nil, err
	}
	defer cleanUp()

	req := &walletrpc.ListAddressesRequest{
		AccountName:        "",
		ShowCustomAccounts: false,
	}
	return walletClient.ListAddresses(ctx, req)
}
