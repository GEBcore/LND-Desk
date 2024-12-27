package main

import (
	"github.com/lightningnetwork/lnd/lnrpc"
	"github.com/lightningnetwork/lnd/rpcperms"
	"lnd-desk/http_util"
	"lnd-desk/lnd_opts"
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
	info, err := lnd_ops.GetInfo(a.lndConfig)
	if err != nil {
		return nil, err
	}
	return &ChainInfo{
		MempoolBlock: height,
		LndInfo:      info,
	}, nil
}

func (a *App) Unlock(password string) error {
	err := lnd_ops.Unlock(a.lndConfig, password)
	if err != nil && strings.Contains(err.Error(), rpcperms.ErrWalletUnlocked.Error()) {
		return nil
	}
	return err
}

func (a *App) GetState() (*lnrpc.GetStateResponse, error) {
	return lnd_ops.GetState(a.lndConfig)
}
