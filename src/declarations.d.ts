declare global {
    // biome-ignore lint/style/noNamespace: This is a global declaration
    namespace NodeJS {
        interface ProcessEnv {
            BOT_API_TOKEN: string
            BOT_CONTRACT: string
        }
    }
}

export type {}
