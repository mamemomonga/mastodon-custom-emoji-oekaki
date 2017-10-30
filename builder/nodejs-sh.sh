#!/bin/bash
set -euo pipefail

cd $(dirname $0)

. ./config.env
make

exec docker run -it --rm \
	-v $(pwd)/../app:/volumes/app:ro \
	-v $(pwd)/var:/volumes/var \
	$DCRIMG_ND sh

