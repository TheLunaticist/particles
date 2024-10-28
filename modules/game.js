"use strict";

import { typeAssert, instanceAssert } from "/m/debug.js";
import {
    Building,
    BuildingType,
    Enemy,
    EnemyType,
    EntityList,
} from "/m/entity.js";
import { Vec2 } from "/m/vector2.js";
import { Camera, canvas, ctx } from "/m/graphics.js";
import { CollisionMap } from "/m/physics.js";

export class Game {
    static level = null;

    static clickEvent(event) {}

    static doFrame() {
        if (Game.level === null) {
            throw new Error("Attempted to run game before setting level.");
        }

        Game.level.draw();
        Game.level.update();
    }

    static init() {
        //TODO: add different levels and difficulties
        Game.loadLevel(
            new LevelDescriptor({
                color: "black",
                safeBuildRadius: 100,
                size: new Vec2(2000, 2000),
            }),
        );
    }

    static loadLevel(levelDescriptor) {
        instanceAssert(levelDescriptor, LevelDescriptor);
        Game.level = new Level(levelDescriptor);
    }
}

class LevelDescriptor {
    constructor(args = {}) {
        typeAssert(args.color, "string");
        this.color = args.color;
        typeAssert(args.safeBuildRadius, "number");
        this.safeBuildRadius = 50;
        instanceAssert(args.size, Vec2);
        this.size = args.size;
    }
}

class Level {
    constructor(levelDescriptor) {
        instanceAssert(levelDescriptor, LevelDescriptor);
        this.levelDescriptor = levelDescriptor;
        this.frameCount = 0;
        this.projectiles = new EntityList();
        this.enemies = new EntityList();
        this.buildings = new EntityList();
        this.towers = new EntityList();
        this.camera = new Camera(new Vec2(0, 0));
        this.cm = new CollisionMap(
            levelDescriptor.size.x,
            levelDescriptor.size.y,
        );

        this.buildings.push(
            Building.newFromCenter(new Vec2(0, 0), BuildingType.HQ), //hq always should be at the center
        );

        this.enemies.push(new Enemy(new Vec2(200, 200), EnemyType.BIG));
    }

    draw() {
        ctx.fillStyle = this.levelDescriptor.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //updating
        this.buildings.draw(this.camera);
        this.towers.draw(this.camera);
        this.enemies.draw(this.camera);
        this.projectiles.draw(this.camera);
    }

    update() {
        this.framecount += 1;

        //adding to collision map
        this.cm.reset();

        this.buildings.addToCm(this.cm);
        this.towers.addToCm(this.cm);
        this.enemies.addToCm(this.cm);
        this.projectiles.addToCm(this.cm);

        //updating
        this.buildings.update();
        this.towers.update();
        this.enemies.update();
        this.projectiles.update();
    }
}
