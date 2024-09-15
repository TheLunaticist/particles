"use strict";

import { Vector2 } from "./vector2.js";

export class Rectangle {
	constructor(x, y, width, height) {
		this.upperLeft = new Vector2(x, y);
		this.size = new Vector2(width, height);
	}

	static fromVectors(vA, vB) {
	    return new Rectangle(vA.x, vA.y, vB.x, vB.y);
	}
	
	getCenter() {
		return new Vector2(this.upperLeft.x + this.size.x / 2, this.upperLeft.y + this.size.y / 2);
	}
	
	intersects(otherRect) {
		if(this.left > otherRect.right || this.right < otherRect.left) {
			return false;
		}
		
		if(this.top > otherRect.bottom || this.bottom < otherRect.top) {
			return false;
		}
		
		return true;
	}
	
	isPointInside(pos) {
		return pos.x > this.left && pos.x < this.right && pos.y > this.top && pos.y < this.bottom;
	}
	
	get left() {
		return this.upperLeft.x;
	}
	
	get right() {
		return this.upperLeft.x + this.size.x;
	}
	
	get top() {
		return this.upperLeft.y;
	}
	
	get bottom() {
		return this.upperLeft.y + this.size.y;
	}
	
	get width() {
		return this.size.x;
	}
	
	get height() {
		return this.size.y;
	}
}
