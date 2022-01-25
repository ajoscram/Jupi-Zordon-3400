import { Context } from '..';
import { User, Account, Summoner, OngoingMatch, ServerIdentity } from '../../model';
import { BotError, ErrorCode } from '..';

export abstract class CommandUtils{
    public static async getSummoner(context: Context, summonerName?: string): Promise<Summoner>{
        if(summonerName)
            return await context.summonerFetcher.getSummoner(summonerName);
        const user: User = context.message.getAuthor();
        const account: Account = await context.database.getAccount(user);
        return account.summoner;
    }

    public static async getOngoingMatches(context: Context, matchIndex?: number): Promise<OngoingMatch[]>{
        const serverIdentity: ServerIdentity = context.server.getIdentity();
        if(matchIndex || matchIndex === 0)
            return [ await context.database.getOngoingMatch(serverIdentity, matchIndex) ];
        else
            return await context.database.getOngoingMatches(serverIdentity);
    }

    public static validateOptionsLength(options: string[], admissibleLengths: number[]): void {
        if(!admissibleLengths.includes(options.length))
            throw new BotError(ErrorCode.COMMAND_ARGUMENT_COUNT);
    }

    public static parseIndex(index: string): number{
        const result: number = Number.parseInt(index);
        if(!result && result !== 0)
            throw new BotError(ErrorCode.INDEX_NOT_NUMBER);
        else
            return result;
    }
}