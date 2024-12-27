package lnd_node

import (
	"bytes"
	"github.com/lightningnetwork/lnd"
	"github.com/lightningnetwork/lnd/signal"
	"io"
	"reflect"
	"testing"
)

func TestCheckAndParse(t *testing.T) {
	interceptor, err := signal.Intercept()
	if err != nil {
		t.Fatal(err)
	}
	type args struct {
		interceptor signal.Interceptor
		lndDir      string
		config      io.Reader
	}
	tests := []struct {
		name    string
		args    args
		want    *lnd.Config
		wantErr bool
	}{
		{
			name: "test",
			args: args{
				interceptor: interceptor,
				lndDir:      "",
				config:      bytes.NewBufferString("[Application Options]\ndebuglevel=trace\nmaxpendingchannels=10\nalias=Bevm_client_test\nno-macaroons=false\ncoin-selection-strategy=largest\nrpclisten=localhost:10009\nrestlisten=localhost:8080\nno-rest-tls=true\nrestcors=https://bevmhub.bevm.io\n\n[Bitcoin]\nbitcoin.mainnet=false\nbitcoin.testnet=false\nbitcoin.simnet=false\nbitcoin.regtest=false\nbitcoin.signet=true\nbitcoin.node=neutrino\n\n[neutrino]\nneutrino.addpeer=x49.seed.signet.bitcoin.sprovoost.nl\nneutrino.addpeer=v7ajjeirttkbnt32wpy3c6w3emwnfr3fkla7hpxcfokr3ysd3kqtzmqd.onion:38333\n\n[protocol]\nprotocol.simple-taproot-chans=true"),
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := CheckAndParse(tt.args.interceptor, tt.args.lndDir, tt.args.config)
			if (err != nil) != tt.wantErr {
				t.Errorf("CheckAndParse() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("CheckAndParse() got = %v, want %v", got, tt.want)
			}
		})
	}
}
