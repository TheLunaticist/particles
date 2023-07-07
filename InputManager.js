class InputManager {
	static curMouseX;
	static curMouseY;
	
	
	static init() {
		Game.CANV.addEventListener("mousemove", (event) => {
			let canvasRect = Game.CANV.getBoundingClientRect();
			InputManager.curMouseX = event.clientX - canvasRect.left;
			InputManager.curMouseY = event.clientY - canvasRect.top;
		});
		
		Game.CANV.addEventListener("mousedown", (event) => {
			let canvasRect = Game.CANV.getBoundingClientRect();
			let mouseX = event.clientX - canvasRect.left;
			let mouseY = event.clientY - canvasRect.top;
	
			let doPassthrough = GUIManager.handleClick(mouseX, mouseY);
			if(doPassthrough) {
				Game.state.placementAttemptPosition = new Vector2(mouseX, mouseY);
			}
		});
	}
}