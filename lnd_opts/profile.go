package lnd_ops

import (
	"crypto/x509"
	"errors"
	"fmt"
	"github.com/lightningnetwork/lnd"
	"os"
	"path"
	"strings"

	"gopkg.in/macaroon.v2"
)

var (
	errNoProfileFile = errors.New("no profile file found")
)

// profileEntry is a struct that represents all settings for one specific
// profile.
type profileEntry struct {
	Name        string            `json:"name"`
	RPCServer   string            `json:"rpcserver"`
	LndDir      string            `json:"lnddir"`
	Network     string            `json:"network"`
	NoMacaroons bool              `json:"no-macaroons,omitempty"` // nolint:tagliatelle
	TLSCert     string            `json:"tlscert"`
	Macaroons   *macaroonJar      `json:"macaroons"`
	Metadata    map[string]string `json:"metadata,omitempty"`
	Insecure    bool              `json:"insecure,omitempty"`
}

// cert returns the profile's TLS certificate as a x509 certificate pool.
func (e *profileEntry) cert() (*x509.CertPool, error) {
	if e.TLSCert == "" {
		return nil, nil
	}

	cp := x509.NewCertPool()
	if !cp.AppendCertsFromPEM([]byte(e.TLSCert)) {
		return nil, fmt.Errorf("credentials: failed to append " +
			"certificate")
	}
	return cp, nil
}

// getGlobalOptions returns the global connection options. If a profile file
// exists, these global options might be read from a predefined profile. If no
// profile exists, the global options from the command line are returned as an
// ephemeral profile entry.
func getGlobalOptions(c *lnd.Config, skipMacaroons bool) (*profileEntry,
	error) {
	return profileFromConfig(c, skipMacaroons)

}

func profileFromConfig(c *lnd.Config, skipMacaroons bool) (*profileEntry, error) {

	// Parse the paths of the cert and macaroon. This will validate the
	// chain and network value as well.
	tlsCertPath, macPath := c.TLSCertPath, c.AdminMacPath

	// Load the certificate file now, if specified. We store it as plain PEM
	// directly.
	var tlsCert []byte
	tlsCert, err := os.ReadFile(tlsCertPath)
	if err != nil {
		return nil, fmt.Errorf("could not load TLS cert "+
			"file: %v", err)
	}

	entry := &profileEntry{
		RPCServer:   c.RawRPCListeners[0],
		LndDir:      c.LndDir,
		Network:     c.ActiveNetParams.Name,
		NoMacaroons: c.NoMacaroons,
		TLSCert:     string(tlsCert),
		Metadata:    make(map[string]string),
		Insecure:    false,
	}

	if skipMacaroons || c.NoMacaroons {
		return entry, nil
	}

	// Now load and possibly encrypt the macaroon file.
	macBytes, err := os.ReadFile(macPath)
	if err != nil {
		return nil, fmt.Errorf("unable to read macaroon path (check "+
			"the network setting!): %v", err)
	}
	mac := &macaroon.Macaroon{}
	if err = mac.UnmarshalBinary(macBytes); err != nil {
		return nil, fmt.Errorf("unable to decode macaroon: %w", err)
	}

	var pw []byte

	macEntry := &macaroonEntry{}
	if err = macEntry.storeMacaroon(mac, pw); err != nil {
		return nil, fmt.Errorf("unable to store macaroon: %w", err)
	}

	// We determine the name of the macaroon from the file itself but cut
	// off the ".macaroon" at the end.
	macEntry.Name = path.Base(macPath)
	if path.Ext(macEntry.Name) == "macaroon" {
		macEntry.Name = strings.TrimSuffix(macEntry.Name, ".macaroon")
	}

	// Now that we have the macaroon jar as well, let's return the entry
	// with all the values populated.
	entry.Macaroons = &macaroonJar{
		Default: macEntry.Name,
		Timeout: 60,
		IP:      "",
		Jar:     []*macaroonEntry{macEntry},
	}

	return entry, nil
}
