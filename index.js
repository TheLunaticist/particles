"use strict";

import { AssetManager, LoadAssetError } from "./m/assetManager.js";
import { Game } from "./m/game.js";
import { ScreenManager } from "./m/screenManager.js";


//making canvas context accessible from everywhere
window.ctx = window.canvas.getContext("2d");

function startGame() {
    Game.init(document.getElementById("canvas"));
    ScreenManager.setActiveScreen(ScreenManager.START_SCREEN);
}

//game start
try {
    await AssetManager.load();
} catch(e) {
    if(e instanceof LoadAssetError) {
	e.log();
    } else {
	throw e;
    }
}

startGame();
