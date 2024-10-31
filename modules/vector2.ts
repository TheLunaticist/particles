"use strict";

import { typeAssert, instanceAssert } from "modules/debug.js";

//isValid
export class Vec2 {
    static add(vectorA, vectorB) {
        instanceAssert(vectorA, Vec2);
        instanceAssert(vectorB, Vec2);
        return new Vec2(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
    }

    static subtract(vectorA, vectorB) {
        return new Vec2(vectorA.x - vectorB.x, vectorA.y - vectorB.y);
    }

    static scaleVec(vector, scale) {
        return new Vec2(vector.x * scale, vector.y * scale);
    }

    static getRandomUnitVec() {
        let vecAsRad = Math.random() * 2 * Math.PI;
        return new Vec2(Math.cos(vecAsRad), Math.sin(vecAsRad));
    }

    static doVectorSquaresIntersect(posA, sizeA, posB, sizeB) {
        if (posA.x > posB.x + sizeB.x || posA.x + sizeA.x < sizeB) {
            return false;
        }

        if (posA.y > posB.y + sizeB.y || posA.y + sizeA.y < posB.y) {
            return false;
        }

        return true;
    }

    constructor(x, y) {
        typeAssert(x, "number");
        this.x = x;
        typeAssert(y, "number");
        this.y = y;
    }

    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    getNormalized() {
        let length = this.length;
        return new Vec2(this.x / length, this.y / length);
    }

    normalize() {
	let length = this.length;
	this.x /= length;
	this.y /= length;
    }

    scale(scalar) {
	this.x *= scalar;
	this.y *= scalar;
    }

    add(vec) {
	this.x += vec.x;
	this.y += vec.y;
    }
}
