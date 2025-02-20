# lnd-desk

[lnd-desk](https://github.com/btclayer2/lnd-desk) is a cross-platform desktop application for managing and interacting with a **Lightning Network Daemon (LND)**, built using the **Wails framework** and written in **Go**. This application supports **Linux**, **macOS**, and **Windows**, and provides a user-friendly interface to perform LND operations and monitor BTC node block synchronization.

## Features

- **Paste LND configuration files**: Quickly configure and launch an LND instance locally.
- **Lightning Network support**: Seamlessly integrates with **Bevm-hub** to use the Lightning Network.
- **Lndcli support**: Partial support for Lndcli operations, including:
    - `create`: Create a new LND wallet.
    - `unlock`: Unlock an existing wallet.
- **BTC node synchronization**: Monitor the block synchronization status of the connected Bitcoin node.
- **Cross-platform**: Runs on Linux, macOS, and Windows.

---

## Prerequisites

Before you start developing `lnd-desk`, ensure you have the following installed:

1. **Go**: Version 1.19 or later is recommended.
2. **Wails Framework**: Follow the instructions below to set up Wails.

---

## Installing Wails Framework

1. Install **Node.js** and **pnpm**:
    - Install from the [official Node.js website](https://nodejs.org/).
    - Install **pnpm** using npm:
   
      ```bash
      npm install -g pnpm
      ```
2. Install **Go**:
    - Follow the instructions on the [official Go website](https://go.dev/doc/install).

3. Install the **Wails CLI**:

   ```bash
   go install github.com/wailsapp/wails/v2/cmd/wails@latest
   ```

4.	Verify the Wails CLI installation:
    
    ```bash
    wails doctor
    ```

---
## Building the Application
To build the application, clone the repository and run the build command with the required tags.

### Clone the Repository
```bash
git clone https://github.com/btclayer2/lnd-desk.git
cd lnd-desk
```

### Build the Application
Use the following command to build the application with all the necessary tags:
```bash
wails build -tags "autopilotrpc signrpc walletrpc chainrpc invoicesrpc neutrinorpc routerrpc watchtowerrpc monitoring peersrpc kvdb_postrgres kvdb_sqlite kvdb_etcd"
```

This will generate platform-specific binaries in the build/bin/ directory.

---

## Installation Instructions
### Using Pre-built Release Packages
Download the release package for your platform from the [Releases](https://github.com/btclayer2/LND-Desk/releases) section.

#### macOS Installation
- Since the app is not signed with a paid certificate, you need to allow installation of apps from “Unknown Developers”:
    1.	Open System Preferences > Security & Privacy > General.
    2.	If you see a message about lnd-desk, click Allow Anyway.

#### Windows Installation
- You may encounter a SmartScreen warning. To bypass this:
    1.	Click More Info.
    2.	Click Run Anyway.

#### Linux Installation
- Ensure the binary has execute permissions:
  ```bash
  chmod +x ./lnd-desk
  ```
- Run the application:
  ```bash
  ./lnd-desk
  ```


---
### Building from Source

If you don’t trust the release packages, you can clone the repository and build the app yourself (see Building the Application).

---
## Contributing

We welcome contributions to enhance lnd-desk. If you have feature requests, bug reports, or suggestions, please open an issue or create a pull request.

---
## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/btclayer2/LND-Desk/blob/main/README.md) file for details.

---
## Support

For questions or assistance, please open an issue in the repository.

---
## [FAQ](https://github.com/btclayer2/LND-Desk/wiki/Frequently-Asked-Questions)