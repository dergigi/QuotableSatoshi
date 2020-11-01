#!/bin/sh
ncu -u
git add .
git commit -m "build: ncu -u"

yarn install
git add .
git commit -m "build: yarn install"

npm audit fix
git add .
git commit -m "build: npm audit fix"
