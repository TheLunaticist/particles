"use strict";

class WaveManager {
	static BASE_ENEMY_AMOUNT = 5;
	static BASE_WAVE_TIME = 60;
	static waveTime;
	static waveCount = 0;
	
	static OFFSCREEN_LENGTH;
	static SPREAD_RADIUS = 200;
	
	static init() {
		WaveManager.waveTime = WaveManager.BASE_WAVE_TIME;
		WaveManager.OFFSCREEN_LENGTH = new Vector2(Game.CANV.width / 2, Game.CANV.height / 2).getLength();
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
		for(let i = 0; i < WaveManager.BASE_ENEMY_AMOUNT + WaveManager.waveCount / 4; i++) {
			let spawnOffset = Vector2.scaleVec(Vector2.getRandomUnitVec(), Math.random() * WaveManager.SPREAD_RADIUS);
			let hasArmor = Math.random() > 0.5;
			Game.state.enemies.push(new Enemy(attackOrigin.x + spawnOffset.x, attackOrigin.y + spawnOffset.y, true, Math.random() > 0.5 ? EnemyType.SMALL : EnemyType.BIG, hasArmor * 8));
		}
		
	}
	
	static getCurrentWaveTime() {
		return WaveManager.BASE_WAVE_TIME;
	}
}
