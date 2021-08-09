import { ErrorCode } from '../concretions';
import { Channel, CompletedMatch, User, Account, SummonerOverallStats, Prediction } from '../model'
import { Server } from '.';

export interface Message{
    getServer(): Server;
    getAuthor(): User;
    getChannel(): Channel;
    getContent(): string;
    replyWithError(error: ErrorCode): Promise<void>;
    replyWithTeams(teams: [Account[], Account[]]): Promise<void>;
    replyWithSummonerStats(stats: SummonerOverallStats): Promise<void>;
    replyWithPrediction(prediction: Prediction): Promise<void>;
    replyWithCompletedMatch(match: CompletedMatch): Promise<void>;
    replyWithAccount(account: Account): Promise<void>;
    replyWithHelp(): Promise<void>;
}