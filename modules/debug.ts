export class LoggableError extends Error {
    constructor(message: string) {
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

export class InstanceAssertionFailedError extends Error {
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

export function assert(value: boolean) {
    if (value !== true) throw new AssertionFailedError();
}

export function typeAssert(value: any, type: string) {
    if (typeof value !== type) throw new TypeAssertionFailedError();
}

export function instanceAssert(value: any, type: Function) {
    if (!(value instanceof type)) throw new InstanceAssertionFailedError();
}
