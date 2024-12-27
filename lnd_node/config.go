package lnd_node

import (
	"github.com/jessevdk/go-flags"
	"github.com/lightningnetwork/lnd"
	"github.com/lightningnetwork/lnd/lnutils"
	"github.com/lightningnetwork/lnd/signal"
	"io"
)

func CheckAndParse(interceptor signal.Interceptor, lndDir string, config io.Reader) (*lnd.Config, error) {
	preCfg := lnd.DefaultConfig()
	var configFileError error
	cfg := preCfg
	fileParser := flags.NewParser(&cfg, flags.Default)
	err := flags.NewIniParser(fileParser).Parse(config)
	if err != nil {
		// If it's a parsing related error, then we'll return
		// immediately, otherwise we can proceed as possibly the config
		// file doesn't exist which is OK.
		if lnutils.ErrorAs[*flags.IniError](err) ||
			lnutils.ErrorAs[*flags.Error](err) {

			return nil, err
		}

		configFileError = err
	}
	cfg.LndDir = lndDir

	// Finally, parse the remaining command line options again to ensure
	// they take precedence.
	flagParser := flags.NewParser(&cfg, flags.Default)

	// Make sure everything we just loaded makes sense.
	cleanCfg, err := lnd.ValidateConfig(
		cfg, interceptor, fileParser, flagParser,
	)
	if err != nil {
		// The log subsystem might not yet be initialized. But we still
		// try to log the error there since some packaging solutions
		// might only look at the log and not stdout/stderr.
		return nil, err
	}

	// Warn about missing config file only after all other configuration is
	// done. This prevents the warning on help messages and invalid options.
	// Note this should go directly before the return.
	if configFileError != nil {
		return nil, configFileError
	}
	return cleanCfg, nil
}
