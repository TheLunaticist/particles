"use strict";

export class AssetManager {
	static IMAGE_PATH = "assets\\textures\\";
	static imagesToLoad = 0;
	static funcToCall;
	
	static HQ_SPRITE;
	static PROJECTILE_SPRITE;
	
	static SNIPER_TURRET_HEAD;
	static SNIPER_TURRET_BASE;
	static SNIPER_TURRET_ICON;
	
	static MG_TURRET_BASE;
	static MG_TURRET_HEAD;
	static MG_TURRET_ICON;
	
	static ROCKET_TURRET_HEAD;
	static ROCKET_TURRET_BASE;
	static ROCKET_TURRET_ICON;
	
	static loadThenCall(func) {
		AssetManager.funcToCall = func;
		
		//hq
		AssetManager.HQ_SPRITE = AssetManager.getTexture("hq.png");
		
		//projectile
		AssetManager.PROJECTILE_SPRITE = AssetManager.getTexture("cannon_ball.png");
		AssetManager.ROCKET_PROJECTILE_SPRITE = AssetManager.getTexture("rocket.png");
		
		//mg turret
		//base
		AssetManager.MG_TURRET_BASE = AssetManager.getTexture("mg_turret_base.png");
		//head
		AssetManager.MG_TURRET_HEAD = AssetManager.getTexture("mg_turret_head.png");
		//shop icon
		AssetManager.MG_TURRET_ICON = AssetManager.getTexture("mg_button.png");
		
		//sniper turret
		//base
		AssetManager.SNIPER_TURRET_BASE = AssetManager.getTexture("sniper_turret_base.png");
		//head
		AssetManager.SNIPER_TURRET_HEAD = AssetManager.getTexture("sniper_turret_head.png");
		AssetManager.SNIPER_TURRET_ICON = AssetManager.getTexture("sniper_button.png");
		
		//rocket turret
		AssetManager.ROCKET_TURRET_BASE = AssetManager.getTexture("rocket_turret_base.png");
		AssetManager.ROCKET_TURRET_HEAD = AssetManager.getTexture("rocket_turret_head.png");
		AssetManager.ROCKET_TURRET_ICON = AssetManager.getTexture("rocket_button.png");
	}
	
	static getTexture(fileName) {
		let img = new Image();
		img.src = AssetManager.IMAGE_PATH + fileName;
		img.onload = AssetManager.onLoad;
		AssetManager.imagesToLoad++;
		return img;
	}
	
	static onLoad() {
		AssetManager.imagesToLoad--;
		if(AssetManager.imagesToLoad == 0) {
			AssetManager.funcToCall();
			AssetManager.funcToCall = undefined;
		}
	}
	
}
