window.canvas = document.getElementById("canvas");
window.ctx = window.canvas.getContext("2d");

window.COLLIDER_SHAPE_SQUARE = 0;
window.COLLIDER_SHAPE_CIRCLE = 1;

class GameState {
	static MAX_ENEMY_COOLDOWN = 180;
	
	static MAX_MONEY_COOLDOWN = 300;
	static MONEY_GAIN = 10;
	
	constructor(startHealth) {
		this.placementAttemptPosition = undefined;
		
		this.playerHealth = startHealth;
		this.enemies = [];
		this.towers = [];
		this.projectiles = [];
		this.money = 0;
		
		this.enemyCooldown = 0;
		this.moneyCooldown = 0;
	}
	
	init() {
		//TODO query placement
		this.hq = new HQ(window.canvas.width / 2, window.canvas.height / 2, true);
		this.towers[0] = new Tower(this.hq.rect.right + 10, canvas.height / 2, false);
	}
	
	draw() {
		//background
		window.ctx.fillStyle = "black";
		window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
		
		this.hq.draw();
		
		this.towers.forEach(tower => {
			tower.draw();
		});
		
		this.enemies.forEach(enemy => {
			enemy.draw();
		});
		
		this.projectiles.forEach(projectile => {
			projectile.draw();
		});
		
		GUIRenderer.draw();
	}
	
	update() {
		//placing tower
		//TODO check for collisions
		if(this.placementAttemptPosition != undefined) {
			this.towers.push(new Tower(window.mouseX, window.mouseY, true));
			this.placementAttemptPosition = undefined;
		}
		
		//spawning enemies
		if(this.enemyCooldown < 1) {
			this.enemies.push(new Enemy(window.canvas.width, window.canvas.height, true));
			this.enemyCooldown = GameState.MAX_ENEMY_COOLDOWN;
		} else {
			this.enemyCooldown--;
		}
		
		if(this.moneyCooldown < 1) {
			this.money += GameState.MONEY_GAIN;
			this.moneyCooldown = GameState.MAX_MONEY_COOLDOWN;
		} else {
			this.moneyCooldown -= 1;
		}
		
		//updating logic
		this.enemies.forEach(enemy => {
			enemy.update();
		});
		
		//collision
		this.enemies.forEach((enemy, index, object) => {
			if(enemy.doesEntityCollideWith(this.hq)) {
				window.gameState.playerHealth -= 10;
				this.enemies.splice(index, 1);
			}
		});
		
		this.projectiles.forEach((projectile, index, object) => {
			projectile.update(index);
		});
		
		this.towers.forEach((tower, index, object) => {
			tower.update();
		});
	}
}

class GUIRenderer {
	static guiFont = "36px Orbitron";
	static offset = 25;
	
	static draw() {
		Tower.drawBlueprint(window.mouseX, window.mouseY);
		
		window.ctx.font = this.guiFont;
		
		window.ctx.fillStyle = "red";
		let drawStringHealth = "health: " + window.gameState.playerHealth;
		let height = window.ctx.measureText(drawStringHealth).actualBoundingBoxAscent;
		window.ctx.fillText(drawStringHealth, 0 + this.offset, height + this.offset);
		
		window.ctx.fillStyle = "gold";
		let drawStringMoney = "money: " + window.gameState.money;
		let measure = window.ctx.measureText(drawStringMoney);
		window.ctx.fillText(drawStringMoney, window.canvas.width - measure.width - this.offset, measure.actualBoundingBoxAscent + this.offset);
	}
}

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
		window.ctx.fillRect(this.rect.upperLeft.x, this.rect.upperLeft.y, this.rect.size.x, this.rect.size.y);
	}
}

class Tower extends Entity {
	static SIZE = new Vector2(25, 25);
	static MAX_SHOOT_COOLDOWN = 60;
	
	static drawBlueprint(x, y) {
		window.ctx.fillStyle = "#66a3ff";
		window.ctx.fillRect(x - Tower.SIZE.x / 2, y - Tower.SIZE.y / 2, Tower.SIZE.x, Tower.SIZE.y);
	}
	
	constructor(x, y, asCenter) {
		super(x, y, asCenter, Tower.SIZE.x, Tower.SIZE.y, window.COLLIDER_SHAPE_SQUARE);
		this.shootCooldown = Tower.MAX_SHOOT_COOLDOWN;
	}
	
	draw() {
		window.ctx.fillStyle = "#8b0000";
		window.ctx.fillRect(this.rect.left, this.rect.top, this.rect.size.x, this.rect.size.y);
	}
	

	
	update() {
		if(this.shootCooldown < 1) {
			if(this.tryShoot()) {
				this.shootCooldown = Tower.MAX_SHOOT_COOLDOWN;
			}
		} else {
			this.shootCooldown -= 1;
		}
	}
	
	tryShoot() {
		if(window.gameState.enemies[0] != undefined) {
			let vecToEnemy = Vector2.subtract(window.gameState.enemies[0].rect.getCenter(), this.rect.getCenter());
			let speedToEnemy = vecToEnemy.getNormalized();
			let myCenter = this.rect.getCenter();
			
			window.gameState.projectiles.push(new Projectile(myCenter.x, myCenter.y, true, speedToEnemy.x, speedToEnemy.y));
			return true;
		}
		return false;
	}
}

class Projectile extends Entity {
	static SIZE = new Vector2(8, 8);
	
	constructor(x, y, asCenter, startVelX, startVelY) {
		super(x, y, asCenter, Projectile.SIZE.x, Projectile.SIZE.y, window.COLLIDER_SHAPE_SQUARE);
		this.vel = new Vector2(startVelX, startVelY);
	}
	
	draw() {
		window.ctx.fillStyle = "blue";
		window.ctx.fillRect(this.rect.left, this.rect.top, this.rect.width, this.rect.height);
	}
	
	update(index) {
		this.rect.upperLeft.x += this.vel.x;
		this.rect.upperLeft.y += this.vel.y;
		
		console.log("updating " + index);
		console.log(this.vel.getLength());
	}
}

class Enemy extends Entity {
	constructor(x, y, asCenter) {
		super(x, y, asCenter, 8, 8, window.COLLIDER_SHAPE_SQUARE);
		this.hasTarget = false;
		this.vel = new Vector2(0, 0);
	}
	
	draw() {
		window.ctx.fillStyle = "yellow";
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
	
	getCenter() {
		return new Vector2(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);
	}
}

window.mouseX = 0;
window.mouseY = 0;

window.canvas.addEventListener("mousemove", (event) => {
	let canvasRect = window.canvas.getBoundingClientRect();
	window.mouseX = event.clientX - canvasRect.left;
	window.mouseY = event.clientY - canvasRect.top;
});

window.canvas.addEventListener("click", (event) => {
	let canvasRect = window.canvas.getBoundingClientRect();
	let mouseX = event.clientX - canvasRect.left;
	let mouseY = event.clientY - canvasRect.top;
	window.gameState.placementAttemptPosition = new Vector2(mouseX, mouseY);
});


window.gameState = new GameState(100);

//player should place his base here
window.gameState.init();

loop();
function loop() {
	window.gameState.update();
	window.gameState.draw();
	
	window.requestAnimationFrame(loop);
}
	


