#!/bin/bash
set -euo pipefail

cd $(dirname $0)

. ./config.env

make

if [ -d var/preview ]; then
	rm -rf var/preview
fi

mkdir -p var/preview
cp -a ../app var/preview
cp var/index.prod.html var/preview/index.html

docker run -it --rm \
	-p 3000:3000/tcp \
	-e DEBUG='webserver:*' \
	-w /opt/webserver \
	-v $(pwd)/var/preview:/volumes/app \
	$DCRIMG_ND npm start

