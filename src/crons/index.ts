import cron from 'node-cron'
import axios from 'axios'
import { message } from '../config.json'
import { fetchExpiredChargesLogic } from '../controllers/expiredCharges'
import { fetchExpiringChargesLogic } from '../controllers/expiringCharges'
import { fetchTodayChargesLogic } from '../controllers/todayCharges'

const webhookUrl = 'https://disparos-boleto-api-node-k42o4.ondigitalocean.app/message/webhook'
// const webhookUrl = 'http://localhost:8080/message/webhook'

export const initializeCrons = () => {
    cron.schedule('0 13 * * *', async () => {
        try {
            console.log('Executando cron para cobranças expiradas...')

            const customers = await fetchExpiredChargesLogic()

            for (const customer of customers) {
                // dispara template da mensagem de vencimento
                let postBody = {
                    phoneNumber: customer.phoneNumber,
                    template: customer.template,
                    variables: [customer.name, customer.due_at, customer.amount, customer.token_transaction], // a última variável sempre deve ser o token da url do botão
                }

                await axios.post(webhookUrl, postBody, {
                    headers: { 'Content-Type': 'application/json' },
                })

                // dispara mensagem contendo código do boleto
                postBody = {
                    phoneNumber: customer.phoneNumber,
                    template: message.codigo_boleto_sun_mobi.templateName,
                    variables: [customer.typeable_barcode],
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

    cron.schedule('0 13 * * *', async () => {
        try {
            console.log('Executando cron para cobranças próximas do vencimento...')

            const customers = await fetchExpiringChargesLogic()

            for (const customer of customers) {
                let postBody = {
                    phoneNumber: customer.phoneNumber,
                    template: customer.template,
                    variables: [customer.name, customer.due_at, customer.amount, customer.token_transaction], // a última variável sempre deve ser o token da url do botão
                }

                await axios.post(webhookUrl, postBody, {
                    headers: { 'Content-Type': 'application/json' },
                })

                // dispara mensagem contendo código do boleto
                postBody = {
                    phoneNumber: customer.phoneNumber,
                    template: message.codigo_boleto_sun_mobi.templateName,
                    variables: [customer.typeable_barcode],
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

    cron.schedule('0 13 * * *', async () => {
        try {
            console.log('Executando cron para emissão de faturas do dia...')

            const customers = await fetchTodayChargesLogic()

            for (const customer of customers) {
                let postBody = {
                    phoneNumber: customer.phoneNumber,
                    template: customer.template,
                    variables: [customer.name, customer.amount, customer.due_at, customer.token_transaction], // a última variável sempre deve ser o token da url do botão],
                }

                await axios.post(webhookUrl, postBody, {
                    headers: { 'Content-Type': 'application/json' },
                })

                // dispara mensagem contendo código do boleto
                postBody = {
                    phoneNumber: customer.phoneNumber,
                    template: message.codigo_boleto_sun_mobi.templateName,
                    variables: [customer.typeable_barcode],
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
