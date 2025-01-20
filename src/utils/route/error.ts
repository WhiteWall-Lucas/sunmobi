import { LoggableError } from './loggableerror'

export class HttpError extends LoggableError {
    constructor(statusCode: number, error: Error, details?: unknown)
    constructor(statusCode: number, message: string, details?: unknown)
    constructor(
        public statusCode: number,
        messageOrError: string | Error,
        public details?: unknown,
    ) {
        super(messageOrError instanceof Error ? messageOrError.message : messageOrError, { statusCode, details })
    }
}
