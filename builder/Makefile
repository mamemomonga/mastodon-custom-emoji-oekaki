.PHONY: all clean

include config.env

define FIND_BUILD_FILE
	$(shell find $1 -type f ! -path $1/built)
endef

define DOCKER_BUILD
	mkdir -p var
	docker build -t $1 $2
	touch $@
endef

define DOCKER_RUN_NODE
	docker run --rm \
		-e BUILDNUM=$(BUILDNUM) \
		-v $(CURDIR)/../app:/volumes/app:ro \
		-v $(CURDIR)/var:/volumes/var \
		-v $(CURDIR)/../MANUAL.md:/volumes/MANUAL.md:ro \
		$(DCRIMG_ND) node /build.js $1
endef

SHELL=bash
BUILDNUM:=$(shell BN=$$(expr "$$(cat ../BUILDNUM)" + 1); echo $$BN > ../BUILDNUM; echo $$BN)

TARGETS=../index.html ../app/index.html ../app/manual.html
all: $(TARGETS)

../index.html: nodejs/built \
	var/index.min.js \
	../app/index.ejs.html \
	../app/index.css \
	../app/reset.css
	$(call DOCKER_RUN_NODE, prod)
	cp var/index.prod.html $@

../app/index.html: nodejs/built \
	../app/index.ejs.html
	$(call DOCKER_RUN_NODE, dev)
	cp var/index.dev.html $@

../app/manual.html: nodejs/built \
	../app/manual.ejs.html
	$(call DOCKER_RUN_NODE, manual)
	cp var/manual.html $@

var/index.min.js: closure-compiler/built \
	../app/index.js
	docker run --rm \
		-v $(CURDIR)/../app:/volumes/app:ro \
		-v $(CURDIR)/var:/volumes/var \
		$(DCRIMG_CC)

closure-compiler/built: $(call FIND_BUILD_FILE, closure-compiler)
	$(call DOCKER_BUILD, $(DCRIMG_CC), closure-compiler)

nodejs/built: $(call FIND_BUILD_FILE, nodejs)
	$(call DOCKER_BUILD, $(DCRIMG_ND), nodejs)


clean:
	rm -rf closure-compiler/built nodejs/built var/index.min.js $(TARGETS)

