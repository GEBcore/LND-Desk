
UNAME_S := $(shell uname -s)

buildapp: 
	wails build -tags "autopilotrpc signrpc walletrpc chainrpc invoicesrpc neutrinorpc routerrpc watchtowerrpc monitoring peersrpc kvdb_postrgres kvdb_sqlite kvdb_etcd"

devapp:
	wails dev -tags "autopilotrpc signrpc walletrpc chainrpc invoicesrpc neutrinorpc routerrpc watchtowerrpc monitoring peersrpc kvdb_postrgres kvdb_sqlite kvdb_etcd"

runapp:
ifeq ($(UNAME_S),Darwin)
	open "./build/bin/LND-Desk.app"
else ifeq ($(UNAME_S),Linux)
	@echo "TODO: Run the app on Linux"
else
	@echo "Unsupported operating system: $(UNAME_S)"
endif