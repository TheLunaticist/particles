"use strict";

import { loadFont, finishLoading } from "modules/assetManagement.js";
import { ScreenManager } from "modules/screenManager.js";

try {
	loadFont("Orbitron", "Orbitron-Regular.ttf") //loading font for everyone
	await finishLoading()
	ScreenManager.setActiveScreen(ScreenManager.START_SCREEN);
} catch (error) {
	//TODO properly handle error 
	console.log("error happened but wasn't handled")
	throw error;
}
