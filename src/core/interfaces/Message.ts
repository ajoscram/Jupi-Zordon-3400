import { ErrorCode } from '../concretions';
import { Channel, CompletedMatch, User, Account, SummonerOverallStats, Prediction, OngoingMatch, Attachment } from '../model'
import { Server } from '.';

export interface Message{
    getServer(): Server;
    getAuthor(): User;
    getChannel(): Channel;
    getContent(): string;
    getAttachments(): Attachment[];
    replyWithError(error: ErrorCode): Promise<void>;
    replyWithTeams(teams: [Account[], Account[]]): Promise<void>;
    replyWithSummonerStats(stats: SummonerOverallStats): Promise<void>;
    replyWithRecordedMatch(match: OngoingMatch, prediction: Prediction): Promise<void>;
    replyWithKeptMatches(matches: CompletedMatch[]): Promise<void>;
    replyWithRecordedMatches(matches: OngoingMatch[]): Promise<void>;
    replyWithDiscardedMatches(matches: OngoingMatch[]): Promise<void>;
    replyWithAccount(account: Account): Promise<void>;
    replyWithHelp(): Promise<void>;
}