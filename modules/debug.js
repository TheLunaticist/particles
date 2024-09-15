export class LoggableError extends Error {
    constructor(message) {
	super(message);
	this.name = this.constructor.name;
    }

    log() {
	console.error(this.name);
    }
}
