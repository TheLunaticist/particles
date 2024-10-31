"use strict";

import { Vec2 } from "modules/vector2.js";
import { typeAssert } from "modules/debug.js";

export class Rect {
    static fromVectors(vA, vB) {
        return new Rect(vA.x, vA.y, vB.x, vB.y);
    }

    constructor(x, y, w, h) {
        typeAssert(x, "number");
        this.x = x;
        typeAssert(y, "number");
        this.y = y;
        typeAssert(w, "number");
        this.w = w;
        typeAssert(h, "number");
        this.h = h;
    }

    getCenter() {
        return new Vec2(this.x + this.w / 2, this.y + this.h / 2);
    }

    intersects(otherRect) {
        if (this.left > otherRect.right || this.right < otherRect.left) {
            return false;
        }

        if (this.top > otherRect.bottom || this.bottom < otherRect.top) {
            return false;
        }

        return true;
    }

    isPointInside(point) {
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
