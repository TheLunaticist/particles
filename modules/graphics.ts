import { instanceAssert } from "modules/debug.js";
import { Vec2 } from "modules/vector2.js";

export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d", { alpha: true, antialias: false });

export function drawImageRelative(img, x, y) {
    ctx.drawImage(img, x + canvas.width / 2, y + canvas.height / 2);
}

export class Camera {
    constructor(worldFocus) {
	instanceAssert(worldFocus, Vec2);
	this.worldFocus = worldFocus;
    }

    drawImage(img, x, y) {
	ctx.drawImage(img, x + this.offsetX, y + this.offsetY);
    }

    fillRect(x, y, w, h, colorString) {
	ctx.fillStyle = colorString;
	ctx.fillRect(x + this.offsetX, y + this.offsetY, w, h);
    }

    get offsetX() {
	return canvas.width / 2 - this.worldFocus.x;
    }

    get offsetY() {
	return canvas.height / 2 - this.worldFocus.y;
    }
}
