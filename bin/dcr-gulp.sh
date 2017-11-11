#!/bin/bash
set -eu
BASEDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
source $BASEDIR/bin/functions

dcr_prerun
exec docker run -it --rm $DCRRUN_OPT $DCRIMG sh -c 'npm run build'

