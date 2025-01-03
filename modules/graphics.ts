import { Vec2 } from "modules/vector2.js";

export const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d", {
    alpha: true,
    antialias: false,
}) as CanvasRenderingContext2D;

export function drawImageRelative(
    img: HTMLOrSVGImageElement,
    x: number,
    y: number,
) {
    ctx.drawImage(img, x + canvas.width / 2, y + canvas.height / 2);
}

/**
 * Class that represents a viewpoint.
 * It's size is equal to the canvas size.
 */
export class Viewport {
    constructor(public center: Vec2) {}

    drawImage(img: HTMLOrSVGImageElement, left: number, top: number) {
        ctx.drawImage(img, this.worldToViewX(left), this.worldToViewY(top));
    }

    fillRect(left: number, top: number, w: number, h: number, color: string) {
        ctx.fillStyle = color;
        ctx.fillRect(this.worldToViewX(left), this.worldToViewY(top), w, h);
    }

	moveTo(x: number, y: number) {
		ctx.moveTo(this.worldToViewX(x), this.worldToViewY(y));
	}

	lineTo(x: number, y: number) {
		ctx.lineTo(this.worldToViewX(x), this.worldToViewY(y));
	}


    worldToViewX(worldX: number) {
        return worldX + this.width / 2 - this.center.x;
    }

    worldToViewY(worldY: number) {
        return worldY + this.height / 2 - this.center.y;
    }

    get width() {
        return canvas.width;
    }

    get height() {
        return canvas.height;
    }
}
