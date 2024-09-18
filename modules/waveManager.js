"use strict";

import { Vector2 } from "/m/vector2.js";
import { Game } from "/m/game.js";
import { Enemy, EnemyType } from "/m/entity.js";

export class WaveManager {
	static BASE_ENEMY_AMOUNT = 5;
	static BASE_WAVE_TIME = 60;
	static waveTime;
	static waveCount = 0;
	
	static OFFSCREEN_LENGTH;
	static SPREAD_RADIUS = 300;
	
	static init() {
		WaveManager.waveTime = WaveManager.BASE_WAVE_TIME;
		WaveManager.OFFSCREEN_LENGTH = new Vector2(canvas.width / 2, canvas.height / 2).getLength();
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
		WaveManager.waveCount += 1;
		let attackVector = Vector2.scaleVec(Vector2.getRandomUnitVec(), WaveManager.OFFSCREEN_LENGTH + WaveManager.SPREAD_RADIUS);
		let attackOrigin = Vector2.add(attackVector, Game.state.hq.rect.getCenter());
		for(let i = 0; i < WaveManager.BASE_ENEMY_AMOUNT + WaveManager.waveCount / 8; i++) {
			let spawnOffset = Vector2.scaleVec(Vector2.getRandomUnitVec(), Math.random() * WaveManager.SPREAD_RADIUS);
			let spawnHealth = 4 + WaveManager.waveCount / 15 + Math.pow(WaveManager.waveCount / 20, 1.5);
			Game.state.enemies.push(new Enemy(attackOrigin.x + spawnOffset.x, attackOrigin.y + spawnOffset.y, true, Math.random() > 0.5 ? EnemyType.SMALL : EnemyType.BIG, spawnHealth));
		}
		if(WaveManager.waveCount % 10 == 0) {
			
			for(let i = 0; i < WaveManager.waveCount / 15; i++) {
				let spawnOffset = Vector2.scaleVec(Vector2.getRandomUnitVec(), Math.random() * WaveManager.SPREAD_RADIUS);
				Game.state.enemies.push(new Enemy(attackOrigin.x + spawnOffset.x, attackOrigin.y + spawnOffset.y, true, EnemyType.BOSS, 70 + WaveManager.waveCount));
			}
		}
		if(WaveManager.waveCount >= 0 && WaveManager.waveCount % 4 == 0) {
			Game.state.enemies.push(new Enemy(attackOrigin.x, attackOrigin.y, true, EnemyType.BIG_ARMORED, 4));
		} 
		
	}
	
	static getCurrentWaveTime() {
		return WaveManager.BASE_WAVE_TIME;
	}
}
