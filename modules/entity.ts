"use strict";

import { Viewport } from "modules/graphics.js";
import { Vec2 } from "modules/vector2.js";
import { loadTexture } from "modules/assetManagement.js";
import { CollisionMap } from "modules/physics.js";
import { Game } from "modules/game.js";

interface TypeArgs {
    size: Vec2;
    doCollision: boolean;
    hasHealth: boolean;
    maxHealth: number;
}

export abstract class Type {
    public size: Vec2;
    public doCollision: boolean;
    public hasHealth: boolean;
    public maxHealth: number;

    constructor(args: TypeArgs) {
        this.size = args.size;
        this.doCollision = args.doCollision;
        this.hasHealth = args.hasHealth;
        this.maxHealth = args.maxHealth;
    }
}

export abstract class Entity {
    sections: Entity[][] = []; //CollisionMap sections

    constructor(
        public pos: Vec2,
        public type: Type,
        public dead: boolean,
        public health: number,
    ) {}

    draw(_: Viewport): void {}
    update(): void {}

    get center(): Vec2 {
        return new Vec2(
            this.pos.x + this.type.size.x / 2,
            this.pos.y + this.type.size.y / 2,
        );
    }

    checkForCollisions() {
        let checkedEntities: Set<Entity> = new Set();
        checkedEntities.add(this);

        for (const section of this.sections) {
            for (const entity of section) {
                if (checkedEntities.has(entity)) {
                    continue;
                }
                if (this.collidesWith(entity)) {
                    this.doCollisionResults(entity);
                }

                checkedEntities.add(entity);
            }
        }
    }

    collidesWith(e: Entity) {
        return Vec2.doVectorSquaresIntersect(
            this.pos,
            this.type.size,
            e.pos,
            e.type.size,
        );
    }

    doCollisionResults(oEntity: Entity) {}
}

interface BuildingTypeArgs extends TypeArgs {}

export class BuildingType extends Type {
    static HQ_TEX = loadTexture("hq.png");

    static HQ = new BuildingType({
        size: new Vec2(40, 40),
        doCollision: true,
        hasHealth: true,
        maxHealth: 100,
    });

    constructor(args: BuildingTypeArgs) {
        super(args);
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

    doCollisionResults() {}
}

export class Building extends Entity {
    static newFromCenter(
        centerPos: Vec2,
        type: BuildingType,
        dead: boolean,
        health: number,
    ): Building {
        centerPos.x -= type.size.x / 2;
        centerPos.y -= type.size.y / 2;
        return new Building(centerPos, type, dead, health);
    }

    constructor(pos: Vec2, type: BuildingType, dead: boolean, health: number) {
        super(pos, type, dead, health);
    }

    draw(cam: Viewport) {
        (this.type as BuildingType).draw(this, cam);
    }
}

interface TowerTypeArgs extends TypeArgs {
	damage: number,
	cost: number,
	maxShootCooldown: number,
}

export class TowerType extends BuildingType {
	static MG = new TowerType({ size: new Vec2(48, 48), hasHealth: false, maxHealth: 0, doCollision: false, cost: 55, maxShootCooldown: 6, damage: 2});
	static SNIPER = new TowerType({ size: new Vec2(32, 32), hasHealth: false, maxHealth: 0, doCollision: false, cost: 30, maxShootCooldown: 30, damage: 8});
	static ROCKET = new TowerType({ size: new Vec2(32, 32), hasHealth: false, maxHealth: 0, doCollision: false, cost: 100, maxShootCooldown: 10, damage: 16});

    constructor(args: TowerTypeArgs) {
        super(args);
    }
}

export class Tower extends Entity {
    static newFromCenter(center: Vec2, type: TowerType, dead: boolean): Tower {
        center.x -= type.size.x / 2;
        center.y -= type.size.y / 2;
        return new Tower(center, type, dead);
    }

    constructor(pos: Vec2, type: TowerType, dead: boolean) {
        super(pos, type, dead, type.maxHealth);
    }

    draw(view: Viewport) {
        view.fillRect(
            this.pos.x,
            this.pos.y,
            this.type.size.x,
            this.type.size.y,
            "blue",
        );
    }

    update() {}
}

interface ProjectileTypeArgs extends TypeArgs {}

export class ProjectileType extends Type {
    static BALL = new ProjectileType({ size: new Vec2(16, 16), maxHealth: 0, hasHealth: false, doCollision: true});
    static ROCKET = new ProjectileType({ size: new Vec2(16, 16), maxHealth: 0, hasHealth: false, doCollision: true});
    constructor(args: ProjectileTypeArgs) {
        super(args);
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
        super(pos, type, dead, 0);
    }

    draw() {}

    update() {}
}

interface EnemyTypeArgs extends TypeArgs {
	reward: number,
	isArmored: boolean,
	maxHealth: number,
}
export class EnemyType extends Type {
    static SMALL = new EnemyType({ size: new Vec2(10, 10), doCollision: true, hasHealth: true, maxHealth: 10, reward: 10, isArmored: false});
    static BIG = new EnemyType({ size: new Vec2(16, 16), doCollision: true, hasHealth: true, maxHealth: 10, reward: 10, isArmored: false});

	public reward: number;
	public isArmored: boolean;

    constructor(args: EnemyTypeArgs) {
		super(args);
		this.reward = args.reward;
		this.isArmored = args.isArmored;
    }
}

export class Enemy extends Entity {
    static SPEED = 1;

    target: Entity | null = null;
    health: number;

    constructor(pos: Vec2, type: EnemyType, dead: boolean) {
        super(pos, type, dead, 10);
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
        for (const entity of this) {
            entity.checkForCollisions();
        }
    }
}
