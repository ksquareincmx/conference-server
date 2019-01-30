#!/usr/bin/env bash
curl -sL https://deb.nodesource.com/setup_10.x | bash -
curl -Ls https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list
apt-get update
apt-get install -y build-essential nodejs yarn
