import cron from 'node-cron'
import axios from 'axios'
import { fetchExpiredChargesCustomers } from '../services/fetchExpiredChargesCustomers'
import { fetchExpiringChargesCustomers } from '../services/fetchExpiringChargesCustomers'
import { fetchTodayChargesCustomers } from '../services/fetchTodayChargesCustomers'
import { getDateThreeDaysAgo } from '../utils/getDateThreeDaysAgo'
import { formatDateToDDMMYYYY } from '../utils/formatDateToDDMMYYYY'
import { getDateInThreeDays } from '../utils/getDateInThreeDays'

const webhookUrl = 'http://localhost:4001/message/webhook'

export const initializeCrons = () => {
    cron.schedule('0 8 * * *', async () => {
        try {
            console.log('Executando cron para cobranças expiradas...')
            let expiredDate = getDateThreeDaysAgo()
            expiredDate = formatDateToDDMMYYYY(expiredDate)
            const customers = await fetchExpiredChargesCustomers()
            for (const customer of customers) {
                const postBody = {
                    phoneNumber: customer.phoneNumber,
                    template: customer.template,
                    variables: [customer.name, expiredDate],
                }

                await axios.post(webhookUrl, postBody, {
                    headers: { 'Content-Type': 'application/json' },
                })
                console.log(`Webhook enviado para: ${customer.phoneNumber}`)
            }
        } catch (error) {
            console.error('Erro no cron de cobranças expiradas:', error)
        }
    })

    cron.schedule('0 8 * * *', async () => {
        try {
            console.log('Executando cron para cobranças próximas do vencimento...')
            let expiringDate = getDateInThreeDays()
            expiringDate = formatDateToDDMMYYYY(expiringDate)
            const customers = await fetchExpiringChargesCustomers()
            for (const customer of customers) {
                const postBody = {
                    phoneNumber: customer.phoneNumber,
                    template: customer.template,
                    variables: [customer.name, expiringDate],
                }

                await axios.post(webhookUrl, postBody, {
                    headers: { 'Content-Type': 'application/json' },
                })
                console.log(`Webhook enviado para: ${customer.phoneNumber}`)
            }
        } catch (error) {
            console.error('Erro no cron de cobranças próximas do vencimento:', error)
        }
    })

    cron.schedule('* * * * *', async () => {
        try {
            console.log('Executando cron para emissão de faturas do dia...')
            const customers = await fetchTodayChargesCustomers()
            for (const customer of customers) {
                const postBody = {
                    phoneNumber: customer.phoneNumber,
                    template: customer.template,
                    variables: [customer.name],
                }

                await axios.post(webhookUrl, postBody, {
                    headers: { 'Content-Type': 'application/json' },
                })
                console.log(`Webhook enviado para: ${customer.phoneNumber}`)
            }
        } catch (error) {
            console.error('Erro no cron de emissão de faturas do dia:', error)
        }
    })
}