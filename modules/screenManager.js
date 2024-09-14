"use strict";

import { UIText, HorizontalAnchor, VerticalAnchor, } from "./uiElement.js";
import { Vector2 } from "./vector2.js";

export class ScreenManager {
    static CANVAS;
    static CONTEXT;

    static continueRendering;
    static evenFrame = true;
    static lastAnimationFrame = undefined;

    //screens
    static START_SCREEN;
    static GAME_SCREEN;

    static activeScreen = null;

    static setActiveScreen(screen) {
	let oldScreen = ScreenManager.activeScreen;
	ScreenManager.activeScreen?.onClose?.(); //callling onClose event on the active screen if there is a active screen and the event exists

	screen.onOpen?.();
	screen.draw();
	ScreenManager.activeScreen = screen;

	//cancelling old animation frame
	if(ScreenManager.lastAnimationFrame !== undefined) {
	    window.cancelAnimationFrame(lastAnimationFrame);
	}

	if(screen.doRendering === true) {
	    ScreenManager.lastAnimationFrame = window.requestAnimationFrame(ScreenManager.renderLoop);
	}
    }

    static init() {
	ScreenManager.START_SCREEN = new Screen({
	    continueRendering: false,
	    onOpen: function() {
		this.draw();
	    },
	    onDraw: function() {
		ScreenManager.CONTEXT.fillStyle = "rgb(0, 0, 0)";
		ScreenManager.CONTEXT.fillRect(0, 0, ScreenManager.CANVAS.width, ScreenManager.CANVAS.height);
	    },
	    uiElements: [
		UIText.new({
		    anchorVertical: VerticalAnchor.MIDDLE,
		    anchorHorizontal: HorizontalAnchor.MIDDLE,
		    offset: new Vector2(0, 0),
		    size: new Vector2(0, 0),
		    text: "Particles",
		}),
	    ],
	});
	ScreenManager.GAME_SCREEN = new Screen({
	    continueRendering: true,
	});

	let canvas = document.getElementById("particlesCanvas");
	if(canvas === undefined) {
	    console.error("Couldn't get canvas.");
	    debugger;
	}
	ScreenManager.CANVAS = canvas;

	let context = canvas.getContext("2d");
	if(context === undefined) {
	    console.error("Coudn't get 2d context.");
	    debugger;
	}
	ScreenManager.CONTEXT = context;

	window.addEventListener("resize", (e) => {
	    ScreenManager.activeScreen.draw();
	});

	ScreenManager.CANVAS.addEventListener("mousemove", (e) => {
	    if(ScreenManager.activeScreen !== null) {
		ScreenManager.activeScreen.onMouseMove?.();
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

class Screen {
    constructor(screenArguments = {}) {
	this.onOpen = screenArguments.onOpen;
	this.onClose = screenArguments.onClose;
	this.onDraw = screenArguments.onDraw;
	this.onMouseMove = screenArguments.onMouseMove;
	this.uiElements = screenArguments.uiElements;
	this.doRendering = screenArguments.doRendering;
    }

    draw() {
	this.onDraw?.();

	this.uiElements?.forEach((e) => {
	    e.draw();
	})
    }

}

ScreenManager.init();
