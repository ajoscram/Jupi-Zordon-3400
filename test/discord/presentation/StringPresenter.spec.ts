import "jasmine";
import { DummyModelFactory } from "../../utils";
import { StringPresenter } from "../../../src/discord/presentation";
import { ErrorCode } from "../../../src/core/concretions";
import { Account, CompletedMatch, OngoingMatch, Prediction, SummonerOverallStats } from "../../../src/core/model";

describe('StringPresenter', () => {

    const presenter: StringPresenter = new StringPresenter();
    let factory: DummyModelFactory;

    beforeEach(() => {
        factory = new DummyModelFactory();
    });

    it('createReplyFromError(): should include a message for each ErrorCode', async () => {
        const code: ErrorCode = ErrorCode.ACCOUNT_NOT_FOUND; //arbitrarily chosen
        const reply: string = presenter.createReplyFromError(code);
        expect(reply).toContain("ERROR");
    });

    it('createReplyFromTeams(): should return a table with the teams', async () => {
        const teams: [ Account[], Account[] ] = [
            [ factory.createAccount(), factory.createAccount(), factory.createAccount(), ],
            [ factory.createAccount(), factory.createAccount(), factory.createAccount(), ]
        ];
        const reply: string = presenter.createReplyFromTeams(teams);
        expect(reply).toContain(expectedTeamsString);
    });

    it('createReplyFromSummonerStats(): should return a table with the stats', async () => {
        const stats: SummonerOverallStats = factory.createSummonerOverallStats();
        const reply: string = presenter.createReplyFromSummonerStats(stats);
        expect(reply).toContain(expectedSummonerStatsString);
    });

    it('createReplyFromRecordedMatch(): should return a table with the recorded match and its prediction', async () => {
        const match: OngoingMatch = factory.createOngoingMatch();
        const prediction: Prediction = factory.createPrediction();
        const reply: string = presenter.createReplyFromRecordedMatch(match, prediction);
        expect(reply).toContain(expectedRecordedMatchString);
    });

    it('createReplyFromRecordedMatches(): should return a list of recorded ongoing matches', async () => {
        const matches: OngoingMatch[] = [
            factory.createOngoingMatch(),
            factory.createOngoingMatch(),
            factory.createOngoingMatch(),
            factory.createOngoingMatch()
        ];
        const reply: string = presenter.createReplyFromRecordedMatches(matches);
        expect(reply).toContain(expectedRecordedMatchesString);
    });

    it('createReplyFromKeptMatches(): should return a table with the completed match if only one match is passed in', async () => {
        const match: CompletedMatch = factory.createCompletedMatch();
        const reply: string = presenter.createReplyFromKeptMatches([ match ]);
        expect(reply).toContain(expectedKeptMatchString);
    });

    it('createReplyFromKeptMatches(): should return a list of completed matches if multiple matches are passed in', async () => {
        const matches: CompletedMatch[] = [
            factory.createCompletedMatch(),
            factory.createCompletedMatch(),
            factory.createCompletedMatch(),
            factory.createCompletedMatch()
        ];
        const reply: string = presenter.createReplyFromKeptMatches(matches);
        expect(reply).toContain(expectedKeptMatchesString);
    });

    it('createReplyFromDiscardedMatches(): should return a table with the deleted ongoing match if only one match is passed in', async () => {
        const match: OngoingMatch = factory.createOngoingMatch();
        const reply: string = presenter.createReplyFromDiscardedMatches([ match ]);
        expect(reply).toContain(expectedDiscardedMatchString);
    });

    it('createReplyFromDiscardedMatches(): should return a list of deleted ongoing matches if multiple matches are passed in', async () => {
        const matches: OngoingMatch[] = [
            factory.createOngoingMatch(),
            factory.createOngoingMatch(),
            factory.createOngoingMatch(),
            factory.createOngoingMatch()
        ];
        const reply: string = presenter.createReplyFromDiscardedMatches(matches);
        expect(reply).toContain(expectedDiscardedMatchesString);
    });

    it('createReplyFromAccount(): should return a string with the account', async () => {
        const account: Account = factory.createAccount();
        const reply: string = presenter.createReplyFromAccount(account);
        expect(reply).toContain(expectedAccountString);
    });

    it('createReplyFromHelp(): should return a help string', async () => {
        const reply: string = presenter.createReplyFromHelp();
        expect(reply).toContain(expectedHelpString);
    });
});

const expectedTeamsString: string =`
╔═════════════════════════════════════════╗
║             Balanced Teams              ║
╠══════ Team 1 ══════╦══════ Team 2 ══════╣
║  summoner name 3   ║  summoner name 15  ║
║  summoner name 7   ║  summoner name 19  ║
║  summoner name 11  ║  summoner name 23  ║
╚════════════════════╩════════════════════╝`;

