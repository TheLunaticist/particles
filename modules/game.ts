"use strict";

import { Vec2 } from "modules/vector2.js";
import { LevelDescriptor, Level } from "modules/level.js";
import { canvas } from "modules/graphics.js";

export class Game {
    static level: Level | null = null;

    static doFrame() {
        if (Game.level === null) {
            throw new Error("Attempted to run game before setting level.");
        }

        Game.level.draw();
        Game.level.update();
    }

    static init() {
        //TODO: add different levels and difficulties
        Game.loadLevel(new LevelDescriptor("black", 100, new Vec2(2000, 2000)));
    }

    static loadLevel(levelDescriptor: LevelDescriptor) {
        Game.level = new Level(levelDescriptor);
    }

	//checking if the mouse currently is over something that can be clicked on
	static checkMouseInteract(): boolean {
		//TODO!!!!
		return false;
	}

	static moveView(x: number, y: number) {
		if(Game.level !== null) {
			Game.level.view.center.x -= x;
			Game.level.view.center.y -= y;
		}
	}
}
