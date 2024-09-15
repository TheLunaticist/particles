"use strict";

import { LoggableError } from "/m/debug.js";

export class AssetManager {
    static TEXTURE_PATH = ".\\assets\\textures\\";

    static textures = {};
    static textureNumber = 0;

    static async load() {
	let promises = [];

	//textures
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

	loadTexture("notexisting", promises);

	//fonts
	AssetManager.loadFont("Orbitron", "url(./assets/fonts/Orbitron-Regular.ttf)", promises);

	let results = await Promise.allSettled(promises);
	let rejectReasons = [];
	results.forEach((result) => {
	    if(result.status !== "fulfilled") {
		rejectReasons.push(result.reason);
	    }
	});

	if(rejectReasons.length !== 0) {
	    return Promise.reject(new LoadAssetError(rejectReasons, AssetManager.textureNumber));
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

    static loadFont(name, src, promiseCollector) {
	const fontFace = new FontFace(
	    name,
	    src,
	);

	document.fonts.add(fontFace);

	promiseCollector.push(fontFace.load());
    }
}

export class LoadAssetError extends LoggableError {
    constructor(rejectReasons, assetCount) {
	super("Unable to load all textures.");
	this.name = "AssetManager::LoadAssetError";
	this.rejectReasons = rejectReasons;
	this.totalAssetCount = assetCount;
    }

    log() {
	console.error(this.name + ":", this.message + ` [${this.totalAssetCount - this.rejectReasons.length}/${this.totalAssetCount}]\nerror events:`, this.rejectReasons);
    }
}
