// ==UserScript==
// @name         jstris moment
// @version      6.7
// @match        https://jstris.jezevec10.com/*
// @match        https://jstris.jezevec10.com
// @run-at       document-start
// @connect      s.jezevec10.com
// @connect      jezevec10.com
// ==/UserScript==

function modifyCode(code) {
    // expose game object
    const gameName = code.match(/\((\w*?)\=new Game\(\)/)[1];
    code = code.replaceAll(gameName, `window.GAME_OBJECT`);
    code = code.replace(/var window\.GAME_OBJECT\s?=.+?;/, "");

    // remove browser tab focus change
    // there is an internal function called browserTabFocusChange. its definition is minified tho
    // find the string "Game lost focus during..." and then backtrack until you find smth like "function(_0x123456){var"
    // replace that with "function(){};var _nothin="
    code = code.replace(
        /window\[[_0-9a-zA-Z'()\[\]]+\]\([_0-9a-zA-Z'()\[\]]+,function\(\)/g,
        m => `${m}{},false,function()`
    );
    return code;
}

document.addEventListener('beforescriptexecute', e => {
    const script = e.target;

    if (!script.src || !script.src.includes('game.js')) return;

    e.preventDefault();
    e.stopPropagation();

    const xhr = new XMLHttpRequest();
    xhr.open('GET', script.src, false); // false = not async
    xhr.send();

    console.log(xhr.responseText);
    let modifiedCode = modifyCode(xhr.responseText);

    const blob = new Blob([modifiedCode], { type: 'application/javascript' });
    const newScript = document.createElement('script');
    newScript.src = URL.createObjectURL(blob);

    script.parentNode.replaceChild(newScript, script);

    console.log("loaded script (hopeful)");
}, true);