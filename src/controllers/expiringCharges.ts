import { Router } from 'express'
import type { Charge } from './types/Charge'
import api from '../api'
import type { FilteredCustomer } from './types/FilteredCustomers'
import type { Customer } from './types/Customer'
import { message } from '../config.json'
import axios from 'axios'
import { getDateInThreeDays } from '../utils/getDateInThreeDays'
import { formatarDataISO } from '../utils/formatDateToDDMMYYYY'

export default Router().get('/', async (_req, res) => {
    try {
        const customers = await fetchExpiringChargesLogic()
        res.status(200).json(customers)
    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
})

export const fetchExpiringChargesLogic = async (): Promise<FilteredCustomer[]> => {
    const expiringDate = getDateInThreeDays()
    const perPage = 50
    let page = 1
    const filteredCustomers: FilteredCustomer[] = []

    try {
        let totalRecords = 0
        let processedRecords = 0

        do {
            const query = `per_page=${perPage}&page=${page}&query=due_at%3D${expiringDate}%20AND%20status%3Dpending`

            const response = await api.get<{ charges: Charge[] }>(`/charges?${query}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Basic NVdBUGpWYXlKR0Ftc1M0ZnlvMUhaZ3pLMkNnNGZiRXd5RFlHeWpEMnA3NDp1bmRlZmluZWQ=',
                },
            })

            totalRecords = Number(response.headers.total || 0)
            const charges = response.data.charges

            for (const charge of charges) {
                const { id: customerId } = charge.customer
                const gatewayResponseFields = charge.last_transaction?.gateway_response_fields || {}
                const { typeable_barcode, token_transaction } = gatewayResponseFields
                const amount = charge.last_transaction?.amount
                const { due_at } = charge
                const { id: paymentMethodId, public_name } = charge.payment_method

                try {
                    const customerResponse = await api.get<{ customer: Customer }>(`/customers/${customerId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization:
                                'Basic NVdBUGpWYXlKR0Ftc1M0ZnlvMUhaZ3pLMkNnNGZiRXd5RFlHeWpEMnA3NDp1bmRlZmluZWQ=',
                        },
                    })

                    const customer = customerResponse.data.customer
                    const mobilePhone = customer.phones.find((phone) => phone.phone_type === 'mobile')

                    if ((paymentMethodId === 49489 || public_name === 'Boleto bancário') && mobilePhone !== undefined) {
                        filteredCustomers.push({
                            name: customer.name,
                            amount:
                                amount &&
                                Number.parseFloat(amount).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                }),
                            due_at: formatarDataISO(due_at),
                            token_transaction,
                            typeable_barcode,
                            phoneNumber: mobilePhone.number,
                            template: message.tres_dias_antes_do_vencimento_do_boleto.templateName,
                        })
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.error(
                            `Erro de Axios ao buscar dados para o cliente ${customerId}:`,
                            error.response?.data || error.message,
                        )
                    } else {
                        console.error(`Erro inesperado ao buscar dados para o cliente ${customerId}:`, error)
                    }
                }
            }

            processedRecords += charges.length
            page += 1
        } while (processedRecords < totalRecords)

        return filteredCustomers
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Erro de Axios:', error.response?.data || error.message)
        } else {
            console.error('Erro inesperado:', error)
        }
        throw error
    }
}
