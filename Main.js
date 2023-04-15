window.canvas = document.getElementById("canvas");
window.ctx = window.canvas.getContext("2d");

window.COLLIDER_SHAPE_SQUARE = 0;
window.COLLIDER_SHAPE_CIRCLE = 1;

window.hqSprite = new Image();
window.hqSprite.src = "hq.png";

window.projectileSprite = new Image();
window.projectileSprite.src = "cannonBall.png";

class GameState {
	static GAME_STAGE_RUNNING = 0;
	static GAME_STAGE_LOST = 1;
	
	static MAX_MONEY_COOLDOWN = 300;
	static MONEY_GAIN = 50;
	
	static PLAYER_START_HEALTH = 200;
	
	start() {
		this.gameStage = GameState.GAME_STAGE_RUNNING;
		this.roundTime = 0;
		
		this.projectiles = [];
		this.enemies = [];
		this.towers = [];
		
		this.playerHealth = GameState.PLAYER_START_HEALTH;
		this.moneyCooldown = GameState.MAX_MONEY_COOLDOWN;
		this.money = 40;
		
		this.hq = new HQ(window.canvas.width / 2, window.canvas.height / 2, true);
		WaveManager.init();
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
		
		GUIManager.draw();
	}
	
	update() {
		if(this.gameStage == GameState.GAME_STAGE_RUNNING) {
			this.runGame();
			this.draw();
		} else {
			GUIRenderer.drawEnd();
		}
	}
	
	runGame() {
		//money
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
		
		this.projectiles.forEach((projectile, index, object) => {
			projectile.update(index);
		});
		
		this.towers.forEach((tower, index, object) => {
			tower.update();
		});
		
		//checking if enemies kill hq
		for(let i = this.enemies.length - 1; i >= 0; i--) {
			if(this.enemies[i].doesEntityCollideWith(this.hq)) {
				this.playerHealth -= 10;
				if(this.playerHealth <= 0) {
					this.gameStage = GameState.GAME_STAGE_LOST;
				}
			
				this.enemies.splice(i, 1);
			}
		}
		
		//checking for collisions with projectiles
		for(let e = this.enemies.length - 1; e >= 0; e--) {
			for(let p = this.projectiles.length - 1; p >= 0; p--) {
				if(this.enemies[e].doesEntityCollideWith(this.projectiles[p])) {
					this.projectiles.splice(p, 1);
					let enemyDied = this.enemies[e].takeDamage(1, e);
					if(enemyDied) {
						break;
					}
				}
			}
		}
		
		//placing tower
		if(this.placementAttemptPosition != undefined) {
			if(Tower.canPlace(window.mouseX, window.mouseY)) {
				window.gameState.money -= Tower.COST;
				this.towers.push(new Tower(window.mouseX, window.mouseY, true));
			}
			this.placementAttemptPosition = undefined;
		}
		
		WaveManager.update();
		
		this.roundTime += 1;
	}
}

class WaveManager {
	
	static BASE_ENEMY_AMOUNT = 5;
	static BASE_WAVE_TIME = 60;
	static waveTime;
	
	static OFFSCREEN_LENGTH;
	static SPREAD_RADIUS = 200;
	
	static init() {
		WaveManager.waveTime = WaveManager.BASE_WAVE_TIME;
		WaveManager.OFFSCREEN_LENGTH = new Vector2(window.canvas.width / 2, window.canvas.height / 2).getLength();
	}
	
	static update() {
		if(WaveManager.waveTime <= 0) {
			WaveManager.waveTime = WaveManager.getCurrentWaveTime();
			
			WaveManager.spawnWave();
		} else {
			WaveManager.waveTime -= 1;
		}
	}
	
	static spawnWave() {
		let attackVector = Vector2.scaleVec(Vector2.getRandomUnitVec(), WaveManager.OFFSCREEN_LENGTH + WaveManager.SPREAD_RADIUS);
		let attackOrigin = Vector2.add(attackVector, gameState.hq.rect.getCenter());
		for(let i = 0; i < WaveManager.BASE_ENEMY_AMOUNT; i++) {
			let spawnOffset = Vector2.scaleVec(Vector2.getRandomUnitVec(), Math.random() * WaveManager.SPREAD_RADIUS);
			let hasArmor = Math.random() > 0.5;
			window.gameState.enemies.push(new Enemy(attackOrigin.x + spawnOffset.x, attackOrigin.y + spawnOffset.y, true, hasArmor * 1));
		}
		
	}
	
	static getCurrentWaveTime() {
		return WaveManager.BASE_WAVE_TIME;
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
		window.ctx.drawImage(window.hqSprite, this.rect.left, this.rect.top);
	}
}

class Tower extends Entity {
	static SIZE = new Vector2(25, 25);
	static MAX_SHOOT_COOLDOWN = 30;
	static COST = 40;
	
	static drawBlueprint(x, y) {
		window.ctx.fillStyle = "#66a3ff";
		window.ctx.fillRect(x - Tower.SIZE.x / 2, y - Tower.SIZE.y / 2, Tower.SIZE.x, Tower.SIZE.y);
	}
	
	static canPlace(x, y) {
		let mockRect = new Rectangle(x - Tower.SIZE.x / 2, y - Tower.SIZE.y / 2, Tower.SIZE.x, Tower.SIZE.y);
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
			
			let vecToTarget = Vector2.subtract(enemy.rect.getCenter(), this.rect.getCenter());
			let speedToEnemy = Vector2.scaleVec(vecToTarget.getNormalized(), 6);
			let myCenter = this.rect.getCenter();
			
			window.gameState.projectiles.push(new Projectile(myCenter.x, myCenter.y, true, speedToEnemy.x, speedToEnemy.y));
			return true;
		}
		return false;
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
		window.ctx.drawImage(window.projectileSprite, this.rect.left, this.rect.top);
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
			return true;
		}
	}
}

window.mouseX = 0;
window.mouseY = 0;

window.canvas.addEventListener("mousemove", (event) => {
	let canvasRect = window.canvas.getBoundingClientRect();
	window.mouseX = event.clientX - canvasRect.left;
	window.mouseY = event.clientY - canvasRect.top;
});

window.canvas.addEventListener("mousedown", (event) => {
	let canvasRect = window.canvas.getBoundingClientRect();
	let mouseX = event.clientX - canvasRect.left;
	let mouseY = event.clientY - canvasRect.top;
	window.gameState.placementAttemptPosition = new Vector2(mouseX, mouseY);
});


window.gameState = new GameState(100);

//player should place his base here
window.gameState.start();

loop();
function loop() {
	window.gameState.update();
	window.requestAnimationFrame(loop);
}
	


