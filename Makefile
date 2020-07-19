all:
	elm make src/Main.elm --output=elm.js
	cp ./elm.js ./sites/elm.js
	rm elm.js

