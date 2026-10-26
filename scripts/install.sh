#!/usr/bin/env bash

GREEN='\033[0;32m'
BLUE='\033[1;34m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
NORMAL='\033[0;39m'
PURPLE='\033[0;35m'

INSTALLATION_PATH="/opt/pixies"

while getopts "d:" o > /dev/null 2>&1; do
    # shellcheck disable=SC2220
    case "${o}" in
        d) INSTALLATION_PATH=${OPTARG} ;;
    esac
done

if [ $EUID -ne 0 ]; then
  echo -e "$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-"
  echo -e "$RED✗ ABORTED"
  echo -e "$NORMAL The installation is currently running via a user without root privileges. However, this is required. Please log in with a Root Account to continue."
  echo -e "$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-$RED-$NORMAL-"
  exit
fi

ARCH=$(uname -m)
case "$ARCH" in
    x86_64)
        BINARY_NAME="Pixies-linux-x64"
        ;;
    aarch64|arm64)
        BINARY_NAME="Pixies-linux-arm64"
        ;;
    *)
        echo -e "$RED✗ Unsupported architecture: $ARCH"
        echo -e "$NORMAL Pixies only supports x64 and arm64 architectures."
        exit 1
        ;;
esac

echo -e "$GREEN ---------$BLUE Automatic Installation$GREEN ---------"
echo -e "$BLUE Pixies$YELLOW is now being installed."
echo -e "$YELLOW Version:$BLUE Pixies Release"
echo -e "$YELLOW Architecture:$BLUE $ARCH ($BINARY_NAME)"
echo -e "$YELLOW Location:$BLUE $INSTALLATION_PATH"
echo -e "$GREEN Installation will start in 5 seconds..."
echo -e "$GREEN ----------------------------------------------"
sleep 5
clear

if [ -d "$INSTALLATION_PATH" ]; then
    clear
    echo -e "$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-"
    echo -e ""
    echo -e "$YELLOW⚠ WARNING"
    echo -e "$NORMAL Pixies is already installed on this system."
    echo -e ""
    echo -e "$GREENℹ Info:$NORMAL Latest update will be installed..."
    echo -e ""
    echo -e "$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-$YELLOW-$NORMAL-"
    sleep 5
fi

if command -v systemctl &> /dev/null && systemctl --all --type service | grep -q "pixies.service"; then
  clear
  echo -e "$YELLOWℹ Pixies Service is being stopped..."
  systemctl stop pixies
fi

clear
echo -e ""
echo -e "$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-"
echo -e ""
echo -e "$BLUE🔎 STATUS MESSAGE"
echo -e "$NORMAL Searching for updates for Linux system..."
echo -e ""
echo -e "$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-"
echo -e ""
apt-get update -y

clear
echo -e "$GREENℹ Info:$NORMAL Installation is now being prepared. This may take a moment..."
sleep 3

function check() {
  clear
  echo -e "$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-"
  echo -e "$BLUE🔎 STATUS MESSAGE"
  echo -e "$NORMAL Checking if $1 is present..."
  echo -e "$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-$BLUE-$NORMAL-"
  echo -e ""
  if ! command -v "$1" &> /dev/null
  then
      echo -e "$YELLOWℹ \"$1\" is not installed.$NORMAL Installation will proceed..."
      sleep 2
      echo -e "$PURPLEℹ Installing..."
      apt-get install "$1" -y
  fi
}

check "wget"
check "curl"

clear

echo -e "$BLUE🔎 STATUS MESSAGE"
echo -e "$NORMAL Fetching latest release information..."
RELEASE_URL=$(curl -s https://api.github.com/repos/ikhsanddy/pixies/releases/latest | grep "browser_download_url.*$BINARY_NAME" | cut -d '"' -f 4)

if [ -z "$RELEASE_URL" ]; then
    echo -e "$RED✗ Could not find release for $BINARY_NAME"
    exit 1
fi

echo -e "$GREEN✓ Found release:$NORMAL $RELEASE_URL"
sleep 2

clear
echo -e "$GREEN✓ Preparation completed:$NORMAL Installation of Pixies will now commence..."
sleep 3

clear
if [ ! -d "$INSTALLATION_PATH" ]; then
    echo -e "$BLUEℹ Info: $NORMAL Pixies will be installed under directory $INSTALLATION_PATH. Creating the folder now."
    sleep 2
    mkdir -p "$INSTALLATION_PATH"
fi

cd "$INSTALLATION_PATH"

clear
echo -e "$BLUEℹ Info: $NORMAL Downloading Pixies binary. Please wait..."
sleep 2
wget -O pixies "$RELEASE_URL"
chmod +x pixies

clear
echo -e "$BLUE🔎 STATUS MESSAGE"
echo -e "$NORMAL Registering Pixies as a background service..."
echo -e ""
echo -e ""
sleep 2

if command -v systemctl &> /dev/null; then
  cat << EOF > /etc/systemd/system/pixies.service
[Unit]
Description=Pixies
After=network.target

[Service]
Type=simple
ExecStart=$INSTALLATION_PATH/pixies
Restart=always
User=root
WorkingDirectory=$INSTALLATION_PATH

[Install]
WantedBy=multi-user.target
EOF
  systemctl daemon-reload

  if ! systemctl is-enabled pixies &> /dev/null; then
    echo -e "$NORMALℹ Pixies will be added to autostart..."
    sleep 1
    systemctl enable pixies
  fi

  echo -e "$NORMALℹ Pixies service is starting..."
  sleep 1
  systemctl restart pixies
fi

clear

if ! command -v systemctl &> /dev/null; then
    echo -e "$YELLOW⚠ Warning: $NORMAL Your Linux system currently does not support starting Pixies in the background. \"systemd\" is required for this purpose."
    echo -e "$BLUEℹ Info: $NORMAL You can start Pixies manually by running: $INSTALLATION_PATH/pixies"
    sleep 5
fi

clear
echo -e "$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-"
echo -e "$GREEN✓ Installation completed: $NORMAL Pixies has been installed under $INSTALLATION_PATH."
echo -e "You can access the web interface in your browser at$BLUE http://$(curl -s ifconfig.me):5216$NORMAL."
if [ -d "$INSTALLATION_PATH" ]; then
  echo -e "$BLUEℹ Info:$NORMAL To restart Pixies:$BLUE systemctl restart pixies"
fi
echo -e "$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-$GREEN-$NORMAL-"
