import { randomId } from './random'
import { blip } from '../config.json'

type Command = {
    id?: string
    method: string
    from?: string
    to?: string
    uri: string
    resource?: any
    type?: string
    pp?: string
}

type Message = {
    id?: string
    to: string
    type?: string
    content?: any
}

export default class BlipClient {
    public readonly delegation: BlipClient

    constructor(
        public readonly token: string,
        private readonly contract: string,
        delegation: BlipClient | undefined = undefined,
    ) {
        this.delegation = delegation ?? this
    }

    public async getContact(contactIdentity: string): Promise<any> {
        const contact = await this.delegation.sendCommand({
            method: 'get',
            uri: `/contacts/${contactIdentity}`,
        })
        return contact
    }

    public async getContext(contactIdentity: string, key: string): Promise<string | undefined> {
        return await this.delegation.sendCommand({
            method: 'get',
            uri: `/contexts/${contactIdentity}/${key}`,
        })
    }

    public async getContexts(contactIdentity: string): Promise<string[]> {
        const resource = await this.delegation.sendCommand({
            method: 'get',
            uri: `/contexts/${contactIdentity}?$take=1000`,
        })
        return resource?.items ?? []
    }

    public async setContext(contactIdentity: string, key: string, value: string) {
        await this.delegation.sendCommand({
            method: 'set',
            uri: `/contexts/${contactIdentity}/${key}`,
            type: 'text/plain',
            resource: value,
        })
    }

    public async deleteContext(contactIdentity: string, key: string) {
        await this.delegation.sendCommand({
            method: 'delete',
            uri: `/contexts/${contactIdentity}/${key}`,
        })
    }

    public trackEvent(contactIdentity: string, category: string, action: string, extras: any = {}): Promise<void> {
        this.delegation.sendCommand({
            method: 'set',
            to: 'postmaster@analytics.msging.net',
            uri: '/event-track',
            type: 'application/vnd.iris.eventTrack+json',
            resource: {
                category,
                action,
                contact: {
                    identity: contactIdentity,
                },
                ...extras,
            },
        })
        return Promise.resolve()
    }

    public async sendCommand(command: Command): Promise<any | undefined> {
        command.id ??= randomId()

        console.log('Sending Blip command ', JSON.stringify(command), ' to ', this.contract, ' with token ', this.token)

        const response = await fetch(`https://${this.contract}.http.msging.net/commands`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Key ${this.token}`,
            },
            body: JSON.stringify(command),
        })
        const result = await response.json()

        if (result.status === 'failure') {
            throw new Error(`Blip command failed: ${JSON.stringify(result.reason)}`)
        }

        return result?.resource
    }

    public async sendMessage(message: Message): Promise<any | undefined> {
        message.id ??= randomId()

        console.log('Sending Blip message ', JSON.stringify(message), ' to ', this.contract, ' with token ', this.token)

        const response = await fetch(`https://${this.contract}.http.msging.net/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Key ${this.token}`,
            },
            body: JSON.stringify(message),
        })

        if (response.status !== 202) {
            const result = await response.json()
            throw new Error(`Blip message failed: ${JSON.stringify(result.reason)}`)
        }

        return 'Enviado'
    }

    static for(botIdentifier: string) {
        if (!(botIdentifier in blip)) {
            throw new Error(`Bot ${botIdentifier} not found in config.json`)
        }

        const bot = blip[botIdentifier as keyof typeof blip]
        const client = BlipClient.login(botIdentifier, bot.accessKey, bot.contract)

        if (bot.delegation) {
            if (!(bot.delegation in blip)) {
                throw new Error(`Bot ${bot.delegation} not found in config.json`)
            }

            console.log(`Delegating Blip commands to ${bot.delegation}`)

            const delegation = BlipClient.login(
                bot.delegation,
                blip[bot.delegation as keyof typeof blip].accessKey,
                bot.contract,
            )
            return new BlipClient(client.token, bot.contract, delegation)
        }

        return client
    }

    static login(botIdentityOrIdentifier: string, accessKey: string, contract: string): BlipClient {
        const botIdentity = botIdentityOrIdentifier.endsWith('@msging.net')
            ? botIdentityOrIdentifier
            : `${botIdentityOrIdentifier}@msging.net`
        const token = Buffer.from(`${botIdentity}:${Buffer.from(accessKey, 'base64').toString()}`).toString('base64')
        return new BlipClient(token, contract)
    }
}
