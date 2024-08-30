"use strict";

import { ScreenManager } from "./screenManager.js";

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
	    return ScreenManager.CANVAS.height / 2;
	} else if(this.anchorVertical === VerticalAnchor.RIGHT) {
	    return ScreenManager.CANVAS.height;
	} else {
	    debugger;
	}
    }

    getAnchorHorizontal() {
	if(this.anchorHorizontal === HorizontalAnchor.TOP) {
	    return 0;
	} else if(this.anchorHorizontal === HorizontalAnchor.MIDDLE) {
	    return ScreenManager.CANVAS.width / 2;
	} else if(this.anchorHorizontal === HorizontalAnchor.BOTTOM) {
	    return ScreenManager.CANVAS.width;
	} else {
	    debugger;
	}
    }
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
	ScreenManager.CONTEXT.font = "48px orbitron";
	ScreenManager.CONTEXT.fillStyle = "red";
	let textMetrics = ScreenManager.CONTEXT.measureText(this.text);
	let textWidth = textMetrics.width;
	ScreenManager.CONTEXT.fillText(this.text, this.getAnchorHorizontal() - textMetrics.width / 2, this.getAnchorVertical());
    }
}

export class UIButton extends UIElement {
    static new(args) {
	return new UIButton(args);
    }

    constructor(args = {}) {
	super(args);
	this.text = args.text;
    }

    draw() {}
}
