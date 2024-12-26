import {
    UIText,
    HorizontalAnchorPoint,
    VerticalAnchorPoint,
    UIButton,
    UIElement,
} from "modules/uiElement.js";
import { Vec2 } from "modules/vector2.js";
import { ScreenManager } from "modules/screenManager.js";
import { Game } from "modules/game.js";
import { canvas, ctx } from "modules/graphics.js";

export enum EventState {
    CAPTURED,
    UNCAPTURED,
}

export abstract class Screen {
    uiElements: UIElement[] = [];
    constructor(public liveRendering: boolean) {}

    draw() {
        this.uiElements.forEach((e) => {
            e.draw();
        });
    }

    open() {}
    close() {}

    mouseMoveEvent(event: MouseEvent) {
		for(const elem of this.uiElements) {
			elem.mouseMoveEvent(event);
		}
	}

    mouseUpEvent(event: MouseEvent) {
		for(const elem of this.uiElements) {
			elem.mouseUpEvent(event);
		}
	}

    mouseDownEvent(event: MouseEvent) {
		for(const elem of this.uiElements) {
			elem.mouseDownEvent(event);
		}
	}
}

export class StartScreen extends Screen {
    constructor() {
        super(false);
        this.uiElements.push(
            UIText.new({
                vertical: VerticalAnchorPoint.MIDDLE,
                horizontal: HorizontalAnchorPoint.MIDDLE,
                offset: new Vec2(0, 0),
                size: new Vec2(0, 96),
                text: "Particles",
            }),
        );
        this.uiElements.push(
            UIButton.new({
                vertical: VerticalAnchorPoint.MIDDLE,
                horizontal: HorizontalAnchorPoint.MIDDLE,
                offset: new Vec2(0, 48 + 32),
                size: new Vec2(0, 64),
                text: "Play",
                clickCallback: () => {
                    ScreenManager.setActiveScreen(ScreenManager.GAME_SCREEN);
                },
            }),
        );
    }

    draw() {
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        super.draw();
    }

    open() {
        this.draw();
    }
}

export class EndScreen extends Screen {
    constructor() {
        super(false);
        this.uiElements.push(
            UIText.new({
                vertical: VerticalAnchorPoint.MIDDLE,
                horizontal: HorizontalAnchorPoint.MIDDLE,
                offset: new Vec2(0, 0),
                size: new Vec2(0, 96),
                text: "Game Over",
            }),
        );
        this.uiElements.push(
            UIButton.new({
                vertical: VerticalAnchorPoint.MIDDLE,
                horizontal: HorizontalAnchorPoint.MIDDLE,
                offset: new Vec2(0, 48 + 32),
                size: new Vec2(0, 64),
                text: "Retry",
                clickCallback: () => {
                    ScreenManager.setActiveScreen(ScreenManager.GAME_SCREEN);
                },
            }),
        );
    }

    draw() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        super.draw();
    }
    open() {
        this.draw();
    }
}

export class GameScreen extends Screen {
    isMouseDown: boolean = false;
    isMoveDragging: boolean = false;
	lastDragX: number = 0;
	lastDragY: number = 0;

    constructor() {
        super(true);
    }

    open() {
        Game.init();
    }

    draw() {
        Game.doFrame();
    }

    mouseUpEvent(e: MouseEvent): void {
        this.isMouseDown = false;
    }

    mouseDownEvent(event: MouseEvent): void {
        this.isMouseDown = true;
		this.isMoveDragging = !Game.checkMouseInteract();
		if(this.isMoveDragging) {
			this.lastDragX = event.clientX;
			this.lastDragY = event.clientY;
		}
    }

	mouseMoveEvent(event: MouseEvent): void {
		if(this.isMouseDown && this.isMoveDragging) {
			Game.moveView(event.clientX - this.lastDragX, event.clientY - this.lastDragY);
			this.lastDragX = event.clientX;
			this.lastDragY = event.clientY;
		}
	}
}
