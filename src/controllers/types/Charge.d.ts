export interface Charge {
    last_transaction: {
        gateway_response_fields: {
            typeable_barcode: string
            token_transaction: string
        }
    }
    customer: {
        id: number
    }
}
