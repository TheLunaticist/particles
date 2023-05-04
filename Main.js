window.canvas = document.getElementById("canvas");
window.ctx = window.canvas.getContext("2d");

window.COLLIDER_SHAPE_SQUARE = 0;
window.COLLIDER_SHAPE_CIRCLE = 1;

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
			if(Tower.canPlace(window.mouseX, window.mouseY, Tower.TOWER_TYPE_MG)) {
				window.gameState.money -= Tower.COST;
				this.towers.push(new Tower(window.mouseX, window.mouseY, true, Tower.TOWER_TYPE_MG));
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
	
	let doPassthrough = GUIManager.handleClick(mouseX, mouseY);
	if(doPassthrough) {
		window.gameState.placementAttemptPosition = new Vector2(mouseX, mouseY);
	}
});

AssetManager.load();
GUIManager.globalInit();

window.gameState = new GameState(100);
//player should place his base here
window.gameState.start();

window.startLoop = () => {
	loop();
}

function loop() {
	window.gameState.update();
	window.requestAnimationFrame(loop);
}
	


