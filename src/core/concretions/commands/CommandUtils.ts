import { Context } from '../../concretions';
import { User, Account, Summoner } from '../../model';

export class CommandUtils{
    public async getSummoner(context: Context, summonerName?: string): Promise<Summoner>{
        if(summonerName){
            return await context.summonerFetcher.getSummoner(summonerName);
        }
        else{
            const user: User = context.message.getAuthor();
            const account: Account = await context.database.getAccount(user);
            return account.summoner;
        }
    }

    public validateOptionsLength(options: string[], admissibleLengths: number[]): void {
        if(!admissibleLengths.includes(options.length))
            throw this.createValidateOptionsLengthError(options.length, admissibleLengths);
    }

    private createValidateOptionsLengthError(optionsLength: number, admissibleLengths: number[]): Error{
        let message: string = "Incorrect number of arguments passed in. Expected ";
        for(let i = 0; i < admissibleLengths.length; i++){
            if(i < admissibleLengths.length - 1 )
                message += admissibleLengths[i] + ", ";
            else if( admissibleLengths.length > 1)
                message += "or " + admissibleLengths[i];
            else
                message += admissibleLengths[i];
        }
        message += " argument(s). Got " + optionsLength + ".";
        return new Error(message);
    }
}