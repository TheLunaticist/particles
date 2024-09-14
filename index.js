"use strict";

import { AssetManager } from "./modules/assetManager.js";
import { Game } from "./modules/game.js";
import { ScreenManager } from "./modules/screenManager.js";

//making canvas context accessible from everywhere
window.ctx = window.canvas.getContext("2d");

function startGame() {
    Game.init(document.getElementById("canvas"));
    ScreenManager.setActiveScreen(ScreenManager.START_SCREEN);
}

//game start
await AssetManager.load().catch((error) => { console.log(error); console.log(error.rejectReasons);});
startGame();
