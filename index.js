"use strict";

import { AssetManager, LoadAssetError } from "/m/assetManager.js";
import { ScreenManager } from "/m/screenManager.js";

//loading
try {
    await AssetManager.load();
} catch (error) {
    if (error instanceof LoadAssetError) {
        error.log();
    } else {
        throw error;
    }
}

ScreenManager.setActiveScreen(ScreenManager.START_SCREEN);
