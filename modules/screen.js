import { UIText, HorizontalAnchor, VerticalAnchor, UIButton, } from "./uiElement.js";
import { Vector2 } from "./vector2.js";

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
}

export class StartScreen extends Screen {
    constructor() {
	super(false);
	this.uiElements.push(
	    UIText.new({
		anchorVertical: VerticalAnchor.MIDDLE,
		anchorHorizontal: HorizontalAnchor.MIDDLE,
		offset: new Vector2(0, 0),
		size: new Vector2(0, 48),
		text: "Particles",
	    })
	);
	this.uiElements.push(
	    UIButton.new({
		anchorVertical: VerticalAnchor.MIDDLE,
		anchorHorizontal: HorizontalAnchor.MIDDLE,
		offset: new Vector2(0, 48),
		size: new Vector2(72, 36),
		text: "Play",
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
	
