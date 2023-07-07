"use strict";

class Looper {
	static lastFrameTS;
	
	static loop() {
		while(Date.now() - Looper.lastFrameTS < Game.MS_PER_FRAME) {}
		
		Game.doFrame();
		
		Looper.lastFrameTS = Date.now();
		window.requestAnimationFrame(Looper.loop);
	}
}

function startGame() {
	Game.init(document.getElementById("particlesCanvas"));
	Looper.loop();
}


//game start
AssetManager.loadThenCall(startGame);




