"use strict";

import { Vec2 } from "modules/vector2.js";
import { typeAssert } from "modules/debug.js";

export class Rect {
    constructor(
        public x: number,
        public y: number,
        public w: number,
        public h: number,
    ) {}

    static fromVectors(a: Vec2, b: Vec2) {
        return new Rect(a.x, a.y, b.x, b.y);
    }


    getCenter() {
        return new Vec2(this.x + this.w / 2, this.y + this.h / 2);
    }

    intersects(otherRect: Rect) {
        if (this.left > otherRect.right || this.right < otherRect.left) {
            return false;
        }

        if (this.top > otherRect.bottom || this.bottom < otherRect.top) {
            return false;
        }

        return true;
    }

    isPointInside(point: Vec2) {
        return (
            point.x > this.left &&
            point.x < this.right &&
            point.y > this.top &&
            point.y < this.bottom
        );
    }

    get left() {
        return this.x;
    }

    get right() {
        return this.x + this.w;
    }

    get top() {
        return this.y;
    }

    get bottom() {
        return this.y + this.h;
    }

    get width() {
        return this.w;
    }

    get height() {
        return this.h;
    }
}
