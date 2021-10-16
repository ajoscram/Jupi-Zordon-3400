export const errors: { [property: string]: string, UNKNOWN: string } = {
    UNKNOWN: "Sorry! An unknown error has occurred while processing your command.",
    USER_NOT_FOUND: "The Discord user was not found.",
    CHANNEL_NOT_FOUND: "The Discord channel was not found.",
    CHANNEL_IS_NOT_VOICE: "The Discord channel must be a voice channel only.",
    CHANNEL_IS_NOT_TEXT: "The Discord channel must be a text channel.",
    USER_NOT_IN_A_VOICE_CHANNEL: "The Discord user is not currently in a voice channel.",
    NOT_IN_A_SERVER: "The command given is only available on Discord server text channels.",
    ACCOUNT_NOT_FOUND: "That user has no registered accounts.",
    DB_ERROR: "Internal database error."
}