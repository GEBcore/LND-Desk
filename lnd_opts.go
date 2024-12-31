package main

import (
	"github.com/btclayer2/LND-Desk/http_util"
	"github.com/btclayer2/LND-Desk/lnd_opts"
	"github.com/lightningnetwork/lnd/lnrpc"
	"github.com/lightningnetwork/lnd/rpcperms"
	"strings"
)

type ChainInfo struct {
	MempoolBlock int64
	LndInfo      *lnrpc.GetInfoResponse
}

func (a *App) GetLndChainInfo(mempoolHost string) (*ChainInfo, error) {
	height, err := http_util.GetBlocksTipHeight(mempoolHost)
	if err != nil {
		return nil, err
	}
	info, err := lnd_ops.GetInfo(a.ctx, a.lndConfig)
	if err != nil {
		return nil, err
	}
	return &ChainInfo{
		MempoolBlock: height,
		LndInfo:      info,
	}, nil
}

func (a *App) Unlock(password string) error {
	err := lnd_ops.Unlock(a.ctx, a.lndConfig, password)
	if err != nil && strings.Contains(err.Error(), rpcperms.ErrWalletUnlocked.Error()) {
		return nil
	}
	return err
}

func (a *App) GetState() (*lnrpc.GetStateResponse, error) {
	return lnd_ops.GetState(a.ctx, a.lndConfig)
}

func (a *App) InitWallet(walletPassword, existMnemonic, aezeedPass, existXprv string) error {
	return lnd_ops.InitWallet(a.ctx, a.lndConfig, walletPassword, existMnemonic, aezeedPass, existXprv)
}

func (a *App) GenSeed(aezeedPass string) ([]string, error) {
	return lnd_ops.GenSeed(a.ctx, a.lndConfig, aezeedPass)
}
