export interface FilteredCustomer {
    name: string
    due_at: string
    amount?: string
    token_transaction?: string
    typeable_barcode?: string
    phoneNumber: string | null
    template: string
}
