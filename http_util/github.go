package http_util

import (
	"errors"
	"github.com/tidwall/gjson"
)

func GetGithubLatestVersion() (string, error) {
	resp, err := GetReqWithParams("https://api.github.com", "/repos/btclayer2/LND-Desk/releases/latest", nil, nil)
	if err != nil {
		return "", err
	}
	if gjson.GetBytes(resp, "prerelease").Bool() {
		return "", errors.New("fetch latest version failed")
	}
	version := gjson.GetBytes(resp, "tag_name")
	return version.String(), nil
}
