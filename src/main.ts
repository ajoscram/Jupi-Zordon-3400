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