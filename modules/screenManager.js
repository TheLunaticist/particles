"use strict";

import { StartScreen, GameScreen, EndScreen } from "./screen.js";

export class ScreenManager {
    static halveFps;
    static continueRendering = false;
    static evenFrame = true;
    static lastAnimationFrame = undefined;

    static markForRedraw = false;

    //screens
    static START_SCREEN;
    static GAME_SCREEN;
    static END_SCREEN;

    static activeScreen = null;

    static setActiveScreen(screen) {
	ScreenManager.activeScreen?.close();

	//cancelling old animation frame
	if(ScreenManager.lastAnimationFrame !== undefined) {
	    window.cancelAnimationFrame(ScreenManager.lastAnimationFrame);
	}

	ScreenManager.activeScreen = screen;
	screen.open();


	ScreenManager.continueRendering = screen.liveRendering;
	if(screen.liveRendering === true) {
	    ScreenManager.lastAnimationFrame = window.requestAnimationFrame(ScreenManager.renderLoop);
	}
    }

    static init() {
	ScreenManager.START_SCREEN = new StartScreen();
	ScreenManager.GAME_SCREEN = new GameScreen();
	ScreenManager.END_SCREEN = new EndScreen();

	window.addEventListener("resize", (e) => {
	    let clientRect = canvas.getClientRects()[0];
	    canvas.width = clientRect.width;
	    canvas.height = clientRect.height;
	    ScreenManager.activeScreen.draw();
	});

	canvas.addEventListener("mousemove", (e) => {
	    if(ScreenManager.activeScreen !== null) {
		ScreenManager.activeScreen.mouseMove(e);
	    }

	    if(ScreenManager.markForRedraw) {
		ScreenManager.activeScreen.draw();
		ScreenManager.markForRedraw = false;
	    }
	});
	
	canvas.addEventListener("mouseup", (e) => {
	    this.activeScreen?.mouseClick(e);
	});	

	ScreenManager.determineFps();
    }

    static renderLoop() {
	ScreenManager.evenFrame = !ScreenManager.evenFrame;
	if(!ScreenManager.evenFrame) {
	    ScreenManager.activeScreen.draw();
	}

	if(ScreenManager.continueRendering) ScreenManager.lastAnimationFrame = window.requestAnimationFrame(ScreenManager.renderLoop);
    }

    static redraw() {
	ScreenManager.markForRedraw = true;
    }

    static async determineFps() {
	await new Promise((resolve) => {
	    requestAnimationFrame(resolve);
	});
	let timeA = Date.now();

	await new Promise((resolve) => {
	    requestAnimationFrame(resolve);
	});

	console.log(Date.now() - timeA);
    }


}

ScreenManager.init();
