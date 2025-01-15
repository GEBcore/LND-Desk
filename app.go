package main

import (
	"context"
	_ "embed"
	"errors"
	"fmt"
	"github.com/lightningnetwork/lnd"
	"github.com/lightningnetwork/lnd/signal"
	"github.com/tidwall/gjson"
)

//go:embed wails.json
var wailsJSON string

// App struct
type App struct {
	ctx                 context.Context
	shutdownInterceptor signal.Interceptor
	lndConfig           *lnd.Config
}

var noProfileErr = errors.New("please input the legal profiles")

// NewApp creates a new App application struct
func NewApp() *App {
	interceptor, err := signal.Intercept()
	if err != nil {
		panic(fmt.Sprintf("failed to create signal interceptor: %v", err))
	}
	return &App{
		shutdownInterceptor: interceptor,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) GetVersion() string {
	version := gjson.Get(wailsJSON, "info.productVersion")
	return version.String()
}

