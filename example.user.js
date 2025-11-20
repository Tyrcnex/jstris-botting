// ==UserScript==
// @name         jstris pento bot code
// @version      6.7
// @match        https://jstris.jezevec10.com/*
// @match        https://jstris.jezevec10.com
// @grant        none
// ==/UserScript==

console.log("PENTO BOT RAAA");

const KEY_DATA = {
    "Softdrop": 40,
    "TapLeft": 37,
    "TapRight": 39,
    "DASLeft": 37,
    "DASRight": 39,
    "RotateCW": 38,
    "RotateCCW": 90,
    "Rotate180": 65,
    "Harddrop": 32,
    "Hold": 67
};

const BLOCKS = ["I5","V5","T5","U5","W5","X5","J5","L5","S5","Z5","TL","TJ","OZ","OS","TS","TZ","LL","JJ"];

window.sleep = ms => new Promise(r => setTimeout(r, ms));
window.done = false;
window.settings = { pps: 2, human: true, das: 100 };

async function makeMove() {
    if (window.done) { return; }

    if (GAME_OBJECT.gameEnded || GAME_OBJECT.place) {
        await window.sleep(100);
        document.getElementById("res").click();
        await window.sleep(20);
        return await makeMove();
    }

    let board = structuredClone(GAME_OBJECT.matrix);
    board.reverse();

    fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            board: board.map(r => r.map(c => +!!c)),
            hold: BLOCKS[GAME_OBJECT.blockInHold?.id],
            queue: [GAME_OBJECT.activeBlock, ...GAME_OBJECT.queue].map(p => BLOCKS[p.id]),
            settings
        }),
    }).then(x => x.json()).then(async x => {
        let allKeys = [];
        for (const key of x.allKeys) {
            allKeys.push({ type: "keydown", key, sleep: key == "DASLeft" || key == "DASRight" ? settings.das * 1.1 : key == "Softdrop" ? 18 : settings.das * 0.5 });
            allKeys.push({ type: "keyup", key, sleep: settings.das * 0.5 });
        }
        for await (const key of allKeys) {
            let func = (key.type == "keydown" ? GAME_OBJECT.keyInput2 : GAME_OBJECT.keyInput3).bind(GAME_OBJECT);
            func({ keyCode: KEY_DATA[key.key], timestamp: performance.now(), shiftKey: false, preventDefault: _ => { }, stopPropagation: _ => { }, stopImmediatePropagation: _ => { } });
            await window.sleep(key.sleep);
        }
        makeMove();
    });
}

const waitGame = setInterval(_ => {
    if (!window.GAME_OBJECT) return;
    clearInterval(waitGame);
    makeMove();
}, 100);