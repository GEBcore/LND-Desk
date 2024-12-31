package lnd_ops

import (
	"context"
	"fmt"
	"github.com/lightningnetwork/lnd"
	"github.com/lightningnetwork/lnd/lnrpc"
	"github.com/lightningnetwork/lnd/lnrpc/walletrpc"

const (
	defaultRecoveryWindow = 2500
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


func ListAddresses(c *lnd.Config) (*walletrpc.ListAddressesResponse, error) {
	walletClient, cleanUp, err := getWalletClient(c)
	if err != nil {
		return nil, err
	}
	defer cleanUp()

	req := &walletrpc.ListAddressesRequest{
		AccountName:        "",
		ShowCustomAccounts: false,
	}
	return walletClient.ListAddresses(context.Background(), req)
}