const expectedSummonerStatsString: string =`
╔════════════════════════ summoner name 1 ════════════════════════╗
║                                                                 ║
║                             General                             ║
╠═════ Matches ═════╦══════ Wins ═══════╦══ Losses ══╦═ Winrate ══╣
║        21         ║        10         ║     11     ║  47.62 %   ║
╠══════ Kills ══════╬═════ Deaths ══════╬═ Assists ══╬═══ KDA ════╣
║       0.86        ║       0.62        ║    0.57    ║    2.31    ║
╠═══════════════════╩═══════════════════╩════════════╩════════════╣
║                                                                 ║
║                           Most Played                           ║
╠═ champion name 7 ═╦═ champion name 3 ═╦════════════╦════════════╣
║         9         ║         5         ║            ║            ║
╠═══════════════════╩═══════════════════╩════════════╩════════════╣
║                                                                 ║
║                             Damage                              ║
╠════ Champions ════╦═══ Objectives ════╦═ Received ═╦═══ Rate ═══╣
║       0.67        ║       0.71        ║    0.76    ║    0.88    ║
╠═══════════════════╩═══════════════════╩════════════╩════════════╣
║                                                                 ║
║                             Income                              ║
╠══════ Gold ═══════╦═══ Gold / Min ════╦════ CS ════╦═ CS / Min ═╣
║       0.81        ║       0.85        ║    0.90    ║    0.95    ║
╠═══════════════════╩═══════════════════╩════════════╩════════════╣
║                                                                 ║
║                             Others                              ║
╠═════ Minutes ═════╦═════ Vision ══════╦════ CC ════╦══ Pentas ══╣
║       0.95        ║         1         ║    1.05    ║     23     ║
╚═══════════════════╩═══════════════════╩════════════╩════════════╝`;

const expectedRecordedMatchString: string = `
╔═════════════════════════════════════════╗
║           New Match Recorded            ║
╠════════════ Wed Dec 31 1969 ════════════╣
║                                         ║
║                   Red                   ║
╠═════ Summoner ═════╦═════ Champion ═════╣
║  summoner name 29  ║  champion name 31  ║
║  summoner name 34  ║  champion name 36  ║
║  summoner name 39  ║  champion name 41  ║
║  summoner name 44  ║  champion name 46  ║
║  summoner name 49  ║  champion name 51  ║
╠════════════════════╩════════════════════╣
║            54% chance to win            ║
╠═════════════════════════════════════════╣
║                                         ║
║                  Blue                   ║
╠═════ Summoner ═════╦═════ Champion ═════╣
║  summoner name 4   ║  champion name 6   ║
║  summoner name 9   ║  champion name 11  ║
║  summoner name 14  ║  champion name 16  ║
║  summoner name 19  ║  champion name 21  ║
║  summoner name 24  ║  champion name 26  ║
╠════════════════════╩════════════════════╣
║            54% chance to win            ║
╚═════════════════════════════════════════╝`;

const expectedRecordedMatchesString: string = `
╔═════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                Recorded Matches                                                 ║
╠═ # ═╦═ Teams ═╦═════════════════════════════════════════════ Picks ═════════════════════════════════════════════╣
║  0  ║  Blue   ║     champion name 6, champion name 11, champion name 16, champion name 21, champion name 26     ║
║     ║   Red   ║    champion name 31, champion name 36, champion name 41, champion name 46, champion name 51     ║
╠═════╬═════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  1  ║  Blue   ║    champion name 59, champion name 64, champion name 69, champion name 74, champion name 79     ║
║     ║   Red   ║    champion name 84, champion name 89, champion name 94, champion name 99, champion name 104    ║
╠═════╬═════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  2  ║  Blue   ║  champion name 112, champion name 117, champion name 122, champion name 127, champion name 132  ║
║     ║   Red   ║  champion name 137, champion name 142, champion name 147, champion name 152, champion name 157  ║
╠═════╬═════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  3  ║  Blue   ║  champion name 165, champion name 170, champion name 175, champion name 180, champion name 185  ║
║     ║   Red   ║  champion name 190, champion name 195, champion name 200, champion name 205, champion name 210  ║
╚═════╩═════════╩═════════════════════════════════════════════════════════════════════════════════════════════════╝`;

