"use strict";
export class AssetManager {
    static TEXTURE_PATH = ".\\assets\\textures\\";

    static textures = {};
    static textureNumber = 0;

    static async load() {
	let promises = [];

	const loadTexture = AssetManager.loadTexture;
	//misc
	loadTexture("hq", promises);
	//projectiles
	loadTexture("cannon_ball", promises);
	loadTexture("rocket", promises);
	//turrets
	loadTexture("mg_turret_base", promises);
	loadTexture("mg_turret_head", promises);
	loadTexture("mg_button", promises);
	loadTexture("sniper_turret_base", promises);
	loadTexture("sniper_turret_head", promises);
	loadTexture("sniper_button", promises);
	loadTexture("rocket_turret_base", promises);
	loadTexture("rocket_turret_head", promises);
	loadTexture("rocket_button", promises);

	let results = await Promise.allSettled(promises);
	let rejectReasons = [];
	results.forEach((result) => {
	    if(result.status !== "fulfilled") {
		rejectReasons.push(result.reason);
	    }
	});

	if(rejectReasons.length !== 0) {
	    return Promise.reject(new LoadTextureError(rejectReasons, AssetManager.textureNumber));
	}
    }

    static loadTexture(name, promiseCollector) {
	AssetManager.textureNumber += 1;
	let image = new Image();
	AssetManager.textures[name] = image;

	promiseCollector.push(new Promise((resolve, reject) => {
	    const cleanup = () => { image.onload = null; image.onerror = null };
	    image.onload = () => { cleanup(); resolve(); };
	    image.onerror = (errorEvent) => { cleanup(); reject(errorEvent); };
	    image.src = AssetManager.TEXTURE_PATH + name + ".png";
	}));
    }
}

class AssetManagerError extends Error {
    constructor(message) {
	super(message);
    }
}

class LoadTextureError extends AssetManagerError {
    constructor(rejectReasons, numberOfThingsToLoad) {
	super(`Unable to load some of the textures. [${rejectReasons.length}/${numberOfThingsToLoad}]`);
	this.name = "LoadTextureError";
	this.rejectReasons = rejectReasons;
    }
}
