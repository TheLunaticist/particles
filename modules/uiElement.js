"use strict";

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
	let textMetrics = ctx.measureText(this.text);
	let textWidth = textMetrics.width;
	ctx.fillText(this.text, this.getAnchorHorizontal() - textMetrics.width / 2, this.getAnchorVertical());
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

    onMouseDown(e) {
    }
}
