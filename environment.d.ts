declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // development
            DEV: 'true' | 'false';
            ANTI_CRASH: 'true' | 'false';

            // bot stuff
            TOKEN: string;
            APPLICATION_ID: string;
            BOT_STATUS: string;
            BOT_STATUS_TYPE: string;
            PREFIX: string;
            BOT_OWNER: string;

            // logging
            LOGGING_LEVEL: 'debug' | 'info' | 'warn' | 'error' | 'off';

            // @ts-ignore
            // TS doesn't like numbers in env vars
            LOGGING_MAX_FILES: number;

            // misc
            COMMAND_COOLDOWN: string;
        }
    }
    function client(): void;
    function logger(): void;
}



export {}