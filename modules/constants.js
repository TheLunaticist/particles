"use strict";

export class GameStages {
	static RUNNING = 0;
	static OVER = 1;
}

export class MoneyConfig {
	static COOLDOWN = 1;
	static GAIN = 0.2;
}

export class StartConfig {
	static PLAYER_HEALTH = 200;
	static PLAYER_MONEY = 160;
}

export class Colors {
	static BACKGROUND = "rgb(0, 0, 0)";
	static BP = "#44a7c5";
	static BP_INVALID = "#730606";
}

export class ColliderShapes {
	static SQUARE = 0;
	static CIRCLE = 1;
}
