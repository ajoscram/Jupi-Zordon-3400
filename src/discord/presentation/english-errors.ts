export const errors: { [property: string]: string, UNKNOWN: string } = {
    UNKNOWN: "Sorry! An unknown error has occurred while processing your command.",
    COMMAND_ARGUMENT_COUNT: "Incorrect command argument count. Type !help or !h for help.",
    COMMAND_QUOTE_NOT_MATCHED: "You've left a quotation mark (\" or ') without it's closing pair. Make sure to add quotation marks **in pairs** enclosing the text you want.",
    INDEX_NOT_NUMBER: "The command expected a numeric index parameter and was not given one. Make sure you only type valid numbers for it.",
    USER_NOT_FOUND: "The Discord user was not found.",
    CHANNEL_NOT_FOUND: "The Discord channel was not found.",
    CHANNEL_IS_NOT_VOICE: "The Discord channel must be a voice channel only.",
    CHANNEL_IS_NOT_TEXT: "The Discord channel must be a text channel.",
    USER_NOT_IN_A_VOICE_CHANNEL: "The Discord user is not currently in a voice channel.",
    NOT_IN_A_SERVER: "The command given is only available on Discord server text channels.",
    ONGOING_MATCH_IS_NOT_CUSTOM: "Only ongoing custom matches may be recorded.",
    ONGOING_MATCH_IS_PRACTICE_TOOL: "Practice tool matches cannot be recorded. That's cheating!",
    ATTACHMENT_TOO_LARGE: "An attachment received exceeded the maximum allowed (1MB).",
    ATTACHMENT_NOT_JSON: "An attachment received was not a JSON file. Make sure every match is a valid JSON file.",
    UNSUCCESSFUL_REQUEST: "Oops! Something went wrong while requesting data and the command failed.",
    TYPE_ASSERTION_FAILED: "Oops! It seems some data requested during your command did not arrive as expected and the command failed.",
    MISSING_MATCH_DATA: "The match data was received incomplete. Please try again or report this issue.",
    UNKNOWN_CHAMPION_ID: "The operation failed because an unknown champion ID was received.",
    UNABLE_TO_MATCH_ONGOING_TO_COMPLETED_MATCH: "Failed to match a recorded match to it's corresponding completed match. If you're using the **keep** and attaching JSON files, ensure you are attaching the correct files.",
    DB_ERROR: "Internal database error.",
    ACCOUNT_NOT_FOUND: "That user has no registered accounts.",
    ACCOUNTS_NOT_FOUND: "Some Discord users could not be matched with their respective summoner names. Make sure everyone has linked their accounts and try again.",
    ACCOUNT_USER_IN_DB: "Failed to create the account because the Discord user is already linked to another LoL account.",
    ACCOUNT_SUMMONER_IN_DB: "Failed to create the account because the summoner name is already linked to another Discord account.",
    SUMMONER_STATS_NOT_FOUND: "The summoner specified has no recorded stats.",
    MAX_ONGOING_MATCHES: "The maximum amount of recorded ongoing matches has been reached. Please either keep or discard at least one of them and try again.",
    ONGOING_MATCH_INDEX_OUT_OF_RANGE: "The match index specified is out of range. Use the **!list** command to find the index for each match.",
    ONGOING_MATCH_IN_DB: "Failed to record the ongoing match because it has already been recorded.",
    NO_ONGOING_MATCHES_LEFT: "There are no recorded matches left to keep or delete.",
}