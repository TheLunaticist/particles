class Entity {
	constructor(x, y, asCenter, width, height, colliderShape) {
		if(asCenter) {
			this.rect = new Rectangle(x - width / 2, y - height / 2, width, height);
		} else {
			this.rect = new Rectangle(x, y, width, height);
		}
		
		if(colliderShape == window.COLLIDER_SHAPE_CIRCLE && width != height){
			alert("Error: Oval circle colliders are not supported for now.");
			this.colliderShape = window.COLLIDER_SHAPE_SQUARE;
		} else {
			this.colliderShape = colliderShape;
		}
	}
	
	doesEntityCollideWith(other) {
		//these are only used when there aren't 2 of the same colliders
		let squareEnity;
		let circleEntity;
		
		if(this.colliderShape == other.colliderShape) {
			if(this.colliderShape == window.COLLIDER_SHAPE_SQUARE) {
				return this.rect.intersects(other.rect);
			} else {//this.colliderShape == window.COLLIDER_SHAPE_CIRCLE
				alert("not implemented");
			}
			alert("not implemented");
		}
		alert("not implemented");
	}
}

class HQ extends Entity {
	static SIZE = new Vector2(40, 40);
	
	constructor(x, y, asCenter) {	
		super(x, y, asCenter, HQ.SIZE.x, HQ.SIZE.y, window.COLLIDER_SHAPE_SQUARE);
	}
	
	draw() {
		window.ctx.fillStyle = "red";
		window.ctx.drawImage(AssetManager.HQ_SPRITE, this.rect.left, this.rect.top);
	}
}

class Tower extends Entity {
	static TOWER_TYPE_MG = 0;
	static TOWER_TYPE_SNIPER = 1;
	
	static SIZE_MG = new Vector2(32, 32);
	static SIZE_SNIPER = new Vector2(32, 32);
	
	static MAX_SHOOT_COOLDOWN = 30;
	static COST = 40;
	
	static drawBlueprint(x, y, towerType) {
		if(towerType == Tower.TOWER_TYPE_MG) {
			window.ctx.fillStyle = "#add8e6";
			window.ctx.fillRect(x - Tower.SIZE_MG.x / 2, y - Tower.SIZE_MG.y / 2, Tower.SIZE_MG.x, Tower.SIZE_MG.y);
		} else if(towerType == Tower.TOWER_TYPE_SNIPER) {
			window.ctx.fillStyle = "#99cfe0";
			window.ctx.fillRect(x - Tower.SIZE_SNIPER.x / 2, y - Tower.SIZE_SNIPER.y / 2, Tower.SIZE_SNIPER.x, Tower.SIZE_SNIPER.y);
		} else {
			//Unknown tower type
			debugger;
		}
	}
	
	static canPlace(x, y, towerType) {
		let mockRect;
		
		if(towerType == Tower.TOWER_TYPE_MG) {
			mockRect = new Rectangle(x - Tower.SIZE_MG.x / 2, y - Tower.SIZE_MG.y / 2, Tower.SIZE_MG.x, Tower.SIZE_MG.y);
		} else if(towerType == Tower.TOWER_TYPE_SNIPER) {
			mockRect = new Rectangle(x - Tower.SIZE_SNIPER.x / 2, y - Tower.SIZE_SNIPER.y / 2, Tower.SIZE_SNIPER.x, Tower.SIZE_SNIPER.y);
		} else {
			//Unknown tower type
			debugger;
		}
		
		
		if(mockRect.intersects(window.gameState.hq.rect)) {
			return false;
		}
		
		for(let i = 0; i < window.gameState.towers.length; i++) {
			if(mockRect.intersects(window.gameState.towers[i].rect)){
				return false;
			}
		}
		
		if(window.gameState.money < Tower.COST) {
			return false;
		}
		
		return true;
	}
	
	constructor(x, y, asCenter, towerType) {
		if(towerType == Tower.TOWER_TYPE_MG) {
			super(x, y, asCenter, Tower.SIZE_MG.x, Tower.SIZE_MG.y, window.COLLIDER_SHAPE_SQUARE);
		} else if(towerType == Tower.TOWER_TYPE_SNIPER) {
			super(x, y, asCenter, Tower.SIZE_SNIPER.x, Tower.SIZE_SNIPER.y, window.COLLIDER_SHAPE_SQUARE);
		} else {
			//Unknown tower type
			debugger;
		}
		
		this.shootCooldown = Tower.MAX_SHOOT_COOLDOWN;
		this.type = towerType;
		this.target = undefined;
	}
	
