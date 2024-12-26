"use strict";

import { loadFont, finishLoading } from "modules/assetManagement.js";
import { ScreenManager } from "modules/screenManager.js";

try {
	console.clear(); //sometimes firefox leaves old log messages when reloading rapidly
	console.log(`START OF LOG ${Date()}.`);

	loadFont("Orbitron", "Orbitron-Regular.ttf") //making font available for everyone

	/* import chaining will have caused all files to be queued for loading 
	 * by the classes requesting them.
	*/
	await finishLoading()
	ScreenManager.setActiveScreen(ScreenManager.START_SCREEN);
} catch (error) {
	//TODO possibly implement server backed handling
	console.log("error happened but wasn't handled")
	throw error;
}
