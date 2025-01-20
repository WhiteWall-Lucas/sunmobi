import { blip } from '../config.json'
import BlipClient from './blip'
import { HttpError } from './route/error'

const templateFound = async (templateName: string, templates: Array<any>) => {
    const regex = /(\{{)\d(\}})/g
    const output = []
    const templateFound = templates?.find((template) => template?.name === templateName)?.components

    if (templateFound?.some((template: any) => template?.format === 'IMAGE')) output.push('IMAGE')
    if (templateFound?.some((template: any) => template?.format === 'VIDEO')) output.push('VIDEO')
    if (templateFound?.some((template: any) => template?.format === 'DOCUMENT')) output.push('DOCUMENT')
    if (templateFound?.some((template: any) => template?.type === 'BODY')) {
        const text = templateFound.find((template: any) => template?.type === 'BODY').text

        if (text.match(regex)) text.match(regex).forEach(() => output.push('TEXT'))
    }

    return output
}

const TEMPLATES: any = {
    IMAGE: (var1: string) => ({
        type: 'header',
        parameters: [
            {
                image: {
                    link: var1,
                },
                type: 'image',
            },
        ],
    }),
    VIDEO: (var1: string) => ({
        type: 'header',
        parameters: [
            {
                video: {
                    link: var1,
                },
                type: 'video',
            },
        ],
    }),
    DOCUMENT: (var1: string) => ({
        type: 'header',
        parameters: [
            {
                document: {
                    link: var1,
                },
                type: 'document',
            },
        ],
    }),
    TEXT: (var1: string | Array<string>) => ({
        type: 'body',
        parameters:
            typeof var1 === 'string'
                ? [
                      {
                          text: var1,
                          type: 'text',
                      },
                  ]
                : var1.map((text: string) => ({ text, type: 'text' })),
    }),
}

const validaImageVideoOrDocument = (str: string) => {
    if (!str) return false

    const regexImage = /\.(?:jpg|gif|png|JPG|GIF|PNG)/
    const regexVideo = /\.(?:mp4|MP4)/
    const regexDocument = /\.(?:pdf|PDF)/

    return (
        regexImage.test(str) ||
        regexVideo.test(str) ||
        regexDocument.test(str) ||
        str.includes('https://docs.google.com/uc') ||
        str.includes('https://drive.google.com/') ||
        str.includes('https://docs.google.com/')
    )
}

export const formatComponents = async (templateName: string, vars: any, templates: any) => {
    let components = []
    const templatesFilter = await templateFound(templateName, templates)

    vars = vars.map((v: string) => v?.replace('amp;', '')).filter((v: any) => v)

    if (vars?.length > 0) {
        components = templatesFilter
            ?.map((template, _i) => {
                if (template !== 'TEXT') {
                    const varOther = vars.find((v: string) => validaImageVideoOrDocument(v))

                    return TEMPLATES[template](varOther)
                }

                if (template === 'TEXT') {
                    const varsText = vars.filter((v: string) => !validaImageVideoOrDocument(v))

                    return TEMPLATES[template](varsText)
                }
                return
            })
            ?.filter((t, index, array) => t && array.findIndex((t2) => t2.type === t.type) === index)
    }
    return components
}

export default async (body: any) => {
    const { identity, templateName, variables, subBotId, flowId, stateId }: any = body
    if (!identity || !templateName || !variables) {
        throw new HttpError(400, 'Parametros não informados')
    }

    const blipClient = new BlipClient(blip.roteador.accessKey, blip.roteador.contract)

    const templates = await blipClient.sendCommand({
        to: 'postmaster@wa.gw.msging.net',
        method: 'get',
        uri: '/message-templates',
    })

    const components: any = await formatComponents(templateName, variables, templates.data)

    const sendMessage = await blipClient.sendMessage({
        to: identity,
        type: 'application/json',
        content: {
            type: 'template',
            template: {
                language: {
                    code: 'pt_BR',
                    policy: 'deterministic',
                },
                name: templateName,
                components: components,
            },
        },
    })

    if (identity && subBotId && flowId && stateId && flowId) {
        await Promise.all([
            blipClient.sendCommand({
                to: 'postmaster@msging.net',
                method: 'set',
                uri: `/contexts/${identity}/Master-State`,
                type: 'text/plain',
                resource: `${subBotId}@msging.net`,
            }),
            blipClient.sendCommand({
                to: 'postmaster@msging.net',
                method: 'set',
                uri: `/contexts/${identity}/stateid@${flowId}`,
                type: 'text/plain',
                resource: `${stateId}`,
            }),
        ])
    }

    return sendMessage
}
