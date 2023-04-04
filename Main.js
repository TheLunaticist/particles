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
		
		this.projectiles = [];
		this.enemies = [];
		this.towers = [];
		
		this.playerHealth = GameState.PLAYER_START_HEALTH;
		this.moneyCooldown = GameState.MAX_MONEY_COOLDOWN;
		this.money = 40;
	}
	
	init() {
		//TODO query placement
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
		
		GUIRenderer.draw();
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
		WaveManager.update();
		
		//placing tower
		//TODO check for collisions
		if(this.placementAttemptPosition != undefined) {
			if(Tower.canPlace(window.mouseX, window.mouseY)) {
				window.gameState.money -= Tower.COST;
				this.towers.push(new Tower(window.mouseX, window.mouseY, true));
			}
			this.placementAttemptPosition = undefined;
		}
		
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
		
		//collision
		this.enemies.forEach((enemy, index, object) => {
			if(enemy.doesEntityCollideWith(this.hq)) {
				this.playerHealth -= 10;
				this.enemies.splice(index, 1);
				
				if(this.playerHealth <= 0) {
					this.gameStage = GameState.GAME_STAGE_LOST;
				}
			}
		});
		
		this.enemies.forEach((enemy, eIndex) => {
			for(let i = 0; i < this.projectiles.length; i++) {
				if(enemy.doesEntityCollideWith(this.projectiles[i])) {
					this.enemies.splice(eIndex, 1);
					this.projectiles.splice(i, 1);
					window.gameState.money += 10;
				}
			}
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
	
	static drawEnd() {
		window.ctx.fillStyle = "red";
		window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
		
		window.ctx.fillStyle = "black";
		window.ctx.font = "100px Orbitron";
		window.ctx.textBaseline = "alphabetic";
		let endText = "Game Over";
		let textBox = window.ctx.measureText(endText);
		let textX = window.canvas.width / 2 - textBox.width / 2;
		let textY = window.canvas.height / 2 + textBox.actualBoundingBoxAscent / 2;
		window.ctx.fillText(endText, textX, textY);
	}
}

class WaveManager {
	static timePassed = 0;
	static waveCooldown = 600;
	
	static MAX_WAVE_TIME = 100;
	static BASE_WAVE_AMOUNT = 5;
	static MAX_SPREAD_RADIUS = 5;
	
	static WORLD_CENTER;
	static ON_SCREEN_LENGTH;
	
	static init() {
		WaveManager.WORLD_CENTER = new Vector2(canvas.width / 2, canvas.height / 2);
		WaveManager.ON_SCREEN_LENGTH = Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2));
	}
	
	static update() {
		if(WaveManager.waveCooldown < 1) {
			//do wave
			WaveManager.spawnWave();
			//TODO time passed bonus
			WaveManager.waveCooldown = WaveManager.MAX_WAVE_TIME;
		} else {
			WaveManager.waveCooldown--;
		}
		
		WaveManager.timePassed += 1;		
	}
	
	static spawnWave() {
		let radOfDirection = 2*Math.PI * Math.random();
		let unitVector = new Vector2(Math.cos(radOfDirection), Math.sin(radOfDirection));
		
		let center = Vector2.scaleVec(unitVector, WaveManager.ON_SCREEN_LENGTH + WaveManager.MAX_SPREAD_RADIUS);
		
		for(let i = 0; i < WaveManager.BASE_WAVE_AMOUNT; i++) {
			let radOfSub = 2*Math.PI * Math.random();
			let uVector = new Vector2(Math.cos(radOfSub), Math.sin(radOfSub));
			
			let offset = Vector2.scaleVec(uVector, WaveManager.MAX_SPREAD_RADIUS);
			
			window.gameState.enemies.push(new Enemy(center.x + offset.x, center.y + offset.y, true));
		}
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
	static MAX_SHOOT_COOLDOWN = 60;
	static COST = 20;
	
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
			let vecToEnemy = Vector2.subtract(window.gameState.enemies[0].rect.getCenter(), this.rect.getCenter());
			let speedToEnemy = Vector2.scaleVec(vecToEnemy.getNormalized(), 3);
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
		//top
		if(this.rect.bottom < 0 || this.rect.top > canvas.height ||
		this.rect.right < 0 || this.rect.left > canvas.width) {
				window.gameState.projectiles.splice(index, 1);
		}
		
		
		this.rect.upperLeft.x += this.vel.x;
		this.rect.upperLeft.y += this.vel.y;
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

window.canvas.addEventListener("mousedown", (event) => {
	let canvasRect = window.canvas.getBoundingClientRect();
	let mouseX = event.clientX - canvasRect.left;
	let mouseY = event.clientY - canvasRect.top;
	window.gameState.placementAttemptPosition = new Vector2(mouseX, mouseY);
});


window.gameState = new GameState(100);

//player should place his base here
window.gameState.init();
window.gameState.start();

loop();
function loop() {
	window.gameState.update();
	window.requestAnimationFrame(loop);
}
	


