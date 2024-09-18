"use strict";

import { StartConfig, MoneyConfig } from "/m/constants.js";
import { HQ, TowerType, Tower } from "/m/entity.js";
import { WaveManager } from "/m/waveManager.js";
import { InputManager } from "/m/inputManager.js";
import { GUIManager, GUIRenderer } from "/m/guiManager.js";
import { Colors } from "/m/constants.js";
import { ScreenManager } from "/m/screenManager.js"; 

export class Game {
	static state;
	static doExit;
	
	static init() {
		Game.state = new GameState();
		Game.doExit = false;
		
		WaveManager.init();
		InputManager.init();
		GUIManager.init();
	}
	
	static doFrame() {
			Game.state.update();
			if(Game.doExit === true) return;
			Game.state.draw();
	}
}

class GameState {
	constructor() {
		this.time = 0;
		this.projectiles = [];
		this.enemies = [];
		this.towers = [];
		this.hq = new HQ(canvas.width / 2, canvas.height / 2, true);
		
		this.playerHealth = StartConfig.PLAYER_HEALTH;
		this.moneyCooldown = MoneyConfig.COOLDOWN;
		this.money = StartConfig.PLAYER_MONEY;
		
		this.selTowType = TowerType.SNIPER;
	}
	
	draw() {
	    //background
	    ctx.fillStyle = Colors.BACKGROUND;
	    ctx.fillRect(0, 0, canvas.width, canvas.height);
	    
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
					ScreenManager.setActiveScreen(ScreenManager.END_SCREEN);
					Game.doExit = true;
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
