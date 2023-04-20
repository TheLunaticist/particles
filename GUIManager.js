class GUIManager {
	static BUTTON_MG;
	static BUTTON_SNIPER;
	
	static MENU_OFFSET = 25;
	static MENU_BUTTON_SIZE = 50;
	
	
	static globalInit() {
		GUIManager.BUTTON_MG = new Button(GUIManager.MENU_OFFSET, window.canvas.heigth - GUIManager.MENU_OFFSET - GUIManager.MENU_BUTTON_SIZE, GUIManager.MENU_BUTTON_SIZE, GUIManager.MENU_BUTTON_SIZE, window.MG_BUTTON_SPRITE);
		GUIManager.BUTTON_SNIPER = new Button(GUIManager.MENU_OFFSET, window.canvas.heigth - GUIManager.MENU_OFFSET - GUIManager.MENU_BUTTON_SIZE, GUIManager.MENU_BUTTON_SIZE, GUIManager.MENU_BUTTON_SIZE, window.SNIPER_BUTTON_SPRITE);
	}
	
	static draw() {
		Tower.drawBlueprint(window.mouseX, window.mouseY, Tower.TOWER_TYPE_MG);
		GUIRenderer.drawStats();
	}
	
	static update() {
		
	}
	
	static handleClick() {
		return true;
	}
}

class GUIRenderer {
	static STAT_FONT = "36px Orbitron";
	static STAT_OFFSET = 25;
	
	static drawStats() {
		window.ctx.font = GUIRenderer.STAT_FONT;
		
		window.ctx.fillStyle = "red";
		let drawStringHealth = "health: " + window.gameState.playerHealth;
		let height = window.ctx.measureText(drawStringHealth).actualBoundingBoxAscent;
		window.ctx.fillText(drawStringHealth, 0 + GUIRenderer.STAT_OFFSET, height + GUIRenderer.STAT_OFFSET);
		
		window.ctx.fillStyle = "gold";
		let drawStringMoney = "money: " + window.gameState.money;
		let measure = window.ctx.measureText(drawStringMoney);
		window.ctx.fillText(drawStringMoney, window.canvas.width - measure.width - GUIRenderer.STAT_OFFSET, measure.actualBoundingBoxAscent + GUIRenderer.STAT_OFFSET);
	}
	
	static drawEnd() {
		window.ctx.fillStyle = "red";
		window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
		
		window.ctx.fillStyle = "black";
		window.ctx.font = "100px Orbitron";
		window.ctx.textBaseline = "alphabetic";
		let endText = "Game Over";
		let textBox = window.ctx.measureText(endText);
		let textX = window.canvas.width / 2 - textBox.width / 2;
		let textY = window.canvas.height / 2 + textBox.actualBoundingBoxAscent / 2;
		window.ctx.fillText(endText, textX, textY);
	}
}

class Button {
	constructor(x, y, width, heigth, img) {
		this.rect = new Rectangle(x, y, width, heigth);
	}
	
	draw() {
		
	}
}