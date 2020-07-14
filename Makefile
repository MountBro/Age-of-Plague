all:
	mkdir build
	cp -r sites  build
	elm make src/Main.elm --output=build/elm.js


