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

    it('createReplyFromDeletedMatches(): should return a table with the deleted ongoing match if only one match is passed in', async () => {
        const match: OngoingMatch = factory.createOngoingMatch();
        const reply: string = presenter.createReplyFromDiscardedMatches([ match ]);
        expect(reply).toContain(expectedDeletedMatchString);
    });

    it('createReplyFromDeletedMatches(): should return a list of deleted ongoing matches if multiple matches are passed in', async () => {
        const matches: OngoingMatch[] = [
            factory.createOngoingMatch(),
            factory.createOngoingMatch(),
            factory.createOngoingMatch(),
            factory.createOngoingMatch()
        ];
        const reply: string = presenter.createReplyFromDiscardedMatches(matches);
        expect(reply).toContain(expectedDeletedMatchesString);
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
║                                         ║
║                   Red                   ║
╠═════ Summoner ═════╦═════ Champion ═════╣
║  summoner name 30  ║  champion name 32  ║
║  summoner name 35  ║  champion name 37  ║
║  summoner name 40  ║  champion name 42  ║
║  summoner name 45  ║  champion name 47  ║
║  summoner name 50  ║  champion name 52  ║
╠════════════════════╩════════════════════╣
║            55% chance to win            ║
╠═════════════════════════════════════════╣
║                                         ║
║                  Blue                   ║
╠═════ Summoner ═════╦═════ Champion ═════╣
║  summoner name 5   ║  champion name 7   ║
║  summoner name 10  ║  champion name 12  ║
║  summoner name 15  ║  champion name 17  ║
║  summoner name 20  ║  champion name 22  ║
║  summoner name 25  ║  champion name 27  ║
╠════════════════════╩════════════════════╣
║            55% chance to win            ║
╚═════════════════════════════════════════╝`;

const expectedRecordedMatchesString: string = `
╔═════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                Recorded Matches                                                 ║
╠═ # ═╦═ Teams ═╦═════════════════════════════════════════════ Picks ═════════════════════════════════════════════╣
║  0  ║  Blue   ║     champion name 7, champion name 12, champion name 17, champion name 22, champion name 27     ║
║     ║   Red   ║    champion name 32, champion name 37, champion name 42, champion name 47, champion name 52     ║
╠═════╬═════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  1  ║  Blue   ║    champion name 61, champion name 66, champion name 71, champion name 76, champion name 81     ║
║     ║   Red   ║   champion name 86, champion name 91, champion name 96, champion name 101, champion name 106    ║
╠═════╬═════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  2  ║  Blue   ║  champion name 115, champion name 120, champion name 125, champion name 130, champion name 135  ║
║     ║   Red   ║  champion name 140, champion name 145, champion name 150, champion name 155, champion name 160  ║
╠═════╬═════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  3  ║  Blue   ║  champion name 169, champion name 174, champion name 179, champion name 184, champion name 189  ║
║     ║   Red   ║  champion name 194, champion name 199, champion name 204, champion name 209, champion name 214  ║
╚═════╩═════════╩═════════════════════════════════════════════════════════════════════════════════════════════════╝`;

const expectedKeptMatchString: string = `
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
║  Wed Dec 31 1969  ║  Blue (W)  ║  champion name 372, champion name 391, champion name 410, champion name 429, champion name 448  ║
║     464 mins      ║    Red     ║  champion name 258, champion name 277, champion name 296, champion name 315, champion name 334  ║
╠═══════════════════╬════════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  Wed Dec 31 1969  ║  Blue (W)  ║  champion name 605, champion name 624, champion name 643, champion name 662, champion name 681  ║
║     697 mins      ║    Red     ║  champion name 491, champion name 510, champion name 529, champion name 548, champion name 567  ║
╠═══════════════════╬════════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  Wed Dec 31 1969  ║  Blue (W)  ║  champion name 838, champion name 857, champion name 876, champion name 895, champion name 914  ║
║     930 mins      ║    Red     ║  champion name 724, champion name 743, champion name 762, champion name 781, champion name 800  ║
╚═══════════════════╩════════════╩═════════════════════════════════════════════════════════════════════════════════════════════════╝`;

const expectedDeletedMatchString: string = `
║                                         ║
║                   Red                   ║
╠═════ Summoner ═════╦═════ Champion ═════╣
║  summoner name 30  ║  champion name 32  ║
║  summoner name 35  ║  champion name 37  ║
║  summoner name 40  ║  champion name 42  ║
║  summoner name 45  ║  champion name 47  ║
║  summoner name 50  ║  champion name 52  ║
╠════════════════════╩════════════════════╣
║                                         ║
║                  Blue                   ║
╠═════ Summoner ═════╦═════ Champion ═════╣
║  summoner name 5   ║  champion name 7   ║
║  summoner name 10  ║  champion name 12  ║
║  summoner name 15  ║  champion name 17  ║
║  summoner name 20  ║  champion name 22  ║
║  summoner name 25  ║  champion name 27  ║
╚════════════════════╩════════════════════╝`;

const expectedDeletedMatchesString: string = `
╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                           New Matches Discarded                                           ║
╠═ Teams ═╦═════════════════════════════════════════════ Picks ═════════════════════════════════════════════╣
║  Blue   ║     champion name 7, champion name 12, champion name 17, champion name 22, champion name 27     ║
║   Red   ║    champion name 32, champion name 37, champion name 42, champion name 47, champion name 52     ║
╠═════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  Blue   ║    champion name 61, champion name 66, champion name 71, champion name 76, champion name 81     ║
║   Red   ║   champion name 86, champion name 91, champion name 96, champion name 101, champion name 106    ║
╠═════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  Blue   ║  champion name 115, champion name 120, champion name 125, champion name 130, champion name 135  ║
║   Red   ║  champion name 140, champion name 145, champion name 150, champion name 155, champion name 160  ║
╠═════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  Blue   ║  champion name 169, champion name 174, champion name 179, champion name 184, champion name 189  ║
║   Red   ║  champion name 194, champion name 199, champion name 204, champion name 209, champion name 214  ║
╚═════════╩═════════════════════════════════════════════════════════════════════════════════════════════════╝`;

const expectedAccountString: string = "Linked Discord account **user name 1** with LoL account **summoner name 3**.";

const expectedHelpString: string = "Visit this link for the list of available commands: https://github.com/ajoscram/Jupi-Zordon-3400/wiki/Commands";