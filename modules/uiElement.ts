"use strict";

import { Rect } from "modules/rectangle.js";
import { Vec2 } from "modules/vector2.js";
import { ScreenManager } from "modules/screenManager.js";
import { canvas, ctx } from "modules/graphics.js";
import { loadTexture } from "modules/assetManagement.js";

export enum HorizontalAnchorPoint {
    LEFT,
    MIDDLE,
    RIGHT,
}

export enum VerticalAnchorPoint {
    TOP,
    MIDDLE,
    BOTTOM,
}

export interface UIELementArgs {
    horizontal: HorizontalAnchorPoint;
    vertical: VerticalAnchorPoint;
    offset: Vec2;
    size: Vec2;
}
export abstract class UIElement {
    horizontal: HorizontalAnchorPoint;
    vertical: VerticalAnchorPoint;
    offset: Vec2;
    size: Vec2;

    constructor(args: UIELementArgs) {
        this.horizontal = args.horizontal;
        this.vertical = args.vertical;
        this.offset = args.offset;
        this.size = args.size;
    }

    getAnchorVertical(): number {
        switch (this.vertical) {
            case VerticalAnchorPoint.TOP:
                return 0;
            case VerticalAnchorPoint.MIDDLE:
                return canvas.height / 2;
            case VerticalAnchorPoint.BOTTOM:
                return canvas.height;
        }
    }

    getAnchorHorizontal(): number {
        switch (this.horizontal) {
            case HorizontalAnchorPoint.LEFT:
                return 0;
            case HorizontalAnchorPoint.MIDDLE:
                return canvas.width / 2;
            case HorizontalAnchorPoint.RIGHT:
                return canvas.width;
        }
    }

    get centerX(): number {
        return this.getAnchorHorizontal() + this.offset.x;
    }

    get centerY(): number {
        return this.getAnchorVertical() + this.offset.y;
    }

    abstract draw(): void;

    mouseMoveEvent(_: MouseEvent) {}

    mouseDownEvent(_: MouseEvent) {}

	mouseUpEvent(_: MouseEvent) {}

    get boundRect() {
        return new Rect(
            this.centerX - this.size.x / 2,
            this.centerY - this.size.y / 2,
            this.size.x,
            this.size.y,
        );
    }
}

export interface UITextArgs extends UIELementArgs {
    text: string;
}

export class UIText extends UIElement {
    text: string;
    static new(args: UITextArgs): UIText {
        return new UIText(args);
    }
    constructor(args: UITextArgs) {
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
        ctx.fillText(
            this.text,
            this.centerX - textMetrics.width / 2,
            this.centerY + textHeight / 2,
        );
    }
}

export interface UIButtonArgs extends UIELementArgs {
    text: string;
    clickCallback: (e: MouseEvent) => void;
}

export class UIButton extends UIElement {
    text: string;
    isHoveredOver: boolean = false;
    clickCallback: (e: MouseEvent) => void;

    static new(args: UIButtonArgs) {
        return new UIButton(args);
    }

    constructor(args: UIButtonArgs) {
        super(args);
        this.text = args.text;
        this.clickCallback = args.clickCallback;

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
        let textHeight = textMetrics.emHeightAscent;
        ctx.fillStyle = this.isHoveredOver ? "white" : "red";
        ctx.fillText(
            this.text,
            this.centerX - textMetrics.width / 2,
            this.centerY + textHeight / 2,
        );
    }

    mouseMoveEvent(e: MouseEvent) {
        let buttonRect = this.boundRect;
        let mousePos = new Vec2(e.clientX, e.clientY);
        if (this.isHoveredOver === false) {
            if (buttonRect.isPointInside(mousePos)) {
                this.isHoveredOver = true;
				ScreenManager.markForRedraw();
            }
        } else {
            if (!buttonRect.isPointInside(mousePos)) {
                this.isHoveredOver = false;
				ScreenManager.markForRedraw();
            }
        }
    }

    mouseDownEvent(e: MouseEvent) {
        if (this.boundRect.isPointInside(new Vec2(e.clientX, e.clientY))) {
            this.clickCallback(e);
        }
    }
}

export interface UIIconButtonArgs extends UIELementArgs {
    icon: HTMLOrSVGImageElement;
}

export class UIIconButton extends UIButton {
    icon: HTMLOrSVGImageElement;
    constructor(args: UIIconButton) {
        super(args);
        this.icon = args.icon;
    }

    mouseDownEvent(e: MouseEvent) {
        if (this.boundRect.isPointInside(new Vec2(e.clientX, e.clientY))) {
            this.clickCallback(e);
        }
    }

    draw(): void {
        let x = this.getAnchorHorizontal();
        let y = this.getAnchorVertical();
        ctx.drawImage(this.icon, x, y, this.size.x, this.size.y);
    }
}
