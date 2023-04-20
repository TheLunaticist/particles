class AssetManager {
	static IMAGE_PATH = "assets\\textures\\";
	
	static HQ_SPRITE;
	static PROJECTILE_SPRITE;
	
	static MG_TURRET_BASE;
	static SNIPER_TURRET_BASE;
	
	static load() {
		//hq
		AssetManager.HQ_SPRITE = AssetManager.getTexture("hq.png");
		
		//projectile
		AssetManager.PROJECTILE_SPRITE = AssetManager.getTexture("cannon_ball.png");
		
		//mg turret
		//base
		AssetManager.MG_TURRET_BASE = AssetManager.getTexture("mg_turret_base.png");
		//head
		AssetManager.MG_TURRET_HEAD = AssetManager.getTexture("mg_turret_head.png");
		
		//sniper turret
		//base
		AssetManager.SNIPER_TURRET_BASE = AssetManager.getTexture("turret_base.png");
		//head
		AssetManager.SNIPER_TURRET_HEAD = AssetManager.getTexture("turret_head.png");
	}
	
	static getTexture(fileName) {
		let img = new Image();
		img.src = AssetManager.IMAGE_PATH + fileName;
		return img;
	}
}