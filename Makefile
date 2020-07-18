all:
	elm make ./src/Main.elm --output elm.js
	cp ./elm.js ./sites/elm.js
	rm -rf ./build
	mkdir ./build
	cp -r ./sites/* ./build/
