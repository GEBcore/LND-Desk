package main

import (
	"bytes"
	"github.com/btclayer2/LND-Desk/lnd_node"
	"github.com/lightningnetwork/lnd"
	"github.com/lightningnetwork/lnd/signal"
	"time"
)

func (a *App) VerifyConfig(lndDir, config string) (err error) {
	if !a.shutdownInterceptor.Listening() {
		a.shutdownInterceptor, err = signal.Intercept()
		if err != nil {
			return
		}
	}
	b := bytes.NewBufferString(config)
	a.lndConfig, err = lnd_node.CheckAndParse(a.shutdownInterceptor, lndDir, b)
	if err != nil {
		return
	}
	return nil
}

func (a *App) GetDefaultLndDir() string {
	return lnd.DefaultLndDir
}

func (a *App) RunLnd() error {
	if a.lndConfig == nil {
		return noProfileErr
	}
	var err error
	go func() {
		err = lnd_node.StartLnd(a.shutdownInterceptor, a.lndConfig)
	}()
	time.Sleep(500 * time.Millisecond)
	return err
}

func (a *App) StopLnd() {
	for a.shutdownInterceptor.Listening() {
		a.shutdownInterceptor.RequestShutdown()
	}
}
