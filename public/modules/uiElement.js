"use strict";
import { Rect } from "./rectangle.js";
import { Vec2 } from "./vector2.js";
import { ScreenManager } from "/m/screenManager.js";
import { canvas, ctx } from "/m/graphics.js";
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
        if (this.anchorVertical === VerticalAnchor.LEFT) {
            return 0;
        }
        else if (this.anchorVertical === VerticalAnchor.MIDDLE) {
            return canvas.height / 2;
        }
        else if (this.anchorVertical === VerticalAnchor.RIGHT) {
            return canvas.height;
        }
        else {
            debugger;
        }
    }
    getAnchorHorizontal() {
        if (this.anchorHorizontal === HorizontalAnchor.TOP) {
            return 0;
        }
        else if (this.anchorHorizontal === HorizontalAnchor.MIDDLE) {
            return canvas.width / 2;
        }
        else if (this.anchorHorizontal === HorizontalAnchor.BOTTOM) {
            return canvas.width;
        }
        else {
            debugger;
        }
    }
    get centerX() {
        return this.getAnchorHorizontal() + this.offset.x;
    }
    get centerY() {
        return this.getAnchorVertical() + this.offset.y;
    }
    draw() { }
    mouseMove(e) { }
    //return false to mark click as captured
    mouseClick(e) { }
    markScreenForRedraw() {
        if (ScreenManager.continueRendering === false) {
            ScreenManager.redraw();
        }
    }
    get boundRect() {
        return new Rect(this.centerX - this.size.x / 2, this.centerY - this.size.y / 2, this.size.x, this.size.y);
    }
}
export class UIText extends UIElement {
    static new(args) {
        return new UIText(args);
    }
    constructor(args = {}) {
        super(args);
        this.text = args.text;
        ctx.font = this.size.y.toString() + "px orbitron";
        ctx.textBaseline = "bottom";
        let textMetrics = ctx.measureText(this.text);
        if (this.size.x < textMetrics.width) {
            this.size.x = textMetrics.width + 20;
        }
    }
    draw() {
        ctx.font = this.size.y.toString() + "px orbitron";
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
        this.clickCallback = args.clickCallback;
        this.isHoveredOver = false;
        let ctx = window.canvas.getContext("2d");
        ctx.font = this.size.y.toString() + "px orbitron";
        ctx.textBaseline = "bottom";
        let textMetrics = ctx.measureText(this.text);
        if (this.size.x < textMetrics.width) {
            this.size.x = textMetrics.width + 20;
        }
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
        let buttonRect = this.boundRect;
        let mousePos = new Vec2(e.clientX, e.clientY);
        if (this.isHoveredOver === false) {
            if (buttonRect.isPointInside(mousePos)) {
                this.isHoveredOver = true;
                this.markScreenForRedraw();
            }
        }
        else {
            if (!buttonRect.isPointInside(mousePos)) {
                this.isHoveredOver = false;
                this.markScreenForRedraw();
            }
        }
    }
    mouseClick(e) {
        if (this.boundRect.isPointInside(new Vec2(e.clientX, e.clientY))) {
            this.clickCallback();
            return false;
        }
    }
}
export class UIIconButton extends UIButton {
    constructor(args) {
        super(args);
        this.icon = args.icon;
    }
}
