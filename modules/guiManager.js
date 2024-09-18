"use strict";

import { Game } from "/m/game.js";
import { AssetManager } from "/m/assetManager.js";
import { TowerType, Tower } from "/m/entity.js";
import { Rectangle } from "/m/rectangle.js";
import { InputManager } from "/m/inputManager.js";
import { Vector2 } from "/m/vector2.js";

export class GUIManager {
	static BUTTON_MG;
	static BUTTON_SNIPER;
	static ROCKET_BUTTON;
	
	static MENU_OFFSET = 25;
	static MENU_BUTTON_SIZE = 56;
	
	
	static init() {
	    let txts = AssetManager.textures;
	    GUIManager.BUTTON_SNIPER = new Clickable(GUIManager.MENU_OFFSET, canvas.height - GUIManager.MENU_OFFSET - GUIManager.MENU_BUTTON_SIZE, GUIManager.MENU_BUTTON_SIZE, GUIManager.MENU_BUTTON_SIZE, txts["sniper_button"], TowerType.SNIPER);
	    GUIManager.BUTTON_MG = new Clickable(GUIManager.MENU_OFFSET * 2 + GUIManager.MENU_BUTTON_SIZE, canvas.height - GUIManager.MENU_OFFSET - GUIManager.MENU_BUTTON_SIZE, GUIManager.MENU_BUTTON_SIZE, GUIManager.MENU_BUTTON_SIZE, txts["mg_button"], TowerType.MG);
	    GUIManager.ROCKET_BUTTON = new Clickable(GUIManager.MENU_OFFSET * 3 + GUIManager.MENU_BUTTON_SIZE * 2, canvas.height - GUIManager.MENU_OFFSET - GUIManager.MENU_BUTTON_SIZE, GUIManager.MENU_BUTTON_SIZE, GUIManager.MENU_BUTTON_SIZE, txts["rocket_button"], TowerType.ROCKET);
	}
	
	static draw() {
		Tower.drawBlueprint(InputManager.curMouseX, InputManager.curMouseY, Game.state.selTowType);
		GUIRenderer.drawStats();
		GUIManager.BUTTON_SNIPER.draw();
		GUIManager.BUTTON_MG.draw();
		GUIManager.ROCKET_BUTTON.draw();
	}
	
	static update() {
		
	}
	
	static handleClick(x, y) {
		if(GUIManager.BUTTON_SNIPER.rect.isPointInside(new Vector2(x, y))) {
			GUIManager.BUTTON_SNIPER.handleClick();
			return false;
		}
		else if(GUIManager.BUTTON_MG.rect.isPointInside(new Vector2(x, y))) {
			GUIManager.BUTTON_MG.handleClick();
			return false;
		}
		else if(GUIManager.ROCKET_BUTTON.rect.isPointInside(new Vector2(x, y))) {
			GUIManager.ROCKET_BUTTON.handleClick();
			return false;
		}
		else {
			return true;
		}
	}
}

export class GUIRenderer {
	static STAT_FONT = "36px Orbitron";
	static STAT_OFFSET = 25;
	
	static drawStats() {
		ctx.font = GUIRenderer.STAT_FONT;
		
		ctx.fillStyle = "red";
		let drawStringHealth = "health: " + Math.floor(Game.state.playerHealth);
		let height = ctx.measureText(drawStringHealth).actualBoundingBoxAscent;
		ctx.fillText(drawStringHealth, 0 + GUIRenderer.STAT_OFFSET, height + GUIRenderer.STAT_OFFSET);
		
		ctx.fillStyle = "gold";
		let drawStringMoney = "money: " + Math.floor(Game.state.money);
		let measure = ctx.measureText(drawStringMoney);
		ctx.fillText(drawStringMoney, canvas.width - measure.width - GUIRenderer.STAT_OFFSET, measure.actualBoundingBoxAscent + GUIRenderer.STAT_OFFSET);
	}
	
	static drawEnd() {
		ctx.fillStyle = "red";
		ctx.fillRect(0, 0, canvas.width, canvas.width);
		
		ctx.fillStyle = "black";
		ctx.font = "100px Orbitron";
		ctx.textBaseline = "alphabetic";
		let endText = "Game Over";
		let textBox = ctx.measureText(endText);
		let textX = canvas.width / 2 - textBox.width / 2;
		let textY = canvas.height / 2 + textBox.actualBoundingBoxAscent / 2;
		ctx.fillText(endText, textX, textY);
	}
}

export class Clickable {
	constructor(x, y, width, heigth, img, towerType) {
		this.rect = new Rectangle(x, y, width, heigth);
		this.img = img;
		this.towerType = towerType;
	} 
	
	handleClick() {
		Game.state.selTowType = this.towerType;
	}
	
	draw() {
		if(this.rect.isPointInside(new Vector2(InputManager.curMouseX, InputManager.curMouseY)) || this.towerType == Game.state.selTowType) {
			ctx.fillStyle = "White";
		} else {
			ctx.fillStyle = "DarkRed";
		}
		
		ctx.fillRect(this.rect.left, this.rect.top, this.rect.width, this.rect.height);
		ctx.drawImage(this.img, this.rect.left + 3, this.rect.top + 3);
	}
}
