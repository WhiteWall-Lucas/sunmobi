import cron from 'node-cron'
import axios from 'axios'
// import { fetchExpiredChargesLogic } from '../controller/expiredCharges'
// import { fetchExpiringChargesLogic } from '../controller/expiringCharges'
// import { fetchTodayChargesCustomers } from '../services/fetchTodayChargesCustomers'
import { getDateThreeDaysAgo } from '../utils/getDateThreeDaysAgo'
import { formatDateToDDMMYYYY } from '../utils/formatDateToDDMMYYYY'
import { getDateInThreeDays } from '../utils/getDateInThreeDays'

const webhookUrl = 'https://disparos-boleto-api-node-k42o4.ondigitalocean.app/message/webhook'

export const initializeCrons = () => {
    cron.schedule('0 11 * * *', async () => {
        try {
            console.log('Executando cron para cobranças expiradas...')
            let expiredDate = getDateThreeDaysAgo()
            expiredDate = formatDateToDDMMYYYY(expiredDate)
            // const customers = await fetchExpiredChargesCustomers()
            const customers = [
                {
                    name: 'Lucas',
                    phoneNumber: '5517991730681',
                    template: 'tres_dias_depois_do_vencimento_do_boleto',
                },
            ]
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

    cron.schedule('0 11 * * *', async () => {
        try {
            console.log('Executando cron para cobranças próximas do vencimento...')
            let expiringDate = getDateInThreeDays()
            expiringDate = formatDateToDDMMYYYY(expiringDate)
            // const customers = await fetchExpiringChargesCustomers()
            const customers = [
                {
                    name: 'Lucas',
                    phoneNumber: '5517991730681',
                    template: 'tres_dias_antes_do_vencimento_do_boleto',
                },
            ]
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

    cron.schedule('0 11 * * *', async () => {
        try {
            console.log('Executando cron para emissão de faturas do dia...')
            // const customers = await fetchTodayChargesCustomers()
            const customers = [
                {
                    name: 'Lucas',
                    phoneNumber: '5517991730681',
                    template: 'dia_da_emissao_da_fatura',
                },
            ]
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
