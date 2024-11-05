import { typeAssert, instanceAssert, assert } from "modules/debug.js";
import { Vec2 } from "modules/vector2.js";
import { CollisionMap } from "modules/physics.js";
import {
    Tower,
    Projectile,
    ProjectileType,
    Building,
    BuildingType,
    Enemy,
    EnemyType,
    EntityList,
} from "modules/entity.js";
import { Camera, ctx, canvas } from "modules/graphics.js";

export class LevelDescriptor {
    constructor(
        public color: string,
        public safeBuildRadius: number,
        public size: Vec2,
    ) {}
}

class WaveProfile {
    constructor() {}
}

class WaveModType {}

export class Level {
    frameCount: number = 0;
    cam: Camera = new Camera(new Vec2(0, 0));
    projectiles = new EntityList<Projectile>();
    enemies = new EntityList<Enemy>();
    buildings = new EntityList<Building>();
    towers = new EntityList<Tower>();
    cm;
    constructor(public levelDescriptor: LevelDescriptor) {
        this.cm = new CollisionMap(
            levelDescriptor.size.x,
            levelDescriptor.size.y,
        );

        this.buildings.push(new Building(new Vec2(0, 0), BuildingType.HQ));

        this.enemies.push(new Enemy(new Vec2(200, 200), EnemyType.SMALL));
    }

    draw() {
        ctx.fillStyle = this.levelDescriptor.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //updating
        this.buildings.draw(this.cam);
        this.towers.draw(this.cam);
        this.enemies.draw(this.cam);
        this.projectiles.draw(this.cam);
    }

    update() {
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

        this.frameCount += 1;
    }
}
