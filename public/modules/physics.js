//section count
const sectionSize = 100;
//2d array of squares to save collsion time
export class CollisionMap {
    constructor(mapWidth, mapHeight) {
        //determininig size
        this.sectX = Math.ceil(mapWidth / sectionSize);
        this.sectY = Math.ceil(mapHeight / sectionSize);
        this.columns = [];
        for (let i = 0; i < this.sectX; i++) {
            this.columns.push([]);
        }
    }
    reset() {
        for (let x = 0; x < this.sectX; x++) {
            for (let y = 0; y < this.sectY; y++) {
                this.columns[x][y] = [];
            }
        }
    }
    add(entity) {
        entity.sections = [];
        const topLeft = entity.pos;
        let sectionsX = 1;
        let sectionsY = 1;
        const originX = this.getXSect(topLeft.x);
        const originY = this.getYSect(topLeft.y);
        const nextSDistX = Math.abs(topLeft.x % sectionSize);
        const nextSDistY = Math.abs(topLeft.y % sectionSize);
        sectionsX += Math.floor(entity.type.size.x / sectionSize);
        sectionsY += Math.floor(entity.type.size.y / sectionSize);
        if (entity.type.size.x % sectionSize >= nextSDistX)
            sectionsX += 1;
        if (entity.type.size.y % sectionSize >= nextSDistY)
            sectionsY += 1;
        for (let x = 0; x < sectionsX; x++) {
            for (let y = 0; y < sectionsY; y++) {
                this.#addIfExists(entity, originX + x, originY + y);
            }
        }
    }
    #addIfExists(entity, x, y) {
        if (x >= 0 && y >= 0 && x < sectionSize && y < sectionSize) {
            const section = this.columns[x][y];
            section.push(entity);
            entity.sections.push(section);
        }
    }
    getXSect(x) {
        return Math.floor(x / sectionSize) + this.sectX / 2;
    }
    getYSect(y) {
        return Math.floor(y / sectionSize) + this.sectY / 2;
    }
}
