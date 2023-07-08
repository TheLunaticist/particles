"use strict";

class GUIManager {
	static BUTTON_MG;
	static BUTTON_SNIPER;
	
	static MENU_OFFSET = 25;
	static MENU_BUTTON_SIZE = 56;
	
	
	static init() {
		GUIManager.BUTTON_SNIPER = new Clickable(GUIManager.MENU_OFFSET, Game.CANV.height - GUIManager.MENU_OFFSET - GUIManager.MENU_BUTTON_SIZE, GUIManager.MENU_BUTTON_SIZE, GUIManager.MENU_BUTTON_SIZE, AssetManager.SNIPER_TURRET_ICON, TowerType.SNIPER);
		GUIManager.BUTTON_MG = new Clickable(GUIManager.MENU_OFFSET * 2 + GUIManager.MENU_BUTTON_SIZE, Game.CANV.height - GUIManager.MENU_OFFSET - GUIManager.MENU_BUTTON_SIZE, GUIManager.MENU_BUTTON_SIZE, GUIManager.MENU_BUTTON_SIZE, AssetManager.MG_TURRET_ICON, TowerType.MG);
	}
	
	static draw() {
		Tower.drawBlueprint(InputManager.curMouseX, InputManager.curMouseY, Game.state.selTowType);
		GUIRenderer.drawStats();
		GUIManager.BUTTON_SNIPER.draw();
		GUIManager.BUTTON_MG.draw();
	}
	
	static update() {
		
	}
	
	static handleClick(x, y) {
		if(GUIManager.BUTTON_SNIPER.rect.isInside(new Vector2(x, y))) {
			GUIManager.BUTTON_SNIPER.handleClick();
			return false;
		}
		else if(GUIManager.BUTTON_MG.rect.isInside(new Vector2(x, y))) {
			GUIManager.BUTTON_MG.handleClick();
			return false;
		}
		else {
			return true;
		}
	}
}

class GUIRenderer {
	static STAT_FONT = "36px Orbitron";
	static STAT_OFFSET = 25;
	
	static drawStats() {
		Game.CTX.font = GUIRenderer.STAT_FONT;
		
		Game.CTX.fillStyle = "red";
		let drawStringHealth = "health: " + Math.floor(Game.state.playerHealth);
		let height = Game.CTX.measureText(drawStringHealth).actualBoundingBoxAscent;
		Game.CTX.fillText(drawStringHealth, 0 + GUIRenderer.STAT_OFFSET, height + GUIRenderer.STAT_OFFSET);
		
		Game.CTX.fillStyle = "gold";
		let drawStringMoney = "money: " + Math.floor(Game.state.money);
		let measure = Game.CTX.measureText(drawStringMoney);
		Game.CTX.fillText(drawStringMoney, Game.CANV.width - measure.width - GUIRenderer.STAT_OFFSET, measure.actualBoundingBoxAscent + GUIRenderer.STAT_OFFSET);
	}
	
	static drawEnd() {
		Game.CTX.fillStyle = "red";
		Game.CTX.fillRect(0, 0, Game.CANV.width, Game.CANV.width);
		
		Game.CTX.fillStyle = "black";
		Game.CTX.font = "100px Orbitron";
		Game.CTX.textBaseline = "alphabetic";
		let endText = "Game Over";
		let textBox = Game.CTX.measureText(endText);
		let textX = Game.CANV.width / 2 - textBox.width / 2;
		let textY = Game.CANV.height / 2 + textBox.actualBoundingBoxAscent / 2;
		Game.CTX.fillText(endText, textX, textY);
	}
}

class Clickable {
	constructor(x, y, width, heigth, img, towerType) {
		this.rect = new Rectangle(x, y, width, heigth);
		this.img = img;
		this.towerType = towerType;
	} 
	
	handleClick() {
		Game.state.selTowType = this.towerType;
	}
	
	draw() {
		if(this.rect.isInside(new Vector2(InputManager.curMouseX, InputManager.curMouseY)) || this.towerType == Game.state.selTowType) {
			Game.CTX.fillStyle = "White";
		} else {
			Game.CTX.fillStyle = "DarkRed";
		}
		
		Game.CTX.fillRect(this.rect.left, this.rect.top, this.rect.width, this.rect.height);
		Game.CTX.drawImage(this.img, this.rect.left + 3, this.rect.top + 3);
	}
}