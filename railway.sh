#!/bin/bash

echo "Installing Arduino CLI..."

mkdir -p arduino-cli-bin

curl -fsSL https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Linux_64bit.tar.gz -o cli.tar.gz

tar -xvf cli.tar.gz -C arduino-cli-bin

chmod +x arduino-cli-bin/arduino-cli

export PATH=$PATH:$(pwd)/arduino-cli-bin

echo "Installing cores..."

./arduino-cli-bin/arduino-cli core update-index
./arduino-cli-bin/arduino-cli core install arduino:avr

echo "Setup done"
