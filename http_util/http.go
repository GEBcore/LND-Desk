package http_util

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"
)

var client = http.Client{
	Timeout: 10 * time.Second,
}

func GetReqWithParams(host, path string, params map[string]interface{}, heads map[string]string) ([]byte, error) {
	p := url.Values{}
	reqUrl := host + path + "?"
	for k, v := range params {
		p.Set(k, fmt.Sprint(v))
	}

	request, err := http.NewRequest(http.MethodGet, reqUrl+p.Encode(), nil)
	if err != nil {
		return nil, err
	}

	for k, v := range heads {
		request.Header.Add(k, v)
	}

	resp, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("request url[%s] with code [%d] body [%s]", reqUrl, resp.StatusCode, string(body))
	}
	return body, nil
}
