import cron from 'node-cron'
import axios from 'axios'
// import { fetchExpiredChargesLogic } from '../controller/expiredCharges'
// import { fetchExpiringChargesLogic } from '../controller/expiringCharges'
// import { fetchTodayChargesCustomers } from '../services/fetchTodayChargesCustomers'
import { getDateThreeDaysAgo } from '../utils/getDateThreeDaysAgo'
import { formatDateToDDMMYYYY } from '../utils/formatDateToDDMMYYYY'
import { getDateInThreeDays } from '../utils/getDateInThreeDays'
import type { FilteredCustomer } from '../controllers/types/FilteredCustomers'

const webhookUrl = 'https://disparos-boleto-api-node-k42o4.ondigitalocean.app/message/webhook'

export const initializeCrons = () => {
    cron.schedule('0 12 * * *', async () => {
        try {
            console.log('Executando cron para cobranças expiradas...')
            let expiredDate = getDateThreeDaysAgo()
            expiredDate = formatDateToDDMMYYYY(expiredDate)
            // const customers = await fetchExpiredChargesCustomers()
            const customers: FilteredCustomer[] = [
                {
                    name: 'Lucas',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5517991730681',
                    template: 'tres_dias_depois_do_vencimento_do_boleto_disparo',
                },
                {
                    name: 'Alexandra',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511991783907',
                    template: 'tres_dias_depois_do_vencimento_do_boleto_disparo',
                },
                {
                    name: 'Eloise',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511912384271',
                    template: 'tres_dias_depois_do_vencimento_do_boleto_disparo',
                },
                {
                    name: 'Felipe',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511981699221',
                    template: 'tres_dias_depois_do_vencimento_do_boleto_disparo',
                },
                {
                    name: 'Flávio',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511981475448',
                    template: 'tres_dias_depois_do_vencimento_do_boleto_disparo',
                },
                {
                    name: 'Nicholas',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511961844070',
                    template: 'tres_dias_depois_do_vencimento_do_boleto_disparo',
                },
                {
                    name: 'Beatriz',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511984284860',
                    template: 'tres_dias_depois_do_vencimento_do_boleto_disparo',
                },
                {
                    name: 'Andreza',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511982660633',
                    template: 'tres_dias_depois_do_vencimento_do_boleto_disparo',
                },
                {
                    name: 'Guilherme',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511995729819',
                    template: 'tres_dias_depois_do_vencimento_do_boleto_disparo',
                },
            ]
            for (const customer of customers) {
                const postBody = {
                    phoneNumber: customer.phoneNumber,
                    template: customer.template,
                    variables: [customer.name, expiredDate, customer.typeable_barcode, customer.token_transaction], // a última variável sempre deve ser o token da url do botão
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
            let expiringDate = getDateInThreeDays()
            expiringDate = formatDateToDDMMYYYY(expiringDate)
            // const customers = await fetchExpiringChargesCustomers()
            const customers: FilteredCustomer[] = [
                {
                    name: 'Lucas',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5517991730681',
                    template: 'tres_dias_antes_do_vencimento_do_boleto_disparo',
                },
                {
                    name: 'Alexandra',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511991783907',
                    template: 'tres_dias_antes_do_vencimento_do_boleto_disparo',
                },
                {
                    name: 'Eloise',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511912384271',
                    template: 'tres_dias_antes_do_vencimento_do_boleto_disparo',
                },
                {
                    name: 'Felipe',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511981699221',
                    template: 'tres_dias_antes_do_vencimento_do_boleto_disparo',
                },
                {
                    name: 'Flávio',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511981475448',
                    template: 'tres_dias_antes_do_vencimento_do_boleto_disparo',
                },
                {
                    name: 'Nicholas',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511961844070',
                    template: 'tres_dias_antes_do_vencimento_do_boleto_disparo',
                },
                {
                    name: 'Beatriz',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511984284860',
                    template: 'tres_dias_antes_do_vencimento_do_boleto_disparo',
                },
                {
                    name: 'Andreza',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511982660633',
                    template: 'tres_dias_antes_do_vencimento_do_boleto_disparo',
                },
                {
                    name: 'Guilherme',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511995729819',
                    template: 'tres_dias_antes_do_vencimento_do_boleto_disparo',
                },
            ]
            for (const customer of customers) {
                const postBody = {
                    phoneNumber: customer.phoneNumber,
                    template: customer.template,
                    variables: [customer.name, expiringDate, customer.typeable_barcode, customer.token_transaction], // a última variável sempre deve ser o token da url do botão
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
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5517991730681',
                    template: 'dia_da_emissao_da_fatura_disparo',
                },
                {
                    name: 'Alexandra',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511991783907',
                    template: 'dia_da_emissao_da_fatura_disparo',
                },
                {
                    name: 'Eloise',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511912384271',
                    template: 'dia_da_emissao_da_fatura_disparo',
                },
                {
                    name: 'Felipe',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511981699221',
                    template: 'dia_da_emissao_da_fatura_disparo',
                },
                {
                    name: 'Flávio',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511981475448',
                    template: 'dia_da_emissao_da_fatura_disparo',
                },
                {
                    name: 'Nicholas',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511961844070',
                    template: 'dia_da_emissao_da_fatura_disparo',
                },
                {
                    name: 'Beatriz',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511984284860',
                    template: 'dia_da_emissao_da_fatura_disparo',
                },
                {
                    name: 'Andreza',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511982660633',
                    template: 'dia_da_emissao_da_fatura_disparo',
                },
                {
                    name: 'Guilherme',
                    token_transaction: '6bce76938eb4efdf42334b38a5f0ebfc',
                    typeable_barcode: '34191099823492696293685334580009899770000139438',
                    phoneNumber: '5511995729819',
                    template: 'dia_da_emissao_da_fatura_disparo',
                },
            ]
            for (const customer of customers) {
                const postBody = {
                    phoneNumber: customer.phoneNumber,
                    template: customer.template,
                    variables: [customer.name, customer.typeable_barcode, customer.token_transaction], // a última variável sempre deve ser o token da url do botão],
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
