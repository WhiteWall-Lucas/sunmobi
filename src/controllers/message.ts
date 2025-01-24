import { Router } from 'express'
import blipMessage from '../utils/blipMessages'
import { message } from '../config.json'
import phoneFormatter from '../utils/phoneFormatter'

export default Router()
    .post('/send', async (req, res) => {
        await blipMessage(req.body)
        return res.sendStatus(200)
    })
    .post('/webhook', async (req, res) => {
        const { phoneNumber, template, variables } = req.body

        if (!phoneNumber || !template || !variables) {
            return
        }

        const phone = phoneFormatter(phoneNumber)

        const info = {
            identity: `${phone}@wa.gw.msging.net`,
            templateName: template,
            variables: variables,
            subBotId: '',
            flowId: '',
            stateId: '',
        }

        if (template === 'tres_dias_antes_do_vencimento_do_boleto_disparo') {
            info.subBotId = message.tres_dias_antes_do_vencimento_do_boleto.subBotId
            info.flowId = message.tres_dias_antes_do_vencimento_do_boleto.flowId
            info.stateId = message.tres_dias_antes_do_vencimento_do_boleto.stateId
        }
        if (template === 'tres_dias_depois_do_vencimento_do_boleto_disparo') {
            info.subBotId = message.tres_dias_depois_do_vencimento_do_boleto.subBotId
            info.flowId = message.tres_dias_depois_do_vencimento_do_boleto.flowId
            info.stateId = message.tres_dias_depois_do_vencimento_do_boleto.stateId
        }
        if (template === 'dia_da_emissao_da_fatura_disparo') {
            info.subBotId = message.dia_da_emissao_da_fatura.subBotId
            info.flowId = message.dia_da_emissao_da_fatura.flowId
            info.stateId = message.dia_da_emissao_da_fatura.stateId
        }

        if (!info.templateName) {
            return
        }

        await blipMessage(info)
        return res.sendStatus(200)
    })
