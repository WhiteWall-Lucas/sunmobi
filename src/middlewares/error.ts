import type { NextFunction, Request, Response } from 'express'
import { HttpError } from '../utils/route/error'

export const errorHandler = (err: Error, _: Request, res: Response, next: NextFunction) => {
    if (err) {
        if (err instanceof HttpError) {
            res.status(err.statusCode).send({ error: err.message, details: err.details })
            return
        }

        res.status(500).send({
            error: `Server error: ${(err as Error)?.message}`,
        })
    }

    next()
}
