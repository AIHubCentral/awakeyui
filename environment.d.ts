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
            LOGGING_MAX_FILES: string;

            // misc
            COMMAND_COOLDOWN: string;

            // find command
            FIND_LIMIT: string;
        }
    }
    function client(): void;
    function logger(): void;
}



export {}