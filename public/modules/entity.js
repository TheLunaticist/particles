"use strict";
import { Vec2 } from "modules/vector2.js";
import { Game } from "modules/game.js";
import { AssetManager } from "modules/assetManager.js";
import { CalledVirtualFunctionError, instanceAssert, typeAssert, } from "modules/debug.js";
import { canvas, ctx } from "modules/graphics.js";
class Type {
    constructor(size) {
        instanceAssert(size, Vec2);
        this.size = size;
    }
}
class Entity {
    constructor(pos, type) {
        instanceAssert(pos, Vec2);
        this.pos = pos;
        instanceAssert(type, Type);
        this.type = type;
        this.dead = false;
        this.sections = [];
    }
    draw() { }
    update() { }
    injectData() {
        throw new CalledVirtualFunctionError();
    }
    get center() {
        return new Vec2(this.pos.x + this.type.size.x / 2, this.pos.y + this.type.size.y / 2);
    }
}
export class BuildingType extends Type {
    static HQ = new BuildingType(new Vec2(40, 40));
    constructor(size) {
        super(size);
    }
    draw(building, cam) {
        if (building.type === BuildingType.HQ) {
            cam.drawImage(AssetManager.textures["hq"], building.pos.x, building.pos.y);
        }
    }
}
export class Building extends Entity {
    static newFromCenter(center, type) {
        center.x -= type.size.x / 2;
        center.y -= type.size.y / 2;
        return new Building(center, type);
    }
    constructor(pos, type) {
        super(pos, type);
    }
    draw(camera) {
        this.type.draw(this, camera);
    }
    injectData(xPos, yPos, type) {
        this.pos.x = xPos;
        this.pos.y = yPos;
        this.type = type;
        this.dead = false;
    }
}
class TowerType extends BuildingType {
    static MG = new TowerType(new Vec2(48, 48), 2, 55, 6);
    static SNIPER = new TowerType(new Vec2(32, 32), 8, 30, 30);
    static ROCKET = new TowerType(new Vec2(32, 32), 16, 100, 10);
    constructor(size, damage, cost, maxShootCooldown) {
        super(size);
        typeAssert(damage, "number");
        this.damage = damage;
        typeAssert(cost, "number");
        this.cost = cost;
        typeAssert(maxShootCooldown, "number");
        this.maxShootCooldown = maxShootCooldown;
    }
}
class Tower extends Entity {
    static drawBlueprint(x, y, type) {
        if (Game.state.money >= 40 && Tower.canPlace(x, y, type)) {
            ctx.fillStyle = "blue";
        }
        else {
            ctx.fillStyle = "red";
        }
        ctx.fillRect(x - type.size.x / 2, y - type.size.y / 2, type.size.x, type.size.y);
    }
    static canPlace(x, y, type) {
        const posBlue = new Vec2(x, y);
        const sizeBlue = type.size;
        //HQ
        if (Vec2.doVectorSquaresIntersect(posBlue, sizeBlue, Game.state.hq.pos, Game.state.hq.type.size)) {
            return false;
        }
        //Towers
        for (let i = 0; i < Game.state.towers.length; i++) {
            const tower = Game.state.towers[i];
            if (Vec2.doVectorSquaresIntersect(posBlue, sizeBlue, tower.pos, tower.type.size)) {
                return false;
            }
        }
        if (Game.state.money < this.type.cost) {
            return false;
        }
        return true;
    }
    constructor(x, y, asCenter, type) {
        super(x, y, asCenter, type.size.x, type.size.y, "");
        this.shootCooldown = type.maxShootCooldown;
        this.type = type;
        this.target = undefined;
    }
    draw() {
        if (this.type == TowerType.SNIPER) {
            const HEAD_SIZE = 32;
            //drawing base
            ctx.drawImage(AssetManager.textures["sniper_turret_base"], this.rect.left, this.rect.top);
            //drawing head
            ctx.save();
            let angle;
            if (this.target != undefined) {
                const targetVector = Vec2.subtract(this.target.rect.getCenter(), this.rect.getCenter());
                angle =
                    Math.atan2(targetVector.y, targetVector.x) +
                        2 * Math.PI * (3 / 4);
            }
            else {
                angle = 0;
            }
            const center = this.rect.getCenter();
            ctx.translate(center.x, center.y);
            ctx.rotate(angle);
            ctx.drawImage(AssetManager.textures["sniper_turret_head"], -HEAD_SIZE / 2, -HEAD_SIZE / 2);
            ctx.restore();
        }
        else if (this.type == TowerType.MG) {
            ctx.drawImage(AssetManager.textures["mg_turret_base"], this.rect.left, this.rect.top);
            ctx.save();
            let angle;
            if (this.target != undefined) {
                const targetVector = Vec2.subtract(this.target.rect.getCenter(), this.rect.getCenter());
                angle =
                    Math.atan2(targetVector.y, targetVector.x) +
                        2 * Math.PI * (3 / 4);
            }
            else {
                angle = 0;
            }
            let center = this.rect.getCenter();
            ctx.translate(center.x, center.y);
            ctx.rotate(angle);
            ctx.drawImage(AssetManager.textures["mg_turret_head"], -48 / 2, -48 / 2);
            ctx.restore();
        }
        else if (this.type == TowerType.ROCKET) {
            //base
            ctx.drawImage(AssetManager.textures["rocket_turret_base"], this.rect.left, this.rect.top);
            //head
            ctx.save();
            let angle;
            if (this.target != undefined) {
                let targetVector = Vec2.subtract(this.target.rect.getCenter(), this.rect.getCenter());
                angle =
                    Math.atan2(targetVector.y, targetVector.x) +
                        2 * Math.PI * (3 / 4);
            }
            else {
                angle = 0;
            }
            let center = this.rect.getCenter();
            ctx.translate(center.x, center.y);
            ctx.rotate(angle);
            ctx.drawImage(AssetManager.textures["rocket_turret_head"], -32 / 2, -32 / 2);
            ctx.restore();
        }
        else {
            //Unknown tower type
            debugger;
        }
    }
    update() {
        this.target = this.acquireTarget();
        if (this.shootCooldown < 1) {
            if (this.tryShoot()) {
                this.shootCooldown = this.type.maxShootCooldown;
            }
        }
        else {
            this.shootCooldown -= 1;
        }
    }
    tryShoot() {
        if (this.target != undefined) {
            let vecToTarget = Vec2.subtract(this.target.rect.getCenter(), this.rect.getCenter());
            let speedToEnemy = Vec2.scaleVec(vecToTarget.getNormalized(), 6);
            if (this.type == TowerType.MG) {
                speedToEnemy.x += (Math.random() - 0.5) * 4;
                speedToEnemy.y += (Math.random() - 0.5) * 4;
            }
            let myCenter = this.rect.getCenter();
            if (this.type == TowerType.MG || this.type == TowerType.SNIPER) {
                Game.state.projectiles.push(Projectile.MakeBall(myCenter.x, myCenter.y, true, speedToEnemy.x, speedToEnemy.y, this.type.damage));
            }
            else if (this.type == TowerType.ROCKET) {
                Game.state.projectiles.push(Projectile.MakeRocket(myCenter.x, myCenter.y, true, speedToEnemy.x, speedToEnemy.y, this.type.damage, this.target));
            }
            return true;
        }
        else {
            return false;
        }
    }
    acquireTarget() {
        if (Game.state.enemies[0] != undefined) {
            let vecToEnemy;
            let enemy;
            let smallestDistance = Infinity;
            for (let i = 0; i < Game.state.enemies.length; i++) {
                vecToEnemy = Vec2.subtract(Game.state.enemies[i].rect.getCenter(), this.rect.getCenter());
                if (vecToEnemy.getLength() < smallestDistance) {
                    enemy = Game.state.enemies[i];
                    smallestDistance = vecToEnemy.getLength();
                }
            }
            if (enemy == undefined) {
                return false;
            }
            return enemy;
        }
        else {
            return;
        }
    }
}
export class ProjectileType {
    static BALL = new ProjectileType(false);
    static ROCKET = new ProjectileType(true);
    constructor(killsArmor) {
        this.killsArmor = killsArmor;
    }
}
export class Projectile extends Entity {
    static SIZE = new Vec2(16, 16);
    static MakeBall(x, y, asCenter, startVelX, startVelY, damage) {
        return new Projectile(x, y, asCenter, startVelX, startVelY, damage, null, ProjectileType.BALL);
    }
    static MakeRocket(x, y, asCenter, startVelX, startVelY, damage, target) {
        return new Projectile(x, y, asCenter, startVelX, startVelY, damage, target, ProjectileType.ROCKET);
    }
    constructor(x, y, asCenter, startVelX, startVelY, damage, target, type) {
        super(x, y, asCenter, Projectile.SIZE.x, Projectile.SIZE.y, "square");
        this.vel = new Vec2(startVelX, startVelY);
        this.damage = damage;
        this.type = type;
        this.target = target;
    }
    draw() {
        if (this.type == ProjectileType.BALL) {
            ctx.drawImage(AssetManager.textures["cannon_ball"], this.rect.left, this.rect.top);
        }
        else if (this.type == ProjectileType.ROCKET) {
            let angle = Math.atan2(this.vel.y, this.vel.x) + 2 * Math.PI * (3 / 4);
            let center = this.rect.getCenter();
            ctx.save();
            ctx.translate(center.x, center.y);
            ctx.rotate(angle);
            ctx.drawImage(AssetManager.textures["rocket"], -16 / 2, -22 / 2);
            ctx.restore();
        }
        else {
            //unknown projectile type
            debugger;
        }
    }
    update(index) {
        this.rect.upperLeft.x += this.vel.x;
        this.rect.upperLeft.y += this.vel.y;
        if (this.rect.bottom < 0 ||
            this.rect.top > canvas.height ||
            this.rect.right < 0 ||
            this.rect.left > canvas.width) {
            Game.state.projectiles.splice(index, 1);
        }
        if (this.type == ProjectileType.ROCKET &&
            this.target != null &&
            this.target.isDead) {
            this.target == null;
        }
    }
}
export class EnemyType extends Type {
    static SMALL = new EnemyType(new Vec2(8, 8), 1, false, 10);
    static BIG = new EnemyType(new Vec2(16, 16), 2, false, 20);
    static BOSS = new EnemyType(new Vec2(48, 48), 10, false, 30);
    static BIG_ARMORED = new EnemyType(new Vec2(18, 18), 4, true, 20);
    constructor(size, reward, isArmored, maxHealth) {
        super(size);
        instanceAssert(size, Vec2);
        this.size = size;
        typeAssert(reward, "number");
        this.reward = reward;
        typeAssert(isArmored, "boolean");
        this.isArmored = isArmored;
        typeAssert(maxHealth, "number");
        this.maxHealth = maxHealth;
    }
}
export class Enemy extends Entity {
    static DEFAULT_SPEED = 1;
    constructor(pos, type) {
        super(pos, type);
        this.health = type.maxHealth;
        this.target = null;
    }
    draw(camera) {
        camera.fillRect(this.pos.x, this.pos.y, this.type.size.x, this.type.size.y, "red");
    }
    update() {
        if (this.target === null) {
            this.findTarget();
        }
        if (this.target !== null) {
            let diff = Vec2.subtract(this.target.center, this.center);
            if (diff.length > 0.6) {
                diff.normalize();
                diff.scale(Enemy.DEFAULT_SPEED);
                this.pos.add(diff);
            }
        }
    }
    findTarget() {
        const buildings = Game.level.buildings;
        buildings.every((build) => {
            if (!build.dead) {
                this.target = build;
                return false;
            }
            return true;
        });
    }
}
/*
 *  Array extension for saving allocation time.
 */
export class EntityList extends Array {
    constructor() {
        super();
    }
    addToCm(cm) {
        this.forEach((entity) => {
            if (!entity.dead) {
                cm.add(entity);
            }
        });
    }
    draw(camera) {
        this.forEach((entity) => {
            if (!entity.dead) {
                entity.draw(camera);
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
}
