"use strict";

import { Game } from "./game.js";
import { GUIManager } from "./guiManager.js";
import { Vector2 } from "./vector2.js";

export class InputManager {
	static curMouseX = 0;
	static curMouseY = 0;
	
	
	static init() {
		canvas.addEventListener("mousemove", (event) => {
			let canvasRect = canvas.getBoundingClientRect();
			InputManager.curMouseX = event.clientX - canvasRect.left;
			InputManager.curMouseY = event.clientY - canvasRect.top;
		});
		
		canvas.addEventListener("mousedown", (event) => {
			let canvasRect = canvas.getBoundingClientRect();
			let mouseX = event.clientX - canvasRect.left;
			let mouseY = event.clientY - canvasRect.top;
	
			let doPassthrough = GUIManager.handleClick(mouseX, mouseY);
			if(doPassthrough) {
				Game.state.placementAttemptPosition = new Vector2(mouseX, mouseY);
			}
		});
	}
}
