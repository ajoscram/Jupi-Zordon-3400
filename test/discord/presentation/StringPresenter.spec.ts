import "jasmine";
import { DummyModelFactory } from "../../utils";
import { StringPresenter } from "../../../src/discord/presentation";
import { ErrorCode } from "../../../src/core/concretions";
import { Account, CompletedMatch, OngoingMatch, Prediction, SummonerOverallStats } from "../../../src/core/model";

describe('StringPresenter', () => {

    const tableRegex: RegExp = /[║═╣╠╦╩╬]/;
    const presenter: StringPresenter = new StringPresenter();
    let factory: DummyModelFactory;

    beforeEach(() => {
        factory = new DummyModelFactory();
    });

    it('createReplyFromError(): should include ERROR in its message', async () => {
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

    it('createReplyFromRecordedMatches(): should not return a table when no matches are given', async () => {
        const reply: string = presenter.createReplyFromRecordedMatches([]);
        expect(reply.match(tableRegex)).toBeNull();
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

    it('createReplyFromKeptMatches(): should not return a table when no matches are given', async () => {
        const reply: string = presenter.createReplyFromKeptMatches([]);
        expect(reply.match(tableRegex)).toBeNull();
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

    it('createReplyFromDiscardedMatches(): should not return a table when no matches are given', async () => {
        const reply: string = presenter.createReplyFromDiscardedMatches([]);
        expect(reply.match(tableRegex)).toBeNull();
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
╠════════════ Thu Jan 01 1970 ════════════╣
║                                         ║
║                   Red                   ║
╠═════ Summoner ═════╦═════ Champion ═════╣
║  summoner name 47  ║  champion name 49  ║
║  summoner name 52  ║  champion name 54  ║
║  summoner name 57  ║  champion name 59  ║
║  summoner name 62  ║  champion name 64  ║
║  summoner name 67  ║  champion name 69  ║
╠════════════════════╩════════════════════╣
║            72% chance to win            ║
╠═════════════════════════════════════════╣
║                                         ║
║                  Blue                   ║
╠═════ Summoner ═════╦═════ Champion ═════╣
║  summoner name 13  ║  champion name 15  ║
║  summoner name 18  ║  champion name 20  ║
║  summoner name 23  ║  champion name 25  ║
║  summoner name 28  ║  champion name 30  ║
║  summoner name 33  ║  champion name 35  ║
╠════════════════════╩════════════════════╣
║            72% chance to win            ║
╚═════════════════════════════════════════╝`;

const expectedRecordedMatchesString: string = `
╔═════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                Recorded Matches                                                 ║
╠═ # ═╦═ Teams ═╦═════════════════════════════════════════════ Picks ═════════════════════════════════════════════╣
║  0  ║  Blue   ║    champion name 15, champion name 20, champion name 25, champion name 30, champion name 35     ║
║     ║   Red   ║    champion name 49, champion name 54, champion name 59, champion name 64, champion name 69     ║
╠═════╬═════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  1  ║  Blue   ║   champion name 86, champion name 91, champion name 96, champion name 101, champion name 106    ║
║     ║   Red   ║  champion name 120, champion name 125, champion name 130, champion name 135, champion name 140  ║
╠═════╬═════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  2  ║  Blue   ║  champion name 157, champion name 162, champion name 167, champion name 172, champion name 177  ║
║     ║   Red   ║  champion name 191, champion name 196, champion name 201, champion name 206, champion name 211  ║
╠═════╬═════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  3  ║  Blue   ║  champion name 228, champion name 233, champion name 238, champion name 243, champion name 248  ║
║     ║   Red   ║  champion name 262, champion name 267, champion name 272, champion name 277, champion name 282  ║
╚═════╩═════════╩═════════════════════════════════════════════════════════════════════════════════════════════════╝`;

const expectedKeptMatchString: string = `
╔═══════════════════════════════════════════════════════════════════════════════════╗
║                                  New Match Kept                                   ║
╠══════════════════════════ Thu Jan 01 1970 - 221 minutes ══════════════════════════╣
║                                                                                   ║
║                                    Red - LOST                                     ║
╠═════ Summoner ══════╦═════ Champion ══════╦═════ KDA ═════╦═ Damage ═╦═ CS / Min ═╣
║  summoner name 23   ║  champion name 25   ║   35/30/29    ║    31    ║    0.16    ║
║  summoner name 41   ║  champion name 43   ║   53/48/47    ║    49    ║    0.24    ║
║  summoner name 59   ║  champion name 61   ║   71/66/65    ║    67    ║    0.33    ║
║  summoner name 77   ║  champion name 79   ║   89/84/83    ║    85    ║    0.41    ║
║  summoner name 95   ║  champion name 97   ║  107/102/101  ║   103    ║    0.49    ║
╠═════════════════════╩═════════════════════╩═══════════════╩══════════╩════════════╣
║                     Dragons: 3 Heralds: 4 Towers: 6 Barons: 5                     ║
╠═══════════════════════════════════════════════════════════════════════════════════╣
║                                                                                   ║
║                                    Blue - WON                                     ║
╠═════ Summoner ══════╦═════ Champion ══════╦═════ KDA ═════╦═ Damage ═╦═ CS / Min ═╣
║  summoner name 132  ║  champion name 134  ║  144/139/138  ║   140    ║    0.66    ║
║  summoner name 150  ║  champion name 152  ║  162/157/156  ║   158    ║    0.74    ║
║  summoner name 168  ║  champion name 170  ║  180/175/174  ║   176    ║    0.82    ║
║  summoner name 186  ║  champion name 188  ║  198/193/192  ║   194    ║    0.90    ║
║  summoner name 204  ║  champion name 206  ║  216/211/210  ║   212    ║    0.98    ║
╠═════════════════════╩═════════════════════╩═══════════════╩══════════╩════════════╣
║                 Dragons: 112 Heralds: 113 Towers: 115 Barons: 114                 ║
╚═══════════════════════════════════════════════════════════════════════════════════╝`;

const expectedKeptMatchesString: string = `
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                         New Matches Kept                                                         ║
╠═ Date & Duration ═╦══ Teams ═══╦═════════════════════════════════════════════ Picks ═════════════════════════════════════════════╣
║  Thu Jan 01 1970  ║  Blue (W)  ║  champion name 134, champion name 152, champion name 170, champion name 188, champion name 206  ║
║     221 mins      ║    Red     ║    champion name 25, champion name 43, champion name 61, champion name 79, champion name 97     ║
╠═══════════════════╬════════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  Thu Jan 01 1970  ║  Blue (W)  ║  champion name 356, champion name 374, champion name 392, champion name 410, champion name 428  ║
║     443 mins      ║    Red     ║  champion name 247, champion name 265, champion name 283, champion name 301, champion name 319  ║
╠═══════════════════╬════════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  Thu Jan 01 1970  ║  Blue (W)  ║  champion name 578, champion name 596, champion name 614, champion name 632, champion name 650  ║
║     665 mins      ║    Red     ║  champion name 469, champion name 487, champion name 505, champion name 523, champion name 541  ║
╠═══════════════════╬════════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  Thu Jan 01 1970  ║  Blue (W)  ║  champion name 800, champion name 818, champion name 836, champion name 854, champion name 872  ║
║     887 mins      ║    Red     ║  champion name 691, champion name 709, champion name 727, champion name 745, champion name 763  ║
╚═══════════════════╩════════════╩═════════════════════════════════════════════════════════════════════════════════════════════════╝`;

const expectedDiscardedMatchString: string = `
╔═════════════════════════════════════════╗
║           New Match Discarded           ║
╠════════════ Thu Jan 01 1970 ════════════╣
║                                         ║
║                   Red                   ║
╠═════ Summoner ═════╦═════ Champion ═════╣
║  summoner name 47  ║  champion name 49  ║
║  summoner name 52  ║  champion name 54  ║
║  summoner name 57  ║  champion name 59  ║
║  summoner name 62  ║  champion name 64  ║
║  summoner name 67  ║  champion name 69  ║
╠════════════════════╩════════════════════╣
║                                         ║
║                  Blue                   ║
╠═════ Summoner ═════╦═════ Champion ═════╣
║  summoner name 13  ║  champion name 15  ║
║  summoner name 18  ║  champion name 20  ║
║  summoner name 23  ║  champion name 25  ║
║  summoner name 28  ║  champion name 30  ║
║  summoner name 33  ║  champion name 35  ║
╚════════════════════╩════════════════════╝`;

const expectedDiscardedMatchesString: string = `
╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                           New Matches Discarded                                           ║
╠═ Teams ═╦═════════════════════════════════════════════ Picks ═════════════════════════════════════════════╣
║  Blue   ║    champion name 15, champion name 20, champion name 25, champion name 30, champion name 35     ║
║   Red   ║    champion name 49, champion name 54, champion name 59, champion name 64, champion name 69     ║
╠═════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  Blue   ║   champion name 86, champion name 91, champion name 96, champion name 101, champion name 106    ║
║   Red   ║  champion name 120, champion name 125, champion name 130, champion name 135, champion name 140  ║
╠═════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  Blue   ║  champion name 157, champion name 162, champion name 167, champion name 172, champion name 177  ║
║   Red   ║  champion name 191, champion name 196, champion name 201, champion name 206, champion name 211  ║
╠═════════╬═════════════════════════════════════════════════════════════════════════════════════════════════╣
║  Blue   ║  champion name 228, champion name 233, champion name 238, champion name 243, champion name 248  ║
║   Red   ║  champion name 262, champion name 267, champion name 272, champion name 277, champion name 282  ║
╚═════════╩═════════════════════════════════════════════════════════════════════════════════════════════════╝`;

const expectedAccountString: string = "Linked Discord account **user name 1** with LoL account **summoner name 3**.";

const expectedHelpString: string = "Visit this link for the list of available commands: https://github.com/ajoscram/Jupi-Zordon-3400/wiki/Commands";