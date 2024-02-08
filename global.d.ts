

declare namespace NodeJS {
    interface ProcessEnv { 
        hashKey : string
        clientSecret : string
        clientId : string
        redirectUri : string
    }
}