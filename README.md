# jstris botting

this is a guide on how to control the jstris website to make a bot, like freyhoe's jstris port of blockfish.

## IMPORTANT: YOU MUST, MUST, tell jezevec10 or a jstris moderator about making a bot and make a hidden account. do NOT spam replays, get false records, or use this for other malicious intent

## get started
1. use pre v144 firefox. dont know a solution for this yet, but this is the only way to use `beforescriptexecute` correctly (polyfills in chrome or other browsers dont work, at least when i tried it)
2. download cors everywhere and tampermonkey extension
3. install the userscript in `jstris.user.js`.
4. open up jstris and run the cors extension.

# how to use

now in the js console on the jstris website, you can use the `GAME_OBJECT` variable to do certain things:
- `keyInput2` and `keyInput3` for keydown and keyup respectively, e.g. `GAME_OBJECT.keyInput2({key: "ArrowLeft",keyCode:37,timestamp:performance.now(),shiftKey:false,preventDefault:=>{},stopPropagation:=>{},stopImmediatePropagation:=>{},})`
- `matrix` for the board state
- `blockInHold`, `activeBlock`, and `queue` for pieces seen on the board
- explore this object yourself!

see `example.user.js` for an old version of a pento bot i have. it's a repl loop that you can send requests to via localhost and then itll output actions like DASLeft, TapRight, or Softdrop that the code then translates into jstris actions