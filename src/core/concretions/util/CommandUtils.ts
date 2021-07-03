import { Context } from '..';
import { User, Account, Summoner } from '../../model';

export class CommandUtils{
    public async getSummoner(context: Context, summonerName?: string): Promise<Summoner>{
        if(summonerName){
            return await context.summonerFetcher.getSummoner(summonerName);
        }
        else{
            const user: User = context.message.getInvoker();
            const player: Account = await context.database.getAccount(user);
            return player.summoner;
        }
    }

    public validateOptionsLength(options: string[], admissibleLengths: number[]){
        if(!admissibleLengths.includes(options.length))
            throw this.createValidateOptionsLengthError(options.length, admissibleLengths);
    }

    private createValidateOptionsLengthError(optionsLength: number, admissibleLengths: number[]): Error{
        let message: string = "Incorrect number of arguments passed in. Expected ";
        for(let i = 0; i < admissibleLengths.length; i++){
            if(i < admissibleLengths.length - 1 )
                message += admissibleLengths[i] + ", ";
            else
                message += "or " + admissibleLengths[i] + " argument(s). Got " + optionsLength + ".";
        }
        return new Error(message);
    }
}