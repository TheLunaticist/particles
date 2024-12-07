import { Entity } from "modules/entity.js";
import { ctx } from "modules/graphics.js";
import { Level } from "./level";

//section count
const sectionSizeHint = 100; //the wanted chunk size
const legacySectionSize = 100;

//2d array of squares to save collsion time
export class CollisionMap {
	//how many chunks there are per axis
    chSizeX: number;
    chSizeY: number;

	//how big chunks are per dimension (might vary)
    secSizeX: number;
    secSizeY: number;

    columns: Entity[][][];

    constructor(mapWidth: number, mapHeight: number) {
        //determininig size
        this.chSizeX = Math.ceil(mapWidth / sectionSizeHint);
        this.chSizeY = Math.ceil(mapHeight / sectionSizeHint);

        this.secSizeX = mapWidth / this.chSizeX;
        this.secSizeY = mapHeight / this.chSizeY;

        this.columns = [];
        for (let i = 0; i < this.chSizeX; i++) {
            this.columns.push([]);
        }
    }

    reset() {
        for (let x = 0; x < this.chSizeX; x++) {
            for (let y = 0; y < this.chSizeY; y++) {
                this.columns[x][y] = [];
            }
        }
    }

    add(entity: Entity) {
        //clearing old
        entity.sections = [];

        const topLeft = entity.pos;
        const size = entity.type.size;

        //the smallest an enemy can be is a point so it must occupy at least one chunk
        let chunkBoxW = 1;
        let chunkBoxH = 1;

        const firstChunkX = this.getChunkFromPointX(topLeft.x);
        const firstChunkY = this.getChunkFromPointY(topLeft.y);

        chunkBoxW += Math.floor(size.x / this.secSizeX);
        chunkBoxH += Math.floor(size.y / this.secSizeY);

        const remSizeX = size.x % this.secSizeX;
        const remSizeY = size.y % this.secSizeY;

        const leftOffset = topLeft.x % this.secSizeX;

        const leftFlipped =
            topLeft.x < 0
                ? legacySectionSize - Math.abs(topLeft.x % legacySectionSize)
                : topLeft.x;
        const topFlipped =
            topLeft.y < 0 ? legacySectionSize - Math.abs(topLeft.y) : topLeft.y;

        const inChunkDistX = leftFlipped % this.secSizeX;
        const inChunkDistY = topFlipped % this.secSizeY;

        if (inChunkDistX + (size.x % legacySectionSize) >= legacySectionSize)
            chunkBoxW += 1;
        if (inChunkDistY + (size.y % legacySectionSize) >= legacySectionSize)
            chunkBoxH += 1;

        for (let x = 0; x < chunkBoxW; x++) {
            for (let y = 0; y < chunkBoxH; y++) {
                this.addIfExists(entity, firstChunkX + x, firstChunkY + y);
            }
        }
    }

    private addIfExists(entity: Entity, x: number, y: number) {
        if (
            x >= 0 &&
            y >= 0 &&
            x < legacySectionSize &&
            y < legacySectionSize
        ) {
            const section = this.columns[x][y];
            section.push(entity);
            entity.sections.push(section);
        }
    }

    getChunkFromPointX(x: number) {
        return Math.floor(x / this.secSizeX);
    }

    getChunkFromPointY(y: number): number {
        return Math.floor(y / this.secSizeY);
    }

    getChunkOffsetX(x: number): number {
        if (x >= 0) {
			return x % this.secSizeX;
        } else {
			return (x % this.secSizeX) - this.secSizeX;
		}
    }

    getChunkOffsetY(y: number): number {
        if (y >= 0) {
			return y % this.secSizeY;
        } else {
			return (y % this.secSizeY) - this.secSizeY;
		}
    }

	debugDraw(level: Level) {
		const view = level.view;
		ctx.strokeStyle = "blue";
		ctx.beginPath();

		//vertical lines (x)
		let worldLeft = 0 - level.desc.size.x / 2;
		let worldTop = 0 - level.desc.size.y / 2;
		view.moveTo(worldLeft, worldTop);
		view.lineTo(worldLeft, worldTop + level.desc.size.y);
		// for (let chunkX = 0;  chunkX  < this.chSizeX;  chunkX++) {
		// }

		ctx.stroke();
	}
}
