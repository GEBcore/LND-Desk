package lnd_node

import (
	"github.com/lightningnetwork/lnd"
	"github.com/lightningnetwork/lnd/signal"
)

func StartLnd(interceptor signal.Interceptor, config *lnd.Config) error {
	implCfg := config.ImplementationConfig(interceptor)
	if err := lnd.Main(
		config, lnd.ListenerCfg{}, implCfg, interceptor,
	); err != nil {
		return err
	}
	return nil
}
