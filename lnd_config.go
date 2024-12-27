package main

import "errors"

func (a *App) GetLndPath() (string, error) {
	if a.lndConfig == nil {
		return "", noProfileErr
	}
	return a.lndConfig.LndDir, nil
}

func (a *App) GetLndRest() (string, error) {
	if a.lndConfig == nil {
		return "", noProfileErr
	}
	if len(a.lndConfig.RESTListeners) == 0 {
		return "", errors.New("unknown REST address")
	}
	prefix := "http://"
	if !a.lndConfig.DisableRestTLS {
		prefix = "https://"
	}
	return prefix + a.lndConfig.RESTListeners[0].String(), nil
}

func (a *App) GetLndAdminMacaroonPath() (string, error) {
	if a.lndConfig == nil {
		return "", noProfileErr
	}
	if a.lndConfig.NoMacaroons {
		return "", errors.New("macaroon disabled")
	}
	return a.lndConfig.AdminMacPath, nil
}
