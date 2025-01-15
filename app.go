package main

import (
	"context"
	_ "embed"
	"errors"
	"fmt"
	"github.com/btclayer2/LND-Desk/http_util"
	"github.com/lightningnetwork/lnd"
	"github.com/lightningnetwork/lnd/signal"
	"github.com/tidwall/gjson"
	"strconv"
	"strings"
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
	return "v" + version.String()
}

type VersionCtrl struct {
	CurrentVersion string
	LatestVersion  string
	NeedUpdate     bool
}

func (a *App) FetchVersionInfo() (versionCtrl VersionCtrl, err error) {
	versionCtrl.CurrentVersion = a.GetVersion()
	versionCtrl.LatestVersion, err = http_util.GetGithubLatestVersion()
	if err != nil {
		return
	}
	latestNum, err := strconv.ParseInt(strings.ReplaceAll(strings.TrimPrefix(versionCtrl.LatestVersion, "v"), ".", ""), 10, 64)
	if err != nil {
		return versionCtrl, fmt.Errorf("latest version[%s] is illegal", versionCtrl.LatestVersion)
	}
	currentNum, err := strconv.ParseInt(strings.ReplaceAll(strings.TrimPrefix(versionCtrl.CurrentVersion, "v"), ".", ""), 10, 64)
	if err != nil {
		return versionCtrl, fmt.Errorf("current version[%s] is illegal", versionCtrl.CurrentVersion)
	}
	if latestNum > currentNum {
		versionCtrl.NeedUpdate = true
	}
	return
}
