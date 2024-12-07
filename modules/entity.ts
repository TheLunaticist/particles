"use strict";

import { Viewport } from "modules/graphics.js";
import { Vec2 } from "modules/vector2.js";
import { loadTexture } from "modules/assetManagement.js";
import { CollisionMap } from "modules/physics.js";
import { Game } from "modules/game.js";

export abstract class Type {
    constructor(public size: Vec2) {}
}

export abstract class Entity {
    sections: Entity[][] = [];

    constructor(
        public pos: Vec2,
        public type: Type,
        public dead: boolean,
    ) {}

    draw(_: Viewport): void {}
    update(): void {}

    get center(): Vec2 {
        return new Vec2(
            this.pos.x + this.type.size.x / 2,
            this.pos.y + this.type.size.y / 2,
        );
    }

    collidesWith(e: Entity) {
        return Vec2.doVectorSquaresIntersect(
            this.pos,
            this.type.size,
            e.pos,
            e.type.size,
        );
    }

    doCollision(oEntity: Entity) {}
}

export class BuildingType extends Type {
    static HQ_TEX = loadTexture("hq.png");

    static HQ = new BuildingType(new Vec2(40, 40));
    constructor(size: Vec2) {
        super(size);
    }

    draw(build: Building, cam: Viewport) {
        switch (this) {
            case BuildingType.HQ:
                cam.drawImage(BuildingType.HQ_TEX, build.pos.x, build.pos.y);
                break;
            default:
                throw new Error("Tried to draw a building that doesn't exist.");
        }
    }
}

export class Building extends Entity {
	static newFromCenter(centerPos: Vec2, type: BuildingType, dead: boolean): Building {
		centerPos.x -= type.size.x / 2;
		centerPos.y -= type.size.y / 2;
		return new Building(centerPos, type, dead);
	}

    constructor(pos: Vec2, type: BuildingType, dead: boolean) {
        super(pos, type, dead);
    }

    draw(cam: Viewport) {
        (this.type as BuildingType).draw(this, cam);
    }
}

class TowerType extends BuildingType {
    static MG = new TowerType(new Vec2(48, 48), 2, 55, 6);
    static SNIPER = new TowerType(new Vec2(32, 32), 8, 30, 30);
    static ROCKET = new TowerType(new Vec2(32, 32), 16, 100, 10);

    constructor(
        size: Vec2,
        public damage: number,
        public cost: number,
        public maxShootCooldown: number,
    ) {
        super(size);
    }
}

export class Tower extends Entity {
    constructor(pos: Vec2, type: TowerType, dead: boolean) {
        super(pos, type, dead);
    }

    draw() {}

    update() {}
}

export class ProjectileType extends Type {
    static BALL = new ProjectileType(new Vec2(16, 16));
    static ROCKET = new ProjectileType(new Vec2(16, 16));
    constructor(size: Vec2) {
        super(size);
    }
}

export class Projectile extends Entity {
    constructor(
        pos: Vec2,
        type: ProjectileType,
        dead: boolean,
        public vel: Vec2,
        public damage: number,
    ) {
        super(pos, type, dead);
    }

    draw() {}

    update() {}
}

export class EnemyType extends Type {
    static SMALL = new EnemyType(new Vec2(8, 8), 1, false, 10);
    static BIG = new EnemyType(new Vec2(16, 16), 2, false, 20);
    static BOSS = new EnemyType(new Vec2(48, 48), 10, false, 30);
    static BIG_ARMORED = new EnemyType(new Vec2(18, 18), 4, true, 20);

    constructor(
        size: Vec2,
        public reward: number,
        public isArmored: boolean,
        public maxHealth: number,
    ) {
        super(size);
    }
}

export class Enemy extends Entity {
    static SPEED = 1;

    target: Entity | null = null;
    health: number;

    constructor(pos: Vec2, type: EnemyType, dead: boolean) {
        super(pos, type, dead);
        this.health = type.maxHealth;
    }

    draw(cam: Viewport) {
        cam.fillRect(
            this.pos.x,
            this.pos.y,
            this.type.size.x,
            this.type.size.y,
            "red",
        );
    }

    update() {
        if (this.target === null) {
            this.findTarget();
        }

        if (this.target !== null) {
            let dir = Vec2.subtract(this.target.center, this.center);
            if (dir.length > 0.3) {
                dir.normalize();
                dir.scale(Enemy.SPEED);
                this.pos.add(dir);
            }
        }
    }

    findTarget() {
        this.target = Game.level?.buildings[0] as Entity;
    }
}

export class EntityList<T extends Entity> extends Array<T> {
    constructor() {
        super();
    }

    addToCm(cm: CollisionMap) {
        this.forEach((entity) => {
            if (!entity.dead) {
                cm.add(entity);
            }
        });
    }

    draw(cam: Viewport) {
        this.forEach((entity) => {
            if (!entity.dead) {
                entity.draw(cam);
            }
        });
    }

    update() {
        this.forEach((entity) => {
            if (!entity.dead) {
                entity.update();
            }
        });
    }

    doCollision() {
        this.forEach((entity) => {
            let collided: Entity[] = [];
            entity.sections.forEach((section) => {
                section.forEach((oEntity) => {
                    if (!collided.includes(oEntity)) {
                        if (entity.collidesWith(oEntity)) {
							console.log("test");
                            entity.doCollision(oEntity);
                        }
                    }
                });
            });
        });
    }
}
