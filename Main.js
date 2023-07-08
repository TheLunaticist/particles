"use strict";

class Looper {
	static lastFrameTS;
	static THROTTLE_FPS = false;
	static skippedLast = false;
	
	static loop() {
		//while(Date.now() - Looper.lastFrameTS < Game.MS_PER_FRAME) {}
		
		if(!Game.throttleFps || Looper.skippedLast) {
			Game.doFrame();
		}
		
		Looper.skippedLast = !Looper.skippedLast;
		
		//Looper.lastFrameTS = Date.now();
		window.requestAnimationFrame(Looper.loop);
	}
}

function startGame() {
	Game.init(document.getElementById("particlesCanvas"));
	Looper.loop();
}


//game start
AssetManager.loadThenCall(startGame);




