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

export class Screen {
    uiElements: UIElement[] = [];
    constructor(public liveRendering: boolean) {}

    draw() {
        this.uiElements.forEach((e) => {
            e.draw();
        });
    }

    open() {}
    close() {}
    mouseMove(e: MouseEvent) {
        this.uiElements.forEach((element) => {
            element.mouseMove(e);
        });
    }

    mouseClick(event: MouseEvent): boolean {
        return this.uiElements.every((element) => {
            return !(element.mouseClick(event) === false);
        });
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
    constructor() {
        super(true);
    }

    open() {
        Game.init();
    }

    draw() {
        Game.doFrame();
    }

    mouseClick(e: MouseEvent): boolean {
        //forwarding mouse click only if it isn't captured by other ui elements
        let value = super.mouseClick(e);
        if (!value) Game.clickEvent(e);
        return value;
    }
}
