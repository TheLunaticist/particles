"use strict";

import { Rectangle } from "./rectangle.js";
import { Vector2 } from "./vector2.js";

export class HorizontalAnchor {
    static LEFT = "LEFT";
    static MIDDLE = "MIDDLE";
    static RIGHT = "RIGHT";
}

export class VerticalAnchor {
    static TOP = "TOP";
    static MIDDLE = "MIDDLE";
    static BOTTOM = "BOTTOM";
}

class UIElement {
    constructor(args) {
	this.anchorVertical = args.anchorVertical;
	this.anchorHorizontal = args.anchorHorizontal;
	this.offset = args.offset;
	this.size = args.size;
    }

    getAnchorVertical() {
	if(this.anchorVertical === VerticalAnchor.LEFT) {
	    return 0;
	} else if(this.anchorVertical === VerticalAnchor.MIDDLE) {
	    return canvas.height / 2;
	} else if(this.anchorVertical === VerticalAnchor.RIGHT) {
	    return canvas.height;
	} else {
	    debugger;
	}
    }

    getAnchorHorizontal() {
	if(this.anchorHorizontal === HorizontalAnchor.TOP) {
	    return 0;
	} else if(this.anchorHorizontal === HorizontalAnchor.MIDDLE) {
	    return canvas.width / 2;
	} else if(this.anchorHorizontal === HorizontalAnchor.BOTTOM) {
	    return canvas.width;
	} else {
	    debugger;
	}
    }

    get centerX() {
	return this.getAnchorHorizontal() + this.offset.x;
    }

    get centerY() {
	return this.getAnchorVertical() + this.offset.y;
    }

    draw() {}

    mouseMove() {}
}

export class UIText extends UIElement {
    static new(args) {
	return new UIText(args);
    }

    constructor(args = {}) {
	super(args);
	this.text = args.text;
    }

    draw() {
	ctx.font = "48px orbitron";
	ctx.fillStyle = "red";
	ctx.textBaseline = "bottom";
	let textMetrics = ctx.measureText(this.text);
	let textHeight = textMetrics.emHeightAscent;
	ctx.fillText(this.text, this.centerX - textMetrics.width / 2, this.centerY + textHeight / 2);
    }
}

export class UIButton extends UIElement {
    static new(args) {
	return new UIButton(args);
    }

    constructor(args = {}) {
	super(args);
	this.text = args.text;
	this.callback = args.callback;
	
	this.isHoveredOver = false;
    }

    draw() {
	ctx.font = this.size.y.toString() + "px orbitron";
	ctx.textBaseline = "bottom";
	let textMetrics = ctx.measureText(this.text);
	let textWidth = textMetrics.width;
	let textHeight = textMetrics.emHeightAscent;
	ctx.fillStyle = this.isHoveredOver ? "white" : "red";
	ctx.fillText(this.text, this.centerX - textMetrics.width / 2, this.centerY + textHeight / 2);
    }

    mouseMove(e) {
	let buttonRect = new Rectangle(this.centerX - this.size.x / 2, this.centerY - this.size.y / 2, this.size.x, this.size.y);
	let mousePos = new Vector2(e.clientX, e.clientY);
	if(this.isHoveredOver === false) {
	    if(buttonRect.isPointInside(mousePos)) {
		console.log("activated");
		this.isHoveredOver = true;
		this.draw();
	    }
	} else {
	    if(!buttonRect.isPointInside(mousePos)) {
		console.log("deactivated");
		this.isHoveredOver = false;
		this.draw();
	    }
	}
    }
}
