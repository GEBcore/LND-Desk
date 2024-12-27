package http_util

import (
	"strconv"
)

func GetBlocksTipHeight(host string) (int64, error) {
	path := "/api/blocks/tip/height"
	resp, err := GetReqWithParams(host, path, nil, nil)
	if err != nil {
		return 0, err
	}
	return strconv.ParseInt(string(resp), 10, 64)
}
