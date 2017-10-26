#!/bin/bash
set -eu
BUILDNUM=$(expr "$(cat BUILDNUM)" + 1)
echo "BUILD: $BUILDNUM"
echo $BUILDNUM > BUILDNUM

# Docker Image名
DCRIMG_CC=mstdn-emj-oekk-cc
DCRIMG_ND=mstdn-emj-oekk-nd

mkdir -p var

docker build -t $DCRIMG_CC builder/closure-compiler
docker build -t $DCRIMG_ND builder/nodejs

docker run -it --rm \
	-v $(pwd)/app:/volumes/app:ro \
	-v $(pwd)/var:/volumes/var \
	$DCRIMG_CC

docker run -it --rm \
	-e BUILDNUM=$BUILDNUM \
	-v $(pwd)/app:/volumes/app:ro \
	-v $(pwd)/var:/volumes/var \
	$DCRIMG_ND

cp -f var/index.prod.html index.html
cp -f var/index.dev.html app/index.html
rm -rf var
