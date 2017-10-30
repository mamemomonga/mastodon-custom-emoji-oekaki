.PHONY: all clean

include config.env

define find_build_file
	$(shell find $1 -type f ! -path $1/built)
endef

define docker_build
	docker build -t $1 $2
	touch $@
endef

SHELL=bash
BUILDNUM=$(shell BN=$$(expr "$$(cat ../BUILDNUM)" + 1); echo $$BN > ../BUILDNUM; echo $$BN)

all: var/ ../index.html

closure-compiler/built: $(call find_build_file, closure-compiler)
	$(call docker_build, $(DCRIMG_CC), closure-compiler)

nodejs/built: $(call find_build_file, nodejs)
	$(call docker_build, $(DCRIMG_ND), nodejs)

var/:
	mkdir -p $@

var/index.min.js: \
	closure-compiler/built \
	../app/index.js

	docker run --rm \
		-v $(CURDIR)/../app:/volumes/app:ro \
		-v $(CURDIR)/var:/volumes/var \
		$(DCRIMG_CC)

../index.html: \
	nodejs/built \
	var/index.min.js \
	../app/index.ejs.html \
	../app/index.css \
	../app/reset.css

	docker run --rm \
		-e BUILDNUM=$(BUILDNUM) \
		-v $(CURDIR)/../app:/volumes/app:ro \
		-v $(CURDIR)/var:/volumes/var \
		$(DCRIMG_ND) node /build.js
	cp var/index.prod.html ../index.html
	cp var/index.dev.html ../app/index.html

clean:
	rm -rf var
	rm -f ../index.html ../app/index.html closure-compiler/built nodejs/built

