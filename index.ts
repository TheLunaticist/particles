"use strict";

import { loadFont, finishLoading } from "modules/assetManagement.js";
import { ScreenManager } from "modules/screenManager.js";

try {
	console.clear(); //sometimes firefox leaves old log messages

	loadFont("Orbitron", "Orbitron-Regular.ttf") //making font available for everyone
	/* import chaining will cause all files to load
	   if required classes will request their assets when loaded
	*/
	await finishLoading()
	ScreenManager.setActiveScreen(ScreenManager.START_SCREEN);
} catch (error) {
	//TODO implement graceful exit
	console.log("error happened but wasn't handled")
	throw error;
}
