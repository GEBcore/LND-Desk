package main

import (
	"errors"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) OpenFileSelector(opts runtime.OpenDialogOptions) (string, error) {
	dir, err := runtime.OpenDirectoryDialog(a.ctx, opts)
	if err != nil {
		return "", err
	}
	if dir == "" {
		return "", errors.New("user canceled")
	}
	return dir, nil
}
