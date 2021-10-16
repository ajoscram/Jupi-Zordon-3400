import "jasmine";
import { DummyModelFactory } from "../../utils";
import { StringPresenter } from "../../../src/discord/presentation";
import { ErrorCode } from "../../../src/core/concretions";
import { Account, CompletedMatch, Prediction, SummonerOverallStats } from "../../../src/core/model";

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

    it('createReplyFromPrediction(): should return a table with the prediction', async () => {
        const prediction: Prediction = factory.createPrediction();
        const reply: string = presenter.createReplyFromPrediction(prediction);
        expect(reply).toContain(expectedPredictionString);
    });

    it('createReplyFromCompletedMatch(): should return a table with the completed match', async () => {
        const match: CompletedMatch = factory.createCompletedMatch();
        const reply: string = presenter.createReplyFromCompletedMatch(match);
        expect(reply).toContain(expectedCompletedMatchString);
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
╔══════ Team 1 ══════╦══════ Team 2 ══════╗
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

const expectedPredictionString: string = `
╔══════════════ Blue Team ══════════════╦══════════════ Red Team ═══════════════╗
║   summoner name 4 (champion name 6)   ║  summoner name 29 (champion name 31)  ║
║  summoner name 9 (champion name 11)   ║  summoner name 34 (champion name 36)  ║
║  summoner name 14 (champion name 16)  ║  summoner name 39 (champion name 41)  ║
║  summoner name 19 (champion name 21)  ║  summoner name 44 (champion name 46)  ║
║  summoner name 24 (champion name 26)  ║  summoner name 49 (champion name 51)  ║
╠════════════════ Win % ════════════════╬════════════════ Win % ════════════════╣
║                 5.30k                 ║                 5.40k                 ║
╚═══════════════════════════════════════╩═══════════════════════════════════════╝`;

const expectedCompletedMatchString: string = `
╔══════════════════════════ Wed Dec 31 1969 - 231 minutes ══════════════════════════╗
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
║                                    Blue - LOST                                    ║
╠═════ Summoner ══════╦═════ Champion ══════╦═════ KDA ═════╦═ Damage ═╦═ CS / Min ═╣
║  summoner name 137  ║  champion name 139  ║  149/144/143  ║   145    ║    0.99    ║
║  summoner name 156  ║  champion name 158  ║  168/163/162  ║   164    ║    0.99    ║
║  summoner name 175  ║  champion name 177  ║  187/182/181  ║   183    ║    0.99    ║
║  summoner name 194  ║  champion name 196  ║  206/201/200  ║   202    ║    1.00    ║
║  summoner name 213  ║  champion name 215  ║  225/220/219  ║   221    ║    1.00    ║
╠═════════════════════╩═════════════════════╩═══════════════╩══════════╩════════════╣
║                 Dragons: 117 Heralds: 118 Towers: 120 Barons: 119                 ║
╚═══════════════════════════════════════════════════════════════════════════════════╝`;

const expectedAccountString: string = "Linked Discord account **user name 1** with LoL account **summoner name 3**.";

const expectedHelpString: string = "Visit this link for the list of available commands: https://github.com/ajoscram/Jupi-Zordon-3400/wiki/Commands";