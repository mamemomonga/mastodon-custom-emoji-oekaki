#!/bin/bash
set -euo pipefail

cd $(dirname $0)

. ./config.env

make

docker run -it --rm \
	-p 3000:3000/tcp \
	-e DEBUG='webserver:*' \
	-w /opt/webserver \
	-v $(pwd)/../app:/volumes/app:ro \
	-v $(pwd)/var:/volumes/var \
	$DCRIMG_ND npm start

