import { Context } from '../../concretions';
import { User, Account, Summoner, OngoingMatch, ServerIdentity } from '../../model';
import { BotError, ErrorCode } from '../BotError';

export class CommandUtils{
    public async getSummoner(context: Context, summonerName?: string): Promise<Summoner>{
        if(summonerName)
            return await context.summonerFetcher.getSummoner(summonerName);
        const user: User = context.message.getAuthor();
        const account: Account = await context.database.getAccount(user);
        return account.summoner;
    }

    public async getOngoingMatches(context: Context, matchIndex?: number): Promise<OngoingMatch[]>{
        const serverIdentity: ServerIdentity = context.server.getIdentity();
        if(matchIndex)
            return [ await context.database.getOngoingMatch(serverIdentity, matchIndex) ];
        else
            return await context.database.getOngoingMatches(serverIdentity);
    }

    public validateOptionsLength(options: string[], admissibleLengths: number[]): void {
        if(!admissibleLengths.includes(options.length))
            throw new BotError(ErrorCode.COMMAND_ARGUMENT_COUNT);
    }
}