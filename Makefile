all:
	elm make src/Main.elm --output=sites/elm.js
	rm -rf ./build
	mkdir ./build
	cp -r ./sites/* ./build/

