#!/bin/bash
# Dockerコンテナを使ったnode実行ツール
set -euo pipefail
BASEDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Dockerイメージ
#   https://hub.docker.com/_/node/
#   https://github.com/nodejs/docker-node/blob/d39f0a67e63c27300edf2a54a4bd599332c30089/8.9/alpine/Dockerfile
DCRIMG=node:8.9.1-alpine

# /home/node に割り当てる docker volume
DCRVOL_HOME=nodeapp-home

# nodeアプリケーションのポート番号
DCRPORT=3000

DCRRUN_OPT="\
	-v $DCRVOL_HOME:/home/node \
	-v $BASEDIR:/home/node/app \
	-p $DCRPORT:3000"

DCRRUN_USR="docker run -it --rm $DCRRUN_OPT -w /home/node/app -u node $DCRIMG"

if [ -z "$( docker volume ls --filter "name=$DCRVOL_HOME" --format '{{ .Name }}' )" ]; then
	echo "Creating Docker Volume: $DCRVOL_HOME"
	docker volume create $DCRVOL_HOME
fi

case "${1:-}" in
	"root" )
		exec docker run -it --rm $DCRRUN_OPT -w /root $DCRIMG sh
		;;

	"shell" )
		exec $DCRRUN_USR sh
		;;

	"install" )
		exec $DCRRUN_USR npm install
		;;

	"dev" )
		exec $DCRRUN_USR npm run gulp
		;;

	"build" )
		exec $DCRRUN_USR npm run gulp build
		;;

	* )
		echo "USAGE: $0 [ root | shell | install | dev | build"
		exit 1
		;;
esac