const expectedKeptMatchString: string = `
╔═══════════════════════════════════════════════════════════════════════════════════╗
║                                  New Match Kept                                   ║
╠══════════════════════════ Wed Dec 31 1969 - 231 minutes ══════════════════════════╣
║                                                                                   ║
║                                    Red - LOST                                     ║
╠═════ Summoner ══════╦═════ Champion ══════╦═════ KDA ═════╦═ Damage ═╦═ CS / Min ═╣
║  summoner name 23   ║  champion name 25   ║   35/30/29    ║    31    ║    0.97    ║
║  summoner name 42   ║  champion name 44   ║   54/49/48    ║    50    ║    0.98    ║
║  summoner name 61   ║  champion name 63   ║   73/68/67    ║    69    ║    0.99    ║
║  summoner name 80   ║  champion name 82   ║   92/87/86    ║    88    ║    0.99    ║
║  summoner name 99   ║  champion name 101  ║  111/106/105  ║   107    ║    0.99    ║
╠═════════════════════╩═════════════════════╩═══════════════╩══════════╩════════════╣
║                     Dragons: 3 Heralds: 4 Towers: 6 Barons: 5                     ║
╠═══════════════════════════════════════════════════════════════════════════════════╣
║                                                                                   ║
║                                    Blue - WON                                     ║
╠═════ Summoner ══════╦═════ Champion ══════╦═════ KDA ═════╦═ Damage ═╦═ CS / Min ═╣
║  summoner name 137  ║  champion name 139  ║  149/144/143  ║   145    ║    0.99    ║
║  summoner name 156  ║  champion name 158  ║  168/163/162  ║   164    ║    0.99    ║
║  summoner name 175  ║  champion name 177  ║  187/182/181  ║   183    ║    0.99    ║
║  summoner name 194  ║  champion name 196  ║  206/201/200  ║   202    ║    1.00    ║
║  summoner name 213  ║  champion name 215  ║  225/220/219  ║   221    ║    1.00    ║
╠═════════════════════╩═════════════════════╩═══════════════╩══════════╩════════════╣
║                 Dragons: 117 Heralds: 118 Towers: 120 Barons: 119                 ║
╚═══════════════════════════════════════════════════════════════════════════════════╝`;

const expectedKeptMatchesString: string = `
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                         New Matches Kept                                                         ║
╠═ Date & Duration ═╦══ Teams ═══╦═════════════════════════════════════════════ Picks ═════════════════════════════════════════════╣
║  Wed Dec 31 1969  ║  Blue (W)  ║  champion name 139, champion name 158, champion name 177, champion name 196, champion name 215  ║
║     231 mins      ║    Red     ║    champion name 25, champion name 44, champion name 63, champion name 82, champion name 101    ║
╠═══════════════════╬════════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  Wed Dec 31 1969  ║  Blue (W)  ║  champion name 371, champion name 390, champion name 409, champion name 428, champion name 447  ║
║     463 mins      ║    Red     ║  champion name 257, champion name 276, champion name 295, champion name 314, champion name 333  ║
╠═══════════════════╬════════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  Wed Dec 31 1969  ║  Blue (W)  ║  champion name 603, champion name 622, champion name 641, champion name 660, champion name 679  ║
║     695 mins      ║    Red     ║  champion name 489, champion name 508, champion name 527, champion name 546, champion name 565  ║
╠═══════════════════╬════════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  Wed Dec 31 1969  ║  Blue (W)  ║  champion name 835, champion name 854, champion name 873, champion name 892, champion name 911  ║
║     927 mins      ║    Red     ║  champion name 721, champion name 740, champion name 759, champion name 778, champion name 797  ║
╚═══════════════════╩════════════╩═════════════════════════════════════════════════════════════════════════════════════════════════╝`;

const expectedDiscardedMatchString: string = `
╔═════════════════════════════════════════╗
║           New Match Discarded           ║
╠════════════ Wed Dec 31 1969 ════════════╣
║                                         ║
║                   Red                   ║
╠═════ Summoner ═════╦═════ Champion ═════╣
║  summoner name 29  ║  champion name 31  ║
║  summoner name 34  ║  champion name 36  ║
║  summoner name 39  ║  champion name 41  ║
║  summoner name 44  ║  champion name 46  ║
║  summoner name 49  ║  champion name 51  ║
╠════════════════════╩════════════════════╣
║                                         ║
║                  Blue                   ║
╠═════ Summoner ═════╦═════ Champion ═════╣
║  summoner name 4   ║  champion name 6   ║
║  summoner name 9   ║  champion name 11  ║
║  summoner name 14  ║  champion name 16  ║
║  summoner name 19  ║  champion name 21  ║
║  summoner name 24  ║  champion name 26  ║
╚════════════════════╩════════════════════╝`;

const expectedDiscardedMatchesString: string = `
╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                           New Matches Discarded                                           ║
╠═ Teams ═╦═════════════════════════════════════════════ Picks ═════════════════════════════════════════════╣
║  Blue   ║     champion name 6, champion name 11, champion name 16, champion name 21, champion name 26     ║
║   Red   ║    champion name 31, champion name 36, champion name 41, champion name 46, champion name 51     ║
╠═════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  Blue   ║    champion name 59, champion name 64, champion name 69, champion name 74, champion name 79     ║
║   Red   ║    champion name 84, champion name 89, champion name 94, champion name 99, champion name 104    ║
╠═════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  Blue   ║  champion name 112, champion name 117, champion name 122, champion name 127, champion name 132  ║
║   Red   ║  champion name 137, champion name 142, champion name 147, champion name 152, champion name 157  ║
╠═════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  Blue   ║  champion name 165, champion name 170, champion name 175, champion name 180, champion name 185  ║
║   Red   ║  champion name 190, champion name 195, champion name 200, champion name 205, champion name 210  ║
╚═════════╩═════════════════════════════════════════════════════════════════════════════════════════════════╝`;

const expectedAccountString: string = "Linked Discord account **user name 1** with LoL account **summoner name 3**.";

const expectedHelpString: string = "Visit this link for the list of available commands: https://github.com/ajoscram/Jupi-Zordon-3400/wiki/Commands";