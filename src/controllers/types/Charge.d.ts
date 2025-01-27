export interface Charge {
    due_at: string
    last_transaction?: {
        amount?: string
        gateway_response_fields?: {
            typeable_barcode?: string
            token_transaction?: string
        }
    }
    customer: {
        id: number
    }
    payment_method: {
        id: number
        public_name: string
    }
}
