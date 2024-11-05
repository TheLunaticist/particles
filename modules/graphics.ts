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

export class Camera {
    constructor(public worldFocus: Vec2) {}

    drawImage(img: HTMLOrSVGImageElement, x: number, y: number) {
        ctx.drawImage(img, x + this.offsetX, y + this.offsetY);
    }

    fillRect(x: number, y: number, w: number, h: number, colorString: string) {
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
