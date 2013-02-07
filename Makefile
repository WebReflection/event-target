.PHONY: clean test dependencies

# default build task
build:
	mkdir -p build
	cat template/var.before src/EventTarget.js template/var.after >build/no-copy.event-target.max.js
	node node_modules/uglify-js/bin/uglifyjs --verbose build/no-copy.event-target.max.js >build/no-copy.event-target.js
	cat template/copyright build/no-copy.event-target.max.js >build/event-target.max.js
	cat template/copyright build/no-copy.event-target.js >build/event-target.js
	# node.js var EventTarget = require('event-target');
	cat template/node.before src/EventTarget.js template/node.after >build/no-copy.event-target.max.node.js
	node node_modules/uglify-js/bin/uglifyjs --verbose build/no-copy.event-target.max.node.js >build/no-copy.event-target.node.js
	cat template/copyright build/no-copy.event-target.max.node.js >build/event-target.node.js
	# AMD define(EventTarget)
	cat template/amd.before src/EventTarget.js template/amd.after >build/no-copy.event-target.max.amd.js
	node node_modules/uglify-js/bin/uglifyjs --verbose build/no-copy.event-target.max.amd.js >build/no-copy.event-target.amd.js
	cat template/copyright build/no-copy.event-target.max.amd.js >build/event-target.max.amd.js
	cat template/copyright build/no-copy.event-target.amd.js >build/event-target.amd.js
	rm build/no-copy.*.js
	make test

# clean/remove build folder
clean:
	rm -rf build

# tests, as usual and of course
test:
	wru test/EventTarget.js

# modules used in this repo
dependencies:
	rm -rf node_modules
	mkdir node_modules
	npm install wru
	npm install polpetta
	npm install uglify-js@1

