#!/bin/bash
set -eux

mkdir -p gh-pages

cp -f index.html gh-pages/
cp -f index.css gh-pages/
cp -f index.js gh-pages/
cp -f jquery-3.2.1.min.js gh-pages/

