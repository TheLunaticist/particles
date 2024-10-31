"use strict";
import { instanceAssert } from "modules/debug.js";
import { Vec2 } from "modules/vector2.js";
import { LevelDescriptor, Level } from "modules/level.js";
export class Game {
    static level = null;
    static clickEvent(event) { }
    static doFrame() {
        if (Game.level === null) {
            throw new Error("Attempted to run game before setting level.");
        }
        Game.level.draw();
        Game.level.update();
    }
    static init() {
        //TODO: add different levels and difficulties
        Game.loadLevel(new LevelDescriptor({
            color: "black",
            safeBuildRadius: 100,
            size: new Vec2(2000, 2000),
        }));
    }
    static loadLevel(levelDescriptor) {
        instanceAssert(levelDescriptor, LevelDescriptor);
        Game.level = new Level(levelDescriptor);
    }
}
