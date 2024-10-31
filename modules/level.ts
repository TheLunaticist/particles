import { typeAssert, instanceAssert, assert } from "modules/debug.js";
import { Vec2 } from "modules/vector2.js";
import { CollisionMap } from "modules/physics.js";
import {
    Building,
    BuildingType,
    Enemy,
    EnemyType,
    EntityList,
} from "modules/entity.js";
import { Camera, ctx, canvas } from "modules/graphics.js";

export class LevelDescriptor {
    constructor(args = {}) {
        typeAssert(args.color, "string");
        this.color = args.color;
        typeAssert(args.safeBuildRadius, "number");
        this.safeBuildRadius = 50;
        instanceAssert(args.size, Vec2);
        this.size = args.size;
    }
}

class WaveProfile {
    constructor() {}
}

new WaveProfile({
    0: { enemies: [] },
});

class WaveModType {}

export class Level {
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

        this.framecount += 1;
    }
}
