// Copyright (c) 2013-2017 The btcsuite developers
// Copyright (c) 2015-2016 The Decred developers
// Copyright (C) 2015-2022 The Lightning Network Developers

package lnd_ops

import (
	"context"
	"crypto/tls"
	"fmt"
	"github.com/lightningnetwork/lnd"
	"github.com/lightningnetwork/lnd/lncfg"
	"github.com/lightningnetwork/lnd/lnrpc"
	"github.com/lightningnetwork/lnd/macaroons"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/metadata"
	"net"
	"os"
	"strconv"
)

const (
	defaultRPCPort = "10009"
)

var (
	// maxMsgRecvSize is the largest message our client will receive. We
	// set this to 200MiB atm.
	maxMsgRecvSize = grpc.MaxCallRecvMsgSize(lnrpc.MaxGrpcMsgSize)
)

func fatal(err error) {
	fmt.Fprintf(os.Stderr, "[lncli] %v\n", err)
	os.Exit(1)
}

func getWalletUnlockerClient(c *lnd.Config) (lnrpc.WalletUnlockerClient, func(), error) {
	conn, err := getClientConn(c, true)
	if err != nil {
		return nil, func() {}, err
	}

	cleanUp := func() {
		conn.Close()
	}

	return lnrpc.NewWalletUnlockerClient(conn), cleanUp, nil
}

func getStateServiceClient(c *lnd.Config) (lnrpc.StateClient, func(), error) {
	conn, err := getClientConn(c, true)
	if err != nil {
		return nil, func() {}, err
	}
	cleanUp := func() {
		conn.Close()
	}

	return lnrpc.NewStateClient(conn), cleanUp, nil
}

func getClient(c *lnd.Config) (lnrpc.LightningClient, func(), error) {
	conn, err := getClientConn(c, false)
	if err != nil {
		return nil, func() {}, err
	}
	cleanUp := func() {
		conn.Close()
	}

	return lnrpc.NewLightningClient(conn), cleanUp, nil
}

