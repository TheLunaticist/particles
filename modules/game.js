"use strict";

import { GameStages, StartConfig, MoneyConfig, } from "./constants.js";
import { HQ, TowerType, Tower, } from "./entity.js";
import { WaveManager, } from "./waveManager.js";
import { InputManager, } from "./inputManager.js";
import { GUIManager, GUIRenderer, } from "./guiManager.js";
import { Colors, } from "./constants.js";

export class Game {
	static CANV;
	static CTX;
	
	static FPS = 30;
	static MS_PER_FRAME = 1 / Game.FPS * 1000;
	
	static stage = GameStages.RUNNING;
	static state;
	
	static throttleFps = false;
	
	static init(canvas) {
		Game.CANV = canvas;
		Game.CTX = Game.CANV.getContext("2d");
		
		Game.state = new GameState();
		
		WaveManager.init();
		InputManager.init();
		GUIManager.init();
	}
	
	static doFrame() {
		if(Game.stage == GameStages.RUNNING) {
			Game.state.update();
			Game.state.draw();
		} else {
			GUIRenderer.drawEnd();
		}
		
	}
	
	static toggleThrottle() {
		Game.throttleFps = !Game.throttleFps;
	}
}

class GameState {
	constructor() {
		this.time = 0;
		this.projectiles = [];
		this.enemies = [];
		this.towers = [];
		this.hq = new HQ(Game.CANV.width / 2, Game.CANV.height / 2, true);
		
		this.playerHealth = StartConfig.PLAYER_HEALTH;
		this.moneyCooldown = MoneyConfig.COOLDOWN;
		this.money = StartConfig.PLAYER_MONEY;
		
		this.selTowType = TowerType.SNIPER;
	}
	
	draw() {
		//background
		Game.CTX.fillStyle = Colors.BACKGROUND;
		Game.CTX.fillRect(0, 0, Game.CANV.width, Game.CANV.height);
		
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
		//basic income
		if(this.moneyCooldown < 1) {
			this.money += MoneyConfig.GAIN;
			this.moneyCooldown = MoneyConfig.COOLDOWN;
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
					Game.stage = GameStages.OVER;
				}
			
				this.enemies.splice(i, 1);
			}
		}
		
		//checking for collisions with projectiles
		for(let e = this.enemies.length - 1; e >= 0; e--) {
			for(let p = this.projectiles.length - 1; p >= 0; p--) {
				if(this.enemies[e].doesEntityCollideWith(this.projectiles[p])) {
					if(this.enemies[e].type.isArmored && this.projectiles[p].killsArmor == false) {
						break;
					}
					let damage = this.projectiles[p].damage;
					this.projectiles.splice(p, 1);
					let enemyDied = this.enemies[e].takeDamage(damage, e);
					if(enemyDied) {
						break;
					}
				}
			}
		}
		
		//placing tower
		if(this.placementAttemptPosition != undefined) {
			if(Tower.canPlace(this.placementAttemptPosition.x, this.placementAttemptPosition.y, this.selTowType)) {
				Game.state.money -= this.selTowType.cost;
				this.towers.push(new Tower(this.placementAttemptPosition.x, this.placementAttemptPosition.y, true, this.selTowType));
			}
			this.placementAttemptPosition = undefined;
		}
		
		WaveManager.update();
		
		this.roundTime += 1;
	}
}
