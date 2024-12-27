package lnd_node

import (
	"bytes"
	"github.com/lightningnetwork/lnd"
	"github.com/lightningnetwork/lnd/signal"
	"testing"
	"time"
)

func TestStartLnd(t *testing.T) {
	interceptor, err := signal.Intercept()
	if err != nil {
		t.Fatal(err)
	}
	lndConfig, err := CheckAndParse(interceptor, "", bytes.NewBufferString("[Application Options]\ndebuglevel=trace\nmaxpendingchannels=10\nalias=Bevm_client_test\nno-macaroons=false\ncoin-selection-strategy=largest\nrpclisten=localhost:10009\nrestlisten=localhost:8080\nno-rest-tls=true\nrestcors=https://bevmhub.bevm.io\n\n[Bitcoin]\nbitcoin.mainnet=false\nbitcoin.testnet=false\nbitcoin.simnet=false\nbitcoin.regtest=false\nbitcoin.signet=true\nbitcoin.node=neutrino\n\n[neutrino]\nneutrino.addpeer=x49.seed.signet.bitcoin.sprovoost.nl\nneutrino.addpeer=v7ajjeirttkbnt32wpy3c6w3emwnfr3fkla7hpxcfokr3ysd3kqtzmqd.onion:38333\n\n[protocol]\nprotocol.simple-taproot-chans=true"))
	if err != nil {
		t.Fatal(err)
	}
	type args struct {
		interceptor signal.Interceptor
		config      *lnd.Config
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "test run",
			args: args{
				interceptor: interceptor,
				config:      lndConfig,
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var err error
			go func() {
				err = StartLnd(tt.args.interceptor, tt.args.config)
			}()
			time.Sleep(500 * time.Millisecond)
			if (err != nil) != tt.wantErr {
				t.Errorf("StartLnd() error = %v, wantErr %v", err, tt.wantErr)
			}
			t.Log("sleep")
			time.Sleep(3 * time.Second)
			t.Log("stop lnd")
			for tt.args.interceptor.Listening() {
				tt.args.interceptor.RequestShutdown()
			}
			time.Sleep(3 * time.Second)
			tt.args.interceptor, err = signal.Intercept()
			if err != nil {
				t.Fatal(err)
			}
			t.Log("restart lnd")
			if err := StartLnd(tt.args.interceptor, tt.args.config); (err != nil) != tt.wantErr {
				t.Errorf("reStartLnd() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