func getClientConn(c *lnd.Config, skipMacaroons bool) (*grpc.ClientConn, error) {
	// First, we'll get the selected stored profile or an ephemeral one
	// created from the global options in the CLI context.
	profile, err := getGlobalOptions(c, skipMacaroons)
	if err != nil {
		return nil, fmt.Errorf("could not load global options: %w", err)
	}

	// Create a dial options array.
	opts := []grpc.DialOption{
		grpc.WithUnaryInterceptor(
			addMetadataUnaryInterceptor(profile.Metadata),
		),
		grpc.WithStreamInterceptor(
			addMetaDataStreamInterceptor(profile.Metadata),
		),
	}

	if profile.Insecure {
		opts = append(opts, grpc.WithInsecure())
	} else {
		// Load the specified TLS certificate.
		certPool, err := profile.cert()
		if err != nil {
			return nil, fmt.Errorf("could not create cert pool: %w", err)
		}

		// Build transport credentials from the certificate pool. If
		// there is no certificate pool, we expect the server to use a
		// non-self-signed certificate such as a certificate obtained
		// from Let's Encrypt.
		var creds credentials.TransportCredentials
		if certPool != nil {
			creds = credentials.NewClientTLSFromCert(certPool, "")
		} else {
			// Fallback to the system pool. Using an empty tls
			// config is an alternative to x509.SystemCertPool().
			// That call is not supported on Windows.
			creds = credentials.NewTLS(&tls.Config{})
		}

		opts = append(opts, grpc.WithTransportCredentials(creds))
	}

	// Only process macaroon credentials if --no-macaroons isn't set and
	// if we're not skipping macaroon processing.
	if !profile.NoMacaroons && !skipMacaroons {
		// Find out which macaroon to load.
		macName := profile.Macaroons.Default
		var macEntry *macaroonEntry
		for _, entry := range profile.Macaroons.Jar {
			if entry.Name == macName {
				macEntry = entry
				break
			}
		}
		if macEntry == nil {
			return nil, fmt.Errorf("macaroon with name '%s' not found "+
				"in profile", macName)
		}

		// Get and possibly decrypt the specified macaroon.
		//
		// TODO(guggero): Make it possible to cache the password so we
		// don't need to ask for it every time.
		mac, err := macEntry.loadMacaroon(func(prompt string) ([]byte, error) {
			return []byte{}, nil
		})
		if err != nil {
			return nil, fmt.Errorf("could not load macaroon: %w", err)
		}

		macConstraints := []macaroons.Constraint{
			// We add a time-based constraint to prevent replay of
			// the macaroon. It's good for 60 seconds by default to
			// make up for any discrepancy between client and server
			// clocks, but leaking the macaroon before it becomes
			// invalid makes it possible for an attacker to reuse
			// the macaroon. In addition, the validity time of the
			// macaroon is extended by the time the server clock is
			// behind the client clock, or shortened by the time the
			// server clock is ahead of the client clock (or invalid
			// altogether if, in the latter case, this time is more
			// than 60 seconds).
			// TODO(aakselrod): add better anti-replay protection.
			macaroons.TimeoutConstraint(profile.Macaroons.Timeout),

			// Lock macaroon down to a specific IP address.
			macaroons.IPLockConstraint(profile.Macaroons.IP),

			// ... Add more constraints if needed.
		}

		// Apply constraints to the macaroon.
		constrainedMac, err := macaroons.AddConstraints(
			mac, macConstraints...,
		)
		if err != nil {
			return nil, err
		}

		// Now we append the macaroon credentials to the dial options.
		cred, err := macaroons.NewMacaroonCredential(constrainedMac)
		if err != nil {
			return nil, fmt.Errorf("error cloning mac: %w", err)
		}
		opts = append(opts, grpc.WithPerRPCCredentials(cred))
	}

	//// If a socksproxy server is specified we use a tor dialer
	//// to connect to the grpc server.
	//if ctx.GlobalIsSet("socksproxy") {
	//	socksProxy := ctx.GlobalString("socksproxy")
	//	torDialer := func(_ ontext.Context, addr string) (net.Conn,
	//		error) {
	//
	//		return tor.Dial(
	//			addr, socksProxy, false, false,
	//			tor.DefaultConnTimeout,
	//		)
	//	}
	//	opts = append(opts, grpc.WithContextDialer(torDialer))
	//} else {
	// We need to use a custom dialer so we can also connect to
	// unix sockets and not just TCP addresses.
	genericDialer := lncfg.ClientAddressDialer(strconv.Itoa(c.RPCListeners[0].(*net.TCPAddr).Port))
	opts = append(opts, grpc.WithContextDialer(genericDialer))
	//}

	opts = append(opts, grpc.WithDefaultCallOptions(maxMsgRecvSize))

	conn, err := grpc.Dial(profile.RPCServer, opts...)
	if err != nil {
		return nil, fmt.Errorf("unable to connect to RPC server: %w", err)
	}

	return conn, nil
}

// addMetadataUnaryInterceptor returns a grpc client side interceptor that
// appends any key-value metadata strings to the outgoing context of a grpc
// unary call.
func addMetadataUnaryInterceptor(
	md map[string]string) grpc.UnaryClientInterceptor {

	return func(ctx context.Context, method string, req, reply interface{},
		cc *grpc.ClientConn, invoker grpc.UnaryInvoker,
		opts ...grpc.CallOption) error {

		outCtx := contextWithMetadata(ctx, md)
		return invoker(outCtx, method, req, reply, cc, opts...)
	}
}

// addMetaDataStreamInterceptor returns a grpc client side interceptor that
// appends any key-value metadata strings to the outgoing context of a grpc
// stream call.
func addMetaDataStreamInterceptor(
	md map[string]string) grpc.StreamClientInterceptor {

	return func(ctx context.Context, desc *grpc.StreamDesc,
		cc *grpc.ClientConn, method string, streamer grpc.Streamer,
		opts ...grpc.CallOption) (grpc.ClientStream, error) {

		outCtx := contextWithMetadata(ctx, md)
		return streamer(outCtx, desc, cc, method, opts...)
	}
}

// contextWithMetaData appends the given metadata key-value pairs to the given
// context.
func contextWithMetadata(ctx context.Context,
	md map[string]string) context.Context {

	kvPairs := make([]string, 0, 2*len(md))
	for k, v := range md {
		kvPairs = append(kvPairs, k, v)
	}

	return metadata.AppendToOutgoingContext(ctx, kvPairs...)
}
