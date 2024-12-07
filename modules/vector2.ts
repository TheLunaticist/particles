"use strict";

export class Vec2 {
    constructor(
        public x: number,
        public y: number,
    ) {}

    static add(a: Vec2, b: Vec2): Vec2 {
        return new Vec2(a.x + b.x, a.y + b.y);
    }

    static subtract(a: Vec2, b: Vec2): Vec2 {
        return new Vec2(a.x - b.x, a.y - b.y);
    }

    static scaleVec(v: Vec2, scale: number) {
        return new Vec2(v.x * scale, v.y * scale);
    }

    static getRandomUnitVec(): Vec2 {
        let vecAsRad = Math.random() * 2 * Math.PI;
        return new Vec2(Math.cos(vecAsRad), Math.sin(vecAsRad));
    }

    static doVectorSquaresIntersect(
        posA: Vec2,
        sizeA: Vec2,
        posB: Vec2,
        sizeB: Vec2,
    ): boolean {
        if (posA.x > posB.x + sizeB.x || posA.x + sizeA.x < sizeB.x) {
            return false;
        }

        if (posA.y > posB.y + sizeB.y || posA.y + sizeA.y < posB.y) {
            return false;
        }

        return true;
    }


    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    getNormalized(): Vec2 {
        return new Vec2(this.x / this.length, this.y / this.length);
    }

    normalize() {
		let length = this.length;
        this.x /= length;
        this.y /= length;
    }

    scale(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
    }

    add(vec: Vec2) {
        this.x += vec.x;
        this.y += vec.y;
    }
}
