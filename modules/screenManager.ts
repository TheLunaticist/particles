"use strict";

import { Screen, StartScreen, GameScreen, EndScreen } from "modules/screen.js";
import { canvas } from "modules/graphics.js";

export class ScreenManager {
    static halveFps: boolean;
    static continueRendering = false;
    static evenFrame = true;
    static lastAnimationFrame: number | null = null;

    static markedForRedraw = false;

    //screens
    static START_SCREEN: Screen;
    static GAME_SCREEN: Screen;
    static END_SCREEN: Screen;

    static activeScreen: Screen | null = null;

    static setActiveScreen(screen: Screen) {
        this.activeScreen?.close();
        //cancelling old animation frame
        if (ScreenManager.lastAnimationFrame !== null) {
            window.cancelAnimationFrame(ScreenManager.lastAnimationFrame);
        }

        ScreenManager.activeScreen = screen;
        screen.open();

        ScreenManager.continueRendering = screen.liveRendering;
        if (screen.liveRendering === true) {
            ScreenManager.lastAnimationFrame = window.requestAnimationFrame(
                ScreenManager.renderLoop,
            );
        }
    }

    static init() {
        ScreenManager.START_SCREEN = new StartScreen();
        ScreenManager.GAME_SCREEN = new GameScreen();
        ScreenManager.END_SCREEN = new EndScreen();

        window.addEventListener("resize", (_: UIEvent) => {
            let clientRect = canvas.getClientRects()[0];
            canvas.width = clientRect.width;
            canvas.height = clientRect.height;
            ScreenManager.activeScreen?.draw();
        });

        //input forwarding to active screen
        canvas.addEventListener("mousemove", (event) => {
            ScreenManager.activeScreen?.mouseMoveEvent(event);
			ScreenManager.redrawIfShould();
        });

        canvas.addEventListener("mouseup", (event) => {
            this.activeScreen?.mouseUpEvent(event);
			ScreenManager.redrawIfShould();
        });

        canvas.addEventListener("mousedown", (event) => {
            this.activeScreen?.mouseDownEvent(event);
			ScreenManager.redrawIfShould();
        });
    }

    static renderLoop() {
        ScreenManager.evenFrame = !ScreenManager.evenFrame;
        if (!ScreenManager.evenFrame) {
            ScreenManager.activeScreen?.draw();
        }

        if (ScreenManager.continueRendering)
            ScreenManager.lastAnimationFrame = window.requestAnimationFrame(
                ScreenManager.renderLoop,
            );
    }

    //a window can request a redraw by calling the mark for redraw function
    static markForRedraw() {
		if(!ScreenManager.continueRendering){
			ScreenManager.markedForRedraw = true;
		}
    }

    static redrawIfShould() {
        if (ScreenManager.markedForRedraw) {
            ScreenManager.activeScreen!.draw();
            ScreenManager.markedForRedraw = false;
        }
    }
}

ScreenManager.init();
