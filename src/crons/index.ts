import cron from 'node-cron'
import axios from 'axios'
// import { fetchExpiredChargesLogic } from '../controller/expiredCharges'
// import { fetchExpiringChargesLogic } from '../controller/expiringCharges'
// import { fetchTodayChargesCustomers } from '../services/fetchTodayChargesCustomers'
import type { FilteredCustomer } from '../controllers/types/FilteredCustomers'
import { message } from '../config.json'

const webhookUrl = 'https://disparos-boleto-api-node-k42o4.ondigitalocean.app/message/webhook'
// const webhookUrl = 'http://localhost:8080/message/webhook'

export const initializeCrons = () => {
    cron.schedule('0 12 * * *', async () => {
        try {
            console.log('Executando cron para cobranças expiradas...')
            // const customers = await fetchExpiredChargesCustomers()
            const customers: FilteredCustomer[] = [
                {
                    name: 'Lucas',
                    amount: 'R$1250,91', // TO DO: formatar dado vindo da API
                    due_at: '24/01/2025', // TO DO: formatar dado vindo da API
                    token_transaction: '433e2b0dc07b0daa17ee533972438b6e',
                    typeable_barcode: '34191090655567076293385334580009799710000125091',
                    phoneNumber: '5517991730681',
                    template: 'tres_dias_depois_vencimento_disparo',
                },
                // {
                //     name: 'Alexandra',
                //     amount: 'R$1250,91',
                //     due_at: '24/01/2025',
                //     token_transaction: '433e2b0dc07b0daa17ee533972438b6e',
                //     typeable_barcode: '34191090655567076293385334580009799710000125091',
                //     phoneNumber: '5511991783907',
                //     template: 'tres_dias_depois_vencimento_disparo',
                // },
                // {
                //     name: 'Eloise',
                //     amount: 'R$1250,91',
                //     due_at: '24/01/2025',
                //     token_transaction: '433e2b0dc07b0daa17ee533972438b6e',
                //     typeable_barcode: '34191090655567076293385334580009799710000125091',
                //     phoneNumber: '5511912384271',
                //     template: 'tres_dias_depois_vencimento_disparo',
                // },
                // {
                //     name: 'Felipe',
                //     amount: 'R$1250,91',
                //     due_at: '24/01/2025',
                //     token_transaction: '433e2b0dc07b0daa17ee533972438b6e',
                //     typeable_barcode: '34191090655567076293385334580009799710000125091',
                //     phoneNumber: '5511981699221',
                //     template: 'tres_dias_depois_vencimento_disparo',
                // },
                // {
                //     name: 'Flávio',
                //     amount: 'R$1250,91',
                //     due_at: '24/01/2025',
                //     token_transaction: '433e2b0dc07b0daa17ee533972438b6e',
                //     typeable_barcode: '34191090655567076293385334580009799710000125091',
                //     phoneNumber: '5511981475448',
                //     template: 'tres_dias_depois_vencimento_disparo',
                // },
                // {
                //     name: 'Nicholas',
                //     amount: 'R$1250,91',
                //     due_at: '24/01/2025',
                //     token_transaction: '433e2b0dc07b0daa17ee533972438b6e',
                //     typeable_barcode: '34191090655567076293385334580009799710000125091',
                //     phoneNumber: '5511961844070',
                //     template: 'tres_dias_depois_vencimento_disparo',
                // },
                // {
                //     name: 'Beatriz',
                //     amount: 'R$1250,91',
                //     due_at: '24/01/2025',
                //     token_transaction: '433e2b0dc07b0daa17ee533972438b6e',
                //     typeable_barcode: '34191090655567076293385334580009799710000125091',
                //     phoneNumber: '5511984284860',
                //     template: 'tres_dias_depois_vencimento_disparo',
                // },
                // {
                //     name: 'Andreza',
                //     amount: 'R$1250,91',
                //     due_at: '24/01/2025',
                //     token_transaction: '433e2b0dc07b0daa17ee533972438b6e',
                //     typeable_barcode: '34191090655567076293385334580009799710000125091',
                //     phoneNumber: '5511982660633',
                //     template: 'tres_dias_depois_vencimento_disparo',
                // },
                // {
                //     name: 'Guilherme',
                //     amount: 'R$1250,91',
                //     due_at: '24/01/2025',
                //     token_transaction: '433e2b0dc07b0daa17ee533972438b6e',
                //     typeable_barcode: '34191090655567076293385334580009799710000125091',
                //     phoneNumber: '5511995729819',
                //     template: 'tres_dias_depois_vencimento_disparo',
                // },
            ]
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

    cron.schedule('30 12 * * *', async () => {
        try {
            console.log('Executando cron para cobranças próximas do vencimento...')
            // const customers = await fetchExpiringChargesCustomers()
            const customers: FilteredCustomer[] = [
                {
                    name: 'Lucas',
                    amount: 'R$980,06',
                    due_at: '31/01/2025',
                    token_transaction: 'd02ca7b17ebddfd549926ecb83fa7a7e',
                    typeable_barcode: '34191091070108332293185334580009999780000098006',
                    phoneNumber: '5517991730681',
                    template: 'tres_dias_antes_vencimento_disparo',
                },
                // {
                //     name: 'Alexandra',
                //     amount: 'R$980,06',
                //     due_at: '31/01/2025',
                //     token_transaction: 'd02ca7b17ebddfd549926ecb83fa7a7e',
                //     typeable_barcode: '34191091070108332293185334580009999780000098006',
                //     phoneNumber: '5511991783907',
                //     template: 'tres_dias_antes_vencimento_disparo',
                // },
                // {
                //     name: 'Eloise',
                //     amount: 'R$980,06',
                //     due_at: '31/01/2025',
                //     token_transaction: 'd02ca7b17ebddfd549926ecb83fa7a7e',
                //     typeable_barcode: '34191091070108332293185334580009999780000098006',
                //     phoneNumber: '5511912384271',
                //     template: 'tres_dias_antes_vencimento_disparo',
                // },
                // {
                //     name: 'Felipe',
                //     amount: 'R$980,06',
                //     due_at: '31/01/2025',
                //     token_transaction: 'd02ca7b17ebddfd549926ecb83fa7a7e',
                //     typeable_barcode: '34191091070108332293185334580009999780000098006',
                //     phoneNumber: '5511981699221',
                //     template: 'tres_dias_antes_vencimento_disparo',
                // },
                // {
                //     name: 'Flávio',
                //     amount: 'R$980,06',
                //     due_at: '31/01/2025',
                //     token_transaction: 'd02ca7b17ebddfd549926ecb83fa7a7e',
                //     typeable_barcode: '34191091070108332293185334580009999780000098006',
                //     phoneNumber: '5511981475448',
                //     template: 'tres_dias_antes_vencimento_disparo',
                // },
                // {
                //     name: 'Nicholas',
                //     amount: 'R$980,06',
                //     due_at: '31/01/2025',
                //     token_transaction: 'd02ca7b17ebddfd549926ecb83fa7a7e',
                //     typeable_barcode: '34191091070108332293185334580009999780000098006',
                //     phoneNumber: '5511961844070',
                //     template: 'tres_dias_antes_vencimento_disparo',
                // },
                // {
                //     name: 'Beatriz',
                //     amount: 'R$980,06',
                //     due_at: '31/01/2025',
                //     token_transaction: 'd02ca7b17ebddfd549926ecb83fa7a7e',
                //     typeable_barcode: '34191091070108332293185334580009999780000098006',
                //     phoneNumber: '5511984284860',
                //     template: 'tres_dias_antes_vencimento_disparo',
                // },
                // {
                //     name: 'Andreza',
                //     amount: 'R$980,06',
                //     due_at: '31/01/2025',
                //     token_transaction: 'd02ca7b17ebddfd549926ecb83fa7a7e',
                //     typeable_barcode: '34191091070108332293185334580009999780000098006',
                //     phoneNumber: '5511982660633',
                //     template: 'tres_dias_antes_vencimento_disparo',
                // },
                // {
                //     name: 'Guilherme',
                //     amount: 'R$980,06',
                //     due_at: '31/01/2025',
                //     token_transaction: 'd02ca7b17ebddfd549926ecb83fa7a7e',
                //     typeable_barcode: '34191091070108332293185334580009999780000098006',
                //     phoneNumber: '5511995729819',
                //     template: 'tres_dias_antes_vencimento_disparo',
                // },
            ]
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
            // const customers = await fetchTodayChargesCustomers()
            const customers: FilteredCustomer[] = [
                {
                    name: 'Lucas',
                    amount: 'R$743,76',
                    due_at: '17/02/2025',
                    token_transaction: '15bf56842eafc1bedd9c6d50d3b9d0a3',
                    typeable_barcode: '34191091155978562293385334580009299950000074376',
                    phoneNumber: '5517991730681',
                    template: 'emissao_fatura_disparo',
                },
                // {
                //     name: 'Alexandra',
                //     amount: 'R$743,76',
                //     due_at: '17/02/2025',
                //     token_transaction: '15bf56842eafc1bedd9c6d50d3b9d0a3',
                //     typeable_barcode: '34191091155978562293385334580009299950000074376',
                //     phoneNumber: '5511991783907',
                //     template: 'emissao_fatura_disparo',
                // },
                // {
                //     name: 'Eloise',
                //     amount: 'R$743,76',
                //     due_at: '17/02/2025',
                //     token_transaction: '15bf56842eafc1bedd9c6d50d3b9d0a3',
                //     typeable_barcode: '34191091155978562293385334580009299950000074376',
                //     phoneNumber: '5511912384271',
                //     template: 'emissao_fatura_disparo',
                // },
                // {
                //     name: 'Felipe',
                //     amount: 'R$743,76',
                //     due_at: '17/02/2025',
                //     token_transaction: '15bf56842eafc1bedd9c6d50d3b9d0a3',
                //     typeable_barcode: '34191091155978562293385334580009299950000074376',
                //     phoneNumber: '5511981699221',
                //     template: 'emissao_fatura_disparo',
                // },
                // {
                //     name: 'Flávio',
                //     amount: 'R$743,76',
                //     due_at: '17/02/2025',
                //     token_transaction: '15bf56842eafc1bedd9c6d50d3b9d0a3',
                //     typeable_barcode: '34191091155978562293385334580009299950000074376',
                //     phoneNumber: '5511981475448',
                //     template: 'emissao_fatura_disparo',
                // },
                // {
                //     name: 'Nicholas',
                //     amount: 'R$743,76',
                //     due_at: '17/02/2025',
                //     token_transaction: '15bf56842eafc1bedd9c6d50d3b9d0a3',
                //     typeable_barcode: '34191091155978562293385334580009299950000074376',
                //     phoneNumber: '5511961844070',
                //     template: 'emissao_fatura_disparo',
                // },
                // {
                //     name: 'Beatriz',
                //     amount: 'R$743,76',
                //     due_at: '17/02/2025',
                //     token_transaction: '15bf56842eafc1bedd9c6d50d3b9d0a3',
                //     typeable_barcode: '34191091155978562293385334580009299950000074376',
                //     phoneNumber: '5511984284860',
                //     template: 'emissao_fatura_disparo',
                // },
                // {
                //     name: 'Andreza',
                //     amount: 'R$743,76',
                //     due_at: '17/02/2025',
                //     token_transaction: '15bf56842eafc1bedd9c6d50d3b9d0a3',
                //     typeable_barcode: '34191091155978562293385334580009299950000074376',
                //     phoneNumber: '5511982660633',
                //     template: 'emissao_fatura_disparo',
                // },
                // {
                //     name: 'Guilherme',
                //     amount: 'R$743,76',
                //     due_at: '17/02/2025',
                //     token_transaction: '15bf56842eafc1bedd9c6d50d3b9d0a3',
                //     typeable_barcode: '34191091155978562293385334580009299950000074376',
                //     phoneNumber: '5511995729819',
                //     template: 'emissao_fatura_disparo',
                // },
            ]
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
