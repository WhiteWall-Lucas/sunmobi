import { Router } from 'express'
import type { Charge } from './types/Charge'
import api from '../api'
import type { FilteredCustomer } from './types/FilteredCustomers'
import type { Customer } from './types/Customer'
import { message } from '../config.json'
import axios from 'axios'
import { getTodayDate } from '../utils/getTodayDate'

export default Router().get('/', async (_req, res) => {
    try {
        const customers = await fetchTodayChargesLogic()
        res.status(200).json(customers)
    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
})

export const fetchTodayChargesLogic = async (): Promise<FilteredCustomer[]> => {
    const todayDate = getTodayDate()
    const perPage = 50
    let page = 1
    const filteredCustomers: FilteredCustomer[] = []

    try {
        let totalRecords = 0
        let processedRecords = 0

        do {
            const query = `per_page=${perPage}&page=${page}&query=created_at%3D${todayDate}`

            const response = await api.get<{ charges: Charge[] }>(`/charges?${query}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Basic NVdBUGpWYXlKR0Ftc1M0ZnlvMUhaZ3pLMkNnNGZiRXd5RFlHeWpEMnA3NDp1bmRlZmluZWQ=',
                },
            })

            totalRecords = Number(response.headers.total || 0)
            const charges = response.data.charges

            const customerIds = charges.map((charge) => charge.customer.id)

            for (const id of customerIds) {
                try {
                    const customerResponse = await api.get<{ customer: Customer }>(`/customers/${id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization:
                                'Basic NVdBUGpWYXlKR0Ftc1M0ZnlvMUhaZ3pLMkNnNGZiRXd5RFlHeWpEMnA3NDp1bmRlZmluZWQ=',
                        },
                    })

                    const customer = customerResponse.data.customer
                    const mobilePhone = customer.phones.find((phone) => phone.phone_type === 'mobile')

                    filteredCustomers.push({
                        name: customer.name,
                        phoneNumber: mobilePhone ? mobilePhone.number : null,
                        template: message.dia_da_emissao_da_fatura.templateName,
                    })
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.error(
                            `Erro de Axios ao buscar dados para o cliente ${id}:`,
                            error.response?.data || error.message,
                        )
                    } else {
                        console.error(`Erro inesperado ao buscar dados para o cliente ${id}:`, error)
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
