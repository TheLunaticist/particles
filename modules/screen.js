import { UIText, HorizontalAnchor, VerticalAnchor, UIButton, } from "/m/uiElement.js";
import { Vector2 } from "/m/vector2.js";
import { ScreenManager } from "/m/screenManager.js";
import { Game } from "/m/game.js";

class Screen {
    constructor(liveRendering) {
	this.liveRendering = liveRendering;
	this.uiElements = [];
    }

    draw() {
	this.uiElements.forEach((e) => {
	    e.draw();
	})
    }

    open() {}
    close() {}
    mouseMove(e) {
	this.uiElements.forEach((element) => {
	    element.mouseMove(e);
	});
    }
    
    mouseClick(e) {
	this.uiElements.forEach((element) => {
	    element.mouseClick(e);
	});
    }

}

export class StartScreen extends Screen {
    constructor() {
	super(false);
	this.uiElements.push(
	    UIText.new({
		anchorVertical: VerticalAnchor.MIDDLE,
		anchorHorizontal: HorizontalAnchor.MIDDLE,
		offset: new Vector2(0, 0),
		size: new Vector2(0, 96),
		text: "Particles"
	    })
	);
	this.uiElements.push(
	    UIButton.new({
		anchorVertical: VerticalAnchor.MIDDLE,
		anchorHorizontal: HorizontalAnchor.MIDDLE,
		offset: new Vector2(0, 48 + 32),
		size: new Vector2(0, 64),
		text: "Play",
		clickCallback: () => {
		    ScreenManager.setActiveScreen(ScreenManager.GAME_SCREEN);
		}
	    })
	)
    }

    draw() {
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	super.draw();
    }

    open() {
	this.draw();
    }
}

export class EndScreen extends Screen {
    constructor() {
	super(false);
	this.uiElements.push(
	    UIText.new({
		anchorVertical: VerticalAnchor.MIDDLE,
		anchorHorizontal: HorizontalAnchor.MIDDLE,
		offset: new Vector2(0, 0),
		size: new Vector2(0, 96),
		text: "Game Over"
	    })
	);
	this.uiElements.push(
	    UIButton.new({
		anchorVertical: VerticalAnchor.MIDDLE,
		anchorHorizontal: HorizontalAnchor.MIDDLE,
		offset: new Vector2(0, 48 + 32),
		size: new Vector2(0, 64),
		text: "Retry",
		clickCallback: () => {
		    ScreenManager.setActiveScreen(ScreenManager.GAME_SCREEN);
		}
	    })
	)
    }

    draw() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	super.draw();
	window.done = true;
    }

    open() {
	this.draw();
    }
}
	
export class GameScreen extends Screen {
    constructor() {
	super(true);
    }

    open() {
	Game.init();
    }

    draw() {
	Game.doFrame();
    }
}


