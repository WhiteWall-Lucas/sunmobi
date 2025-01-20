export class LoggableError extends Error {
    constructor(
        public readonly message: string,
        public readonly properties: Record<string, unknown> = {},
    ) {
        super(message)
        properties.stack = this.stack
    }
}
