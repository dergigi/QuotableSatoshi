#!/bin/sh
ncu -u
git add .
git commit -m "build: ncu -u"

yarn install
git add .
git commit -m "build: yarn install"

npx yarn-audit-fix
git add .
git commit -m "build: npx yarn-audit-fix"
