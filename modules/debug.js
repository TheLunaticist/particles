export class LoggableError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }

    log() {
        console.error(this.name);
    }
}

export class AssertionFailedError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
    }
}

export class TypeAssertionFailedError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
    }
}

export class CalledVirtualFunctionError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
    }
}

export function assert(value) {
    if (value !== true) throw new AssertionFailedError();
}

export function typeAssert(value, type) {
    if (typeof value !== type) throw new TypeAssertionFailedError();
}

export function instanceAssert(value, type) {
    if (!(value instanceof type)) throw new TypeAssertionFailedError();
}
