import "jasmine";
import { IMock, Mock } from "typemoq";
import { CalculatedOverallStatsTester } from "../../utils/CalculatedOverallStatsTester";
import { CalculatedOverallStats } from "../../../src/core/concretions";
import { OverallStats } from "../../../src/core/model";

describe('CalculatedOverallStats', () => {
    let mock: IMock<OverallStats>;
    let stats: CalculatedOverallStats;
    let tester: CalculatedOverallStatsTester;

    beforeEach(async () => {
        mock = Mock.ofType<OverallStats>();
        stats = new CalculatedOverallStats(mock.object);
        tester = new CalculatedOverallStatsTester(mock);
    });

    it('wins: should equal the inner stats wins', async () => {
        const wins: number = 5;
        tester.testEqualProperty(
            { prop: x => x.wins, value: wins },
            { prop: () => stats.wins, value: wins }
        );
    });

    it('losses: should equal the inner stats losses', async () => {
        const losses: number = 5;
        tester.testEqualProperty(
            { prop: x => x.losses, value: losses },
            { prop: () => stats.losses, value: losses }
        );
    });

    it('matches: should equal the sum of wins and losses', async () => {
        const wins: number = 3;
        const losses: number = 2;
        tester.testProperty(
            [
                { prop: x => x.wins, value: wins },
                { prop: x => x.losses, value: losses }
            ],
            { prop: () => stats.matches, value: wins + losses }
        );
    });

    it('winrate: should equal wins divided by matches', async () => {
        const wins: number = 3;
        const matches: number = wins + 2;
        tester.testPropertyPerMatch(
            { prop: x => x.wins, value: wins },
            { prop: () => stats.winrate, value: wins / matches },
            matches
        );
    });

    it('assists: should equal the inner stats assists', async () => {
        const assists: number = 5;
        tester.testEqualProperty(
            { prop: x => x.assists, value: assists },
            { prop: () => stats.assists, value: assists }
        );
    });

    it('assistsPerMatch: should equal assists divided by matches', async () => {
        const assists: number = 10;
        const matches: number = 5;
        tester.testPropertyPerMatch(
            { prop: x => x.assists, value: assists },
            { prop: () => stats.assistsPerMatch, value: assists / matches },
            matches
        );
    });

    it('deaths: should equal the inner stats deaths', async () => {
        const deaths: number = 5;
        tester.testEqualProperty(
            { prop: x => x.deaths, value: deaths },
            { prop: () => stats.deaths, value: deaths }
        );
    });

    it('deathsPerMatch: should equal deaths divided by matches', async () => {
        const deaths: number = 10;
        const matches: number = 5;
        tester.testPropertyPerMatch(
            { prop: x => x.deaths, value: deaths },
            { prop: () => stats.deathsPerMatch, value: deaths / matches },
            matches
        );
    });

    it('kills: should equal the inner stats kills', async () => {
        const kills: number = 5;
        tester.testEqualProperty(
            { prop: x => x.kills, value: kills },
            { prop: () => stats.kills, value: kills }
        );
    });

    it('killsPerMatch: should equal kills divided by matches', async () => {
        const kills: number = 10;
        const matches: number = 5;
        tester.testPropertyPerMatch(
            { prop: x => x.kills, value: kills },
            { prop: () => stats.killsPerMatch, value: kills / matches },
            matches
        );
    });

    it('kda: should equal the sum of kills and assists divided by deaths', async () => {
        const kills: number = 3;
        const assists: number = 2;
        const deaths: number = 10;
        tester.testProperty(
            [
                { prop: x => x.kills, value: kills },
                { prop: x => x.assists, value: assists },
                { prop: x => x.deaths, value: deaths }
            ],
            { prop: () => stats.kda, value: (kills + assists) / deaths }
        );
    });

    it('damageDealtToChampions: should equal the inner stats damageDealtToChampions', async () => {
        const damageDealtToChampions: number = 5000;
        tester.testEqualProperty(
            { prop: x => x.damageDealtToChampions, value: damageDealtToChampions },
            { prop: () => stats.damageDealtToChampions, value: damageDealtToChampions }
        );
    });

    it('damageDealtToChampionsPerMatch: should equal damageDealtToChampions divided by matches', async () => {
        const damageDealtToChampions: number = 10000;
        const matches: number = 5;
        tester.testPropertyPerMatch(
            { prop: x => x.damageDealtToChampions, value: damageDealtToChampions },
            { prop: () => stats.damageDealtToChampionsPerMatch, value: damageDealtToChampions / matches },
            matches
        );
    });

    it('damageDealtToObjectives: should equal the inner stats damageDealtToObjectives', async () => {
        const damageDealtToObjectives: number = 5000;
        tester.testEqualProperty(
            { prop: x => x.damageDealtToObjectives, value: damageDealtToObjectives },
            { prop: () => stats.damageDealtToObjectives, value: damageDealtToObjectives }
        );
    });

    it('damageDealtToObjectivesPerMatch: should equal damageDealtToObjectives divided by matches', async () => {
        const damageDealtToObjectives: number = 10000;
        const matches: number = 5;
        tester.testPropertyPerMatch(
            { prop: x => x.damageDealtToObjectives, value: damageDealtToObjectives },
            { prop: () => stats.damageDealtToObjectivesPerMatch, value: damageDealtToObjectives / matches },
            matches
        );
    });

    it('damageReceived: should equal the inner stats damageReceived', async () => {
        const damageReceived: number = 5000;
        tester.testEqualProperty(
            { prop: x => x.damageReceived, value: damageReceived },
            { prop: () => stats.damageReceived, value: damageReceived }
        );
    });

    it('damageReceivedPerMatch: should equal damageReceived divided by matches', async () => {
        const damageReceived: number = 10000;
        const matches: number = 5;
        tester.testPropertyPerMatch(
            { prop: x => x.damageReceived, value: damageReceived },
            { prop: () => stats.damageReceivedPerMatch, value: damageReceived / matches },
            matches
        );
    });

    it('damageRate: should equal damageDealtToChampions divided by damageReceived', async () => {
        const damageDealtToChampions: number = 5000;
        const damageReceived: number = 2;
        tester.testProperty(
            [
                { prop: x => x.damageDealtToChampions, value: damageDealtToChampions },
                { prop: x => x.damageReceived, value: damageReceived }
            ],
            { prop: () => stats.damageRate, value: damageDealtToChampions / damageReceived }
        );
    });

    it('gold: should equal the inner stats gold', async () => {
        const gold: number = 5000;
        tester.testEqualProperty(
            { prop: x => x.gold, value: gold },
            { prop: () => stats.gold, value: gold }
        );
    });

    it('goldPerMatch: should equal goldReceived divided by matches', async () => {
        const gold: number = 10000;
        const matches: number = 5;
        tester.testPropertyPerMatch(
            { prop: x => x.gold, value: gold },
            { prop: () => stats.goldPerMatch, value: gold / matches },
            matches
        );
    });

    it('goldPerMinute: should equal goldReceived divided by minutesPlayed', async () => {
        const gold: number = 10000;
        const minutesPlayed: number = 5;
        tester.testPropertyPerMinutesPlayed(
            { prop: x => x.gold, value: gold },
            { prop: () => stats.goldPerMinute, value: gold / minutesPlayed },
            minutesPlayed
        );
    });

    it('minions: should equal the inner stats minions', async () => {
        const minions: number = 500;
        tester.testEqualProperty(
            { prop: x => x.minions, value: minions },
            { prop: () => stats.minions, value: minions }
        );
    });

    it('minionsPerMatch: should equal minions divided by matches', async () => {
        const minions: number = 500;
        const matches: number = 5;
        tester.testPropertyPerMatch(
            { prop: x => x.minions, value: minions },
            { prop: () => stats.minionsPerMatch, value: minions / matches },
            matches
        );
    });

    it('minionsPerMinute: should equal minions divided by minutesPlayed', async () => {
        const minions: number = 500;
        const minutesPlayed: number = 5;
        tester.testPropertyPerMinutesPlayed(
            { prop: x => x.minions, value: minions },
            { prop: () => stats.minionsPerMinute, value: minions / minutesPlayed },
            minutesPlayed
        );
    });

    it('minutesPlayed: should equal the inner stats minutesPlayed', async () => {
        const minutesPlayed: number = 500;
        tester.testEqualProperty(
            { prop: x => x.minutesPlayed, value: minutesPlayed },
            { prop: () => stats.minutesPlayed, value: minutesPlayed }
        );
    });

    it('minutesPlayedPerMatch: should equal minutesPlayed divided by matches', async () => {
        const minutesPlayed: number = 500;
        const matches: number = 5;
        tester.testPropertyPerMatch(
            { prop: x => x.minutesPlayed, value: minutesPlayed },
            { prop: () => stats.minutesPlayedPerMatch, value: minutesPlayed / matches },
            matches
        );
    });

    it('visionScore: should equal the inner stats visionScore', async () => {
        const visionScore: number = 50;
        tester.testEqualProperty(
            { prop: x => x.visionScore, value: visionScore },
            { prop: () => stats.visionScore, value: visionScore }
        );
    });

    it('visionScorePerMatch: should equal visionScore divided by matches', async () => {
        const visionScore: number = 50;
        const matches: number = 5;
        tester.testPropertyPerMatch(
            { prop: x => x.visionScore, value: visionScore },
            { prop: () => stats.visionScorePerMatch, value: visionScore / matches },
            matches
        );
    });

    it('crowdControlScore: should equal the inner stats crowdControlScore', async () => {
        const crowdControlScore: number = 50;
        tester.testEqualProperty(
            { prop: x => x.crowdControlScore, value: crowdControlScore },
            { prop: () => stats.crowdControlScore, value: crowdControlScore }
        );
    });

    it('crowdControlScorePerMatch: should equal crowdControlScore divided by matches', async () => {
        const crowdControlScore: number = 50;
        const matches: number = 5;
        tester.testPropertyPerMatch(
            { prop: x => x.crowdControlScore, value: crowdControlScore },
            { prop: () => stats.crowdControlScorePerMatch, value: crowdControlScore / matches },
            matches
        );
    });

    it('pentakills: should equal the inner stats pentakills', async () => {
        const pentakills: number = 50;
        tester.testEqualProperty(
            { prop: x => x.pentakills, value: pentakills },
            { prop: () => stats.pentakills, value: pentakills }
        );
    });

    it('any "per game" property with 0 total matches: should equal that property in total', async () => {
        const gold: number = 50; // picked arbitrarily
        const matches: number = 0;
        tester.testPropertyPerMatch(
            { prop: x => x.gold, value: gold },
            { prop: () => stats.goldPerMatch, value: gold },
            matches
        );
    });

    it('any "per minutes played" property with 0 total minutes played: should equal that property in total', async () => {
        const gold: number = 50; // picked arbitrarily
        const minutesPlayed: number = 0;
        tester.testPropertyPerMinutesPlayed(
            { prop: x => x.gold, value: gold },
            { prop: () => stats.goldPerMinute, value: gold },
            minutesPlayed
        );
    });
});

