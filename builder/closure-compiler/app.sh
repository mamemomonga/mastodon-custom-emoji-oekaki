#!/bin/bash
set -eux
java -jar /opt/closure-compiler.jar \
	--js /volumes/app/index.js \
	--compilation_level SIMPLE_OPTIMIZATIONS \
	--jscomp_off=internetExplorerChecks \
	--charset UTF-8 \
	--js_output_file=/volumes/var/index.min.js

