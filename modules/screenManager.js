"use strict";

import { StartScreen } from "./screen.js";

export class ScreenManager {
    static continueRendering;
    static evenFrame = true;
    static lastAnimationFrame = undefined;

    //screens
    static START_SCREEN;
    static GAME_SCREEN = undefined;

    static activeScreen = null;

    static setActiveScreen(screen) {
	ScreenManager.activeScreen?.close();

	ScreenManager.activeScreen = screen;
	screen.open();
	screen.draw();

	//cancelling old animation frame
	if(ScreenManager.lastAnimationFrame !== undefined) {
	    window.cancelAnimationFrame(lastAnimationFrame);
	}

	if(screen.liveRendering === true) {
	    ScreenManager.lastAnimationFrame = window.requestAnimationFrame(ScreenManager.renderLoop);
	}
    }

    static init() {
	ScreenManager.START_SCREEN = new StartScreen();
	ScreenManager.GAME_SCREEN = new StartScreen(); //TODO: remove

	window.addEventListener("resize", (e) => {
	    let clientRect = canvas.getClientRects()[0];
	    canvas.width = clientRect.width;
	    canvas.height = clientRect.height;
	    ScreenManager.activeScreen.draw();
	});

	canvas.addEventListener("mousemove", (e) => {
	    if(ScreenManager.activeScreen !== null) {
		ScreenManager.activeScreen.mouseMove();
	    }
	});
    }

    static renderLoop() {
	ScreenManager.evenFrame = !ScreenManager.evenFrame;
	if(!ScreenManager.evenFrame) {
	    //draw
	}

	if(ScreenManager.continueRendering) ScreenManager.lastAnimationFrame = window.requestAnimationFrame(ScreenManager.renderLoop);
    }
}


ScreenManager.init();
