/*
    private createReply(teams: [Player[], Player[]]): string {
        let reply: string = "**Suggested teams**\nBlue: ";
        reply += this.getTeamString(teams[0]);
        reply += "\nRed: ";
        reply += this.getTeamString(teams[1]);
        return reply;
    }

    private getTeamString(team: Player[]): string{
        let teamString: string = '';
        team.forEach((player, index) => 
            teamString += '_' + player.summoner.name + '_' + (index === team.length-1 ? '' : ', ')
        );
        return teamString;
    }
*/

/*
private async waitForMatch(ongoingMatch: OngoingMatch, fetcher: Fetcher): Promise<CompletedMatch>{
        private static readonly AWAIT_MILLISECONDS = 30000;
        private static readonly MAX_LOOPS = 240;
    
        let match: CompletedMatch = null;
        let loops: number = RecordMatchCommand.MAX_LOOPS        
        const timerId: number = setInterval(
            async () => {
                match = await this.tryGetMatch(ongoingMatch, fetcher);
                loops--;
            },
            RecordMatchCommand.AWAIT_MILLISECONDS
        );

        while(loops > 0 && !match) { }
        clearInterval(timerId);
        if(!match)
            throw new BotError(`The bot was unable to retrieve match with ID: ${ongoingMatch.id}. Operation timed out :(`);
        return match;
    }

    private async tryGetMatch(ongoingMatch: OngoingMatch, fetcher: Fetcher): Promise<CompletedMatch>
    {
        try {
            return await fetcher.getCompletedMatch(ongoingMatch);
        }
        catch(error) {
            if (error instanceof BotError)
                return null;
        }
    }
*/