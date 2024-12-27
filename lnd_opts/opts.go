package lnd_ops

import (
	"context"
	"fmt"
	"github.com/lightningnetwork/lnd"
	"github.com/lightningnetwork/lnd/lnrpc"
)

func Unlock(c *lnd.Config, password string) error {
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
	_, err = client.UnlockWallet(context.Background(), req)
	if err != nil {
		return err
	}

	fmt.Println("\nlnd successfully unlocked!")

	return nil
}

//func parseChanBackups(ctx *cli.Context) (*lnrpc.RestoreChanBackupRequest, error) {
//	switch {
//	case ctx.IsSet("single_backup"):
//		packedBackup, err := hex.DecodeString(
//			ctx.String("single_backup"),
//		)
//		if err != nil {
//			return nil, fmt.Errorf("unable to decode single packed "+
//				"backup: %v", err)
//		}
//
//		return &lnrpc.RestoreChanBackupRequest{
//			Backup: &lnrpc.RestoreChanBackupRequest_ChanBackups{
//				ChanBackups: &lnrpc.ChannelBackups{
//					ChanBackups: []*lnrpc.ChannelBackup{
//						{
//							ChanBackup: packedBackup,
//						},
//					},
//				},
//			},
//		}, nil
//
//	case ctx.IsSet("multi_backup"):
//		packedMulti, err := hex.DecodeString(
//			ctx.String("multi_backup"),
//		)
//		if err != nil {
//			return nil, fmt.Errorf("unable to decode multi packed "+
//				"backup: %v", err)
//		}
//
//		return &lnrpc.RestoreChanBackupRequest{
//			Backup: &lnrpc.RestoreChanBackupRequest_MultiChanBackup{
//				MultiChanBackup: packedMulti,
//			},
//		}, nil
//
//	case ctx.IsSet("single_file"):
//		packedSingle, err := os.ReadFile(ctx.String("single_file"))
//		if err != nil {
//			return nil, fmt.Errorf("unable to decode single "+
//				"packed backup: %v", err)
//		}
//
//		return &lnrpc.RestoreChanBackupRequest{
//			Backup: &lnrpc.RestoreChanBackupRequest_ChanBackups{
//				ChanBackups: &lnrpc.ChannelBackups{
//					ChanBackups: []*lnrpc.ChannelBackup{{
//						ChanBackup: packedSingle,
//					}},
//				},
//			},
//		}, nil
//
//	case ctx.IsSet("multi_file"):
//		packedMulti, err := os.ReadFile(ctx.String("multi_file"))
//		if err != nil {
//			return nil, fmt.Errorf("unable to decode multi packed "+
//				"backup: %v", err)
//		}
//
//		return &lnrpc.RestoreChanBackupRequest{
//			Backup: &lnrpc.RestoreChanBackupRequest_MultiChanBackup{
//				MultiChanBackup: packedMulti,
//			},
//		}, nil
//
//	default:
//		return nil, errMissingChanBackup
//	}
//}

func GetState(c *lnd.Config) (*lnrpc.GetStateResponse, error) {
	client, cleanUp, err := getStateServiceClient(c)
	if err != nil {
		return nil, err
	}
	defer cleanUp()

	req := &lnrpc.GetStateRequest{}
	return client.GetState(context.Background(), req)
}

func GetInfo(c *lnd.Config) (*lnrpc.GetInfoResponse, error) {
	client, cleanUp, err := getClient(c)
	if err != nil {
		return nil, err
	}
	defer cleanUp()

	req := &lnrpc.GetInfoRequest{}
	return client.GetInfo(context.Background(), req)
}

//func Create(c *lnd.Config) error {
//	client, cleanUp, err := getWalletUnlockerClient(c)
//	if err != nil {
//		return err
//	}
//	defer cleanUp()
//
//	var (
//		chanBackups *lnrpc.ChanBackupSnapshot
//
//		// We use var restoreSCB to track if we will be including an SCB
//		// recovery in the init wallet request.
//		restoreSCB = false
//	)
//
//	backups, err := parseChanBackups(ctx)
//
//	// We'll check to see if the user provided any static channel backups (SCB),
//	// if so, we will warn the user that SCB recovery closes all open channels
//	// and ask them to confirm their intention.
//	// If the user agrees, we'll add the SCB recovery onto the final init wallet
//	// request.
//	switch {
//	// parseChanBackups returns an errMissingBackup error (which we ignore) if
//	// the user did not request a SCB recovery.
//	case err == errMissingChanBackup:
//
//	// Passed an invalid channel backup file.
//	case err != nil:
//		return fmt.Errorf("unable to parse chan backups: %w", err)
//
//	// We have an SCB recovery option with a valid backup file.
//	default:
//
//	warningLoop:
//		for {
//			fmt.Println()
//			fmt.Printf("WARNING: You are attempting to restore from a " +
//				"static channel backup (SCB) file.\nThis action will CLOSE " +
//				"all currently open channels, and you will pay on-chain fees." +
//				"\n\nAre you sure you want to recover funds from a" +
//				" static channel backup? (Enter y/n): ")
//
//			reader := bufio.NewReader(os.Stdin)
//			answer, err := reader.ReadString('\n')
//			if err != nil {
//				return err
//			}
//
//			answer = strings.TrimSpace(answer)
//			answer = strings.ToLower(answer)
//
//			switch answer {
//			case "y":
//				restoreSCB = true
//				break warningLoop
//			case "n":
//				fmt.Println("Aborting SCB recovery")
//				return nil
//			}
//		}
//	}
//
//	// Proceed with SCB recovery.
//	if restoreSCB {
//		fmt.Println("Static Channel Backup (SCB) recovery selected!")
//		if backups != nil {
//			switch {
//			case backups.GetChanBackups() != nil:
//				singleBackup := backups.GetChanBackups()
//				chanBackups = &lnrpc.ChanBackupSnapshot{
//					SingleChanBackups: singleBackup,
//				}
//
//			case backups.GetMultiChanBackup() != nil:
//				multiBackup := backups.GetMultiChanBackup()
//				chanBackups = &lnrpc.ChanBackupSnapshot{
//					MultiChanBackup: &lnrpc.MultiChanBackup{
//						MultiChanBackup: multiBackup,
//					},
//				}
//			}
//		}
//	}
//
//	// Should the daemon be initialized stateless? Then we expect an answer
//	// with the admin macaroon later. Because the --save_to is related to
//	// stateless init, it doesn't make sense to be set on its own.
//	statelessInit := ctx.Bool(statelessInitFlag.Name)
//	if !statelessInit && ctx.IsSet(saveToFlag.Name) {
//		return fmt.Errorf("cannot set save_to parameter without " +
//			"stateless_init")
//	}
//
//	walletPassword, err := capturePassword(
//		"Input wallet password: ", false, walletunlocker.ValidatePassword,
//	)
//	if err != nil {
//		return err
//	}
//
//	// Next, we'll see if the user has 24-word mnemonic they want to use to
//	// derive a seed within the wallet or if they want to specify an
//	// extended master root key (xprv) directly.
//	var (
//		hasMnemonic bool
//		hasXprv     bool
//	)
//
//mnemonicCheck:
//	for {
//		fmt.Println()
//		fmt.Printf("Do you have an existing cipher seed " +
//			"mnemonic or extended master root key you want to " +
//			"use?\nEnter 'y' to use an existing cipher seed " +
//			"mnemonic, 'x' to use an extended master root key " +
//			"\nor 'n' to create a new seed (Enter y/x/n): ")
//
//		reader := bufio.NewReader(os.Stdin)
//		answer, err := reader.ReadString('\n')
//		if err != nil {
//			return err
//		}
//
//		fmt.Println()
//
//		answer = strings.TrimSpace(answer)
//		answer = strings.ToLower(answer)
//
//		switch answer {
//		case "y":
//			hasMnemonic = true
//			break mnemonicCheck
//
//		case "x":
//			hasXprv = true
//			break mnemonicCheck
//
//		case "n":
//			break mnemonicCheck
//		}
//	}
//
//	// If the user *does* have an existing seed or root key they want to
//	// use, then we'll read that in directly from the terminal.
//	var (
//		cipherSeedMnemonic      []string
//		aezeedPass              []byte
//		extendedRootKey         string
//		extendedRootKeyBirthday uint64
//		recoveryWindow          int32
//	)
//	switch {
//	// Use an existing cipher seed mnemonic in the aezeed format.
//	case hasMnemonic:
//		// We'll now prompt the user to enter in their 24-word
//		// mnemonic.
//		fmt.Printf("Input your 24-word mnemonic separated by spaces: ")
//		reader := bufio.NewReader(os.Stdin)
//		mnemonic, err := reader.ReadString('\n')
//		if err != nil {
//			return err
//		}
//
//		// We'll trim off extra spaces, and ensure the mnemonic is all
//		// lower case, then populate our request.
//		mnemonic = strings.TrimSpace(mnemonic)
//		mnemonic = strings.ToLower(mnemonic)
//
//		cipherSeedMnemonic = strings.Split(mnemonic, " ")
//
//		fmt.Println()
//
//		if len(cipherSeedMnemonic) != 24 {
//			return fmt.Errorf("wrong cipher seed mnemonic "+
//				"length: got %v words, expecting %v words",
//				len(cipherSeedMnemonic), 24)
//		}
//
//		// Additionally, the user may have a passphrase, that will also
//		// need to be provided so the daemon can properly decipher the
//		// cipher seed.
//		aezeedPass, err = readPassword("Input your cipher seed " +
//			"passphrase (press enter if your seed doesn't have a " +
//			"passphrase): ")
//		if err != nil {
//			return err
//		}
//
//		recoveryWindow, err = askRecoveryWindow()
//		if err != nil {
//			return err
//		}
//
//	// Use an existing extended master root key to create the wallet.
//	case hasXprv:
//		// We'll now prompt the user to enter in their extended master
//		// root key.
//		fmt.Printf("Input your extended master root key (usually " +
//			"starting with xprv... on mainnet): ")
//		reader := bufio.NewReader(os.Stdin)
//		extendedRootKey, err = reader.ReadString('\n')
//		if err != nil {
//			return err
//		}
//		extendedRootKey = strings.TrimSpace(extendedRootKey)
//
//		extendedRootKeyBirthday, err = askBirthdayTimestamp()
//		if err != nil {
//			return err
//		}
//
//		recoveryWindow, err = askRecoveryWindow()
//		if err != nil {
//			return err
//		}
//
//	// Neither a seed nor a master root key was specified, the user wants
//	// to create a new seed.
//	default:
//		// Otherwise, if the user doesn't have a mnemonic that they
//		// want to use, we'll generate a fresh one with the GenSeed
//		// command.
//		fmt.Println("Your cipher seed can optionally be encrypted.")
//
//		instruction := "Input your passphrase if you wish to encrypt it " +
//			"(or press enter to proceed without a cipher seed " +
//			"passphrase): "
//		aezeedPass, err = capturePassword(
//			instruction, true, func(_ []byte) error { return nil },
//		)
//		if err != nil {
//			return err
//		}
//
//		fmt.Println()
//		fmt.Println("Generating fresh cipher seed...")
//		fmt.Println()
//
//		genSeedReq := &lnrpc.GenSeedRequest{
//			AezeedPassphrase: aezeedPass,
//		}
//		seedResp, err := client.GenSeed(ctxc, genSeedReq)
//		if err != nil {
//			return fmt.Errorf("unable to generate seed: %w", err)
//		}
//
//		cipherSeedMnemonic = seedResp.CipherSeedMnemonic
//	}
//
//	// Before we initialize the wallet, we'll display the cipher seed to
//	// the user so they can write it down.
//	if len(cipherSeedMnemonic) > 0 {
//		printCipherSeedWords(cipherSeedMnemonic)
//	}
//
//	// With either the user's prior cipher seed, or a newly generated one,
//	// we'll go ahead and initialize the wallet.
//	req := &lnrpc.InitWalletRequest{
//		WalletPassword:                     walletPassword,
//		CipherSeedMnemonic:                 cipherSeedMnemonic,
//		AezeedPassphrase:                   aezeedPass,
//		ExtendedMasterKey:                  extendedRootKey,
//		ExtendedMasterKeyBirthdayTimestamp: extendedRootKeyBirthday,
//		RecoveryWindow:                     recoveryWindow,
//		ChannelBackups:                     chanBackups,
//		StatelessInit:                      statelessInit,
//	}
//	response, err := client.InitWallet(ctxc, req)
//	if err != nil {
//		return err
//	}
//
//	fmt.Println("\nlnd successfully initialized!")
//
//	if statelessInit {
//		return storeOrPrintAdminMac(ctx, response.AdminMacaroon)
//	}
//
//	return nil
//}