	draw() {
		if(this.type == Tower.TOWER_TYPE_MG) {
			let HEAD_SIZE = 32;
			//drawing base
			window.ctx.drawImage(AssetManager.MG_TURRET_BASE, this.rect.left, this.rect.top);
			
			//drawing head
			window.ctx.save();
			
			let angle;
			if(this.target != undefined) {
				let targetVector = Vector2.subtract(this.target.rect.getCenter(), this.rect.getCenter());
				angle = Math.atan2(targetVector.y, targetVector.x) + 2*Math.PI * (3/4);
			} else {
				angle = 0;
			}
			
			
			let center = this.rect.getCenter();
			window.ctx.translate(center.x, center.y);
			window.ctx.rotate(angle);
			window.ctx.drawImage(AssetManager.MG_TURRET_HEAD, -HEAD_SIZE / 2, -HEAD_SIZE / 2);
			
			window.ctx.restore();
			
		} else if(this.type == Tower.TOWER_TYPE_SNIPER) {
			window.ctx.drawImage(AssetManager.SNIPER_TURRET_BASE, this.rect.left, this.rect.top);
		} else {
			//Unknown tower type
			debugger;
		}
	}
	

	
	update() {
		this.target = this.acquireTarget();
		
		if(this.shootCooldown < 1) {
			if(this.tryShoot()) {
				this.shootCooldown = Tower.MAX_SHOOT_COOLDOWN;
			}
		} else {
			this.shootCooldown -= 1;
		}
	}
	
	tryShoot() {
		if(this.target != undefined) {
			let vecToTarget = Vector2.subtract(this.target.rect.getCenter(), this.rect.getCenter());
			let speedToEnemy = Vector2.scaleVec(vecToTarget.getNormalized(), 6);
			let myCenter = this.rect.getCenter();	
			window.gameState.projectiles.push(new Projectile(myCenter.x, myCenter.y, true, speedToEnemy.x, speedToEnemy.y));
			return true;
		} else {
			return false;
		}
	}
	
	acquireTarget() {
		if(window.gameState.enemies[0] != undefined) {
			let vecToEnemy;
			let enemy;
			let smallestDistance = Infinity;
			for(let i = 0; i < window.gameState.enemies.length; i++) {
				vecToEnemy = Vector2.subtract(window.gameState.enemies[i].rect.getCenter(), this.rect.getCenter());
				if(vecToEnemy.getLength() < smallestDistance) {
					enemy = window.gameState.enemies[i];
					smallestDistance = vecToEnemy.getLength();
				}
			}
			
			if(enemy == undefined) {
				return false;
			}
			return enemy;
		}
		else {
			return;
		}
	}
}

class Projectile extends Entity {
	static SIZE = new Vector2(16, 16);
	
	constructor(x, y, asCenter, startVelX, startVelY) {
		super(x, y, asCenter, Projectile.SIZE.x, Projectile.SIZE.y, window.COLLIDER_SHAPE_SQUARE);
		this.vel = new Vector2(startVelX, startVelY);
	}
	
	draw() {
		window.ctx.fillStyle = "blue";
		window.ctx.drawImage(AssetManager.PROJECTILE_SPRITE, this.rect.left, this.rect.top);
	}
	
	update(index) {
		this.rect.upperLeft.x += this.vel.x;
		this.rect.upperLeft.y += this.vel.y;
		
		if(this.rect.bottom < 0 || this.rect.top > canvas.height ||
			this.rect.right < 0 || this.rect.left > canvas.width) {
			window.gameState.projectiles.splice(index, 1);
		}
	}
}

class Enemy extends Entity {
	constructor(x, y, asCenter, armor) {
		super(x, y, asCenter, 8, 8, window.COLLIDER_SHAPE_SQUARE);
		this.hasTarget = false;
		this.vel = new Vector2(0, 0);
		this.armor = armor;
		this.isDead = false;
	}
	
	draw() {
		if(this.armor > 0) {
			window.ctx.fillStyle = "blue";
		} else {
			window.ctx.fillStyle = "yellow";
		}
		
		window.ctx.fillRect(this.rect.upperLeft.x, this.rect.upperLeft.y, this.rect.size.x, this.rect.size.y);
	}
		
	update() {
		if(this.hasTarget == false) {
			this.targetPos = window.gameState.hq.rect.getCenter();
			this.vel = Vector2.scaleVec(Vector2.subtract(this.targetPos, this.rect.getCenter()).getNormalized(), 3);
			
			this.hasTarget = true;
		}
		
		this.rect.upperLeft = Vector2.add(this.rect.upperLeft, this.vel);
	}
	
	takeDamage(damage, index) {
		if(this.armor > 0) {
			this.armor =- 1;
			return false;
		} else {
			window.gameState.enemies.splice(index, 1);
			this.isDead = true;

			window.gameState.money += 5;
			return true;
		}
	}
}