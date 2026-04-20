#!/bin/bash

echo "Installing Arduino CLI..."

curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh

export PATH=$PATH:~/.arduino-cli/bin

echo "Setting up cores..."

arduino-cli core update-index
arduino-cli core install arduino:avr

echo "Done setup"
