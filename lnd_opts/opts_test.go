package lnd_ops

import (
	"bytes"
	"context"
	"github.com/btclayer2/LND-Desk/lnd_node"
	"github.com/lightningnetwork/lnd"
	"github.com/lightningnetwork/lnd/lnrpc"
	"github.com/lightningnetwork/lnd/signal"
	"testing"
)

func TestGetInfo(t *testing.T) {
	interceptor, err := signal.Intercept()
	if err != nil {
		t.Fatal(err)
	}
	lndConfig, err := lnd_node.CheckAndParse(interceptor, "", bytes.NewBufferString("[Application Options]\ndebuglevel=trace\nmaxpendingchannels=10\nalias=Bevm_client_test\nno-macaroons=false\ncoin-selection-strategy=largest\nrpclisten=localhost:10009\nrestlisten=localhost:8080\nno-rest-tls=true\nrestcors=https://bevmhub.bevm.io\n\n[Bitcoin]\nbitcoin.mainnet=false\nbitcoin.testnet=false\nbitcoin.simnet=false\nbitcoin.regtest=false\nbitcoin.signet=true\nbitcoin.node=neutrino\n\n[neutrino]\nneutrino.addpeer=x49.seed.signet.bitcoin.sprovoost.nl\nneutrino.addpeer=v7ajjeirttkbnt32wpy3c6w3emwnfr3fkla7hpxcfokr3ysd3kqtzmqd.onion:38333\n\n[protocol]\nprotocol.simple-taproot-chans=true"))
	if err != nil {
		t.Fatal(err)
	}
	type args struct {
		c   *lnd.Config
		ctx context.Context
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "test",
			args: args{c: lndConfig, ctx: context.TODO()},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetInfo(tt.args.ctx, tt.args.c)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetInfo() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			t.Log(got)
		})
	}
}

func TestGetInfo1(t *testing.T) {
	interceptor, err := signal.Intercept()
	if err != nil {
		t.Fatal(err)
	}
	lndConfig, err := lnd_node.CheckAndParse(interceptor, "", bytes.NewBufferString("[Application Options]\ndebuglevel=trace\nmaxpendingchannels=10\nalias=Bevm_client_test\nno-macaroons=false\ncoin-selection-strategy=largest\nrpclisten=localhost:10009\nrestlisten=localhost:8080\nno-rest-tls=true\nrestcors=https://bevmhub.bevm.io\n\n[Bitcoin]\nbitcoin.mainnet=false\nbitcoin.testnet=false\nbitcoin.simnet=false\nbitcoin.regtest=false\nbitcoin.signet=true\nbitcoin.node=neutrino\n\n[neutrino]\nneutrino.addpeer=x49.seed.signet.bitcoin.sprovoost.nl\nneutrino.addpeer=v7ajjeirttkbnt32wpy3c6w3emwnfr3fkla7hpxcfokr3ysd3kqtzmqd.onion:38333\n\n[protocol]\nprotocol.simple-taproot-chans=true"))
	if err != nil {
		t.Fatal(err)
	}
	type args struct {
		c   *lnd.Config
		ctx context.Context
	}
	tests := []struct {
		name    string
		args    args
		want    *lnrpc.GetInfoResponse
		wantErr bool
	}{
		{
			name:    "test",
			args:    args{lndConfig, context.TODO()},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetInfo(tt.args.ctx, tt.args.c)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetInfo() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			t.Log(got)

		})
	}
}

func TestGetState(t *testing.T) {
	interceptor, err := signal.Intercept()
	if err != nil {
		t.Fatal(err)
	}
	lndConfig, err := lnd_node.CheckAndParse(interceptor, "", bytes.NewBufferString("[Application Options]\ndebuglevel=trace\nmaxpendingchannels=10\nalias=Bevm_client_test\nno-macaroons=false\ncoin-selection-strategy=largest\nrpclisten=localhost:10009\nrestlisten=localhost:8080\nno-rest-tls=true\nrestcors=https://bevmhub.bevm.io\n\n[Bitcoin]\nbitcoin.mainnet=false\nbitcoin.testnet=false\nbitcoin.simnet=false\nbitcoin.regtest=false\nbitcoin.signet=true\nbitcoin.node=neutrino\n\n[neutrino]\nneutrino.addpeer=x49.seed.signet.bitcoin.sprovoost.nl\nneutrino.addpeer=v7ajjeirttkbnt32wpy3c6w3emwnfr3fkla7hpxcfokr3ysd3kqtzmqd.onion:38333\n\n[protocol]\nprotocol.simple-taproot-chans=true"))
	if err != nil {
		t.Fatal(err)
	}
	type args struct {
		c   *lnd.Config
		ctx context.Context
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name:    "test",
			args:    args{lndConfig, context.TODO()},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetState(tt.args.ctx, tt.args.c)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetState() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			t.Log(got)
		})
	}
}

func TestListAddresses(t *testing.T) {
	interceptor, err := signal.Intercept()
	if err != nil {
		t.Fatal(err)
	}
	lndConfig, err := lnd_node.CheckAndParse(interceptor, "", bytes.NewBufferString("[Application Options]\ndebuglevel=trace\nmaxpendingchannels=10\nalias=Bevm_client_test\nno-macaroons=false\ncoin-selection-strategy=largest\nrpclisten=localhost:10009\nrestlisten=localhost:8080\nno-rest-tls=true\nrestcors=https://bevmhub.bevm.io\n\n[Bitcoin]\nbitcoin.mainnet=false\nbitcoin.testnet=false\nbitcoin.simnet=false\nbitcoin.regtest=false\nbitcoin.signet=true\nbitcoin.node=neutrino\n\n[neutrino]\nneutrino.addpeer=x49.seed.signet.bitcoin.sprovoost.nl\nneutrino.addpeer=v7ajjeirttkbnt32wpy3c6w3emwnfr3fkla7hpxcfokr3ysd3kqtzmqd.onion:38333\n\n[protocol]\nprotocol.simple-taproot-chans=true"))
	if err != nil {
		t.Fatal(err)
	}
	type args struct {
		c   *lnd.Config
		ctx context.Context
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "test",
			args: args{
				c:   lndConfig,
				ctx: context.TODO(),
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := ListAddresses(tt.args.ctx, tt.args.c)
			if (err != nil) != tt.wantErr {
				t.Errorf("ListAddresses() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			t.Log(got)
		})
	}
}
