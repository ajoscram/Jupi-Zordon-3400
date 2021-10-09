import "jasmine";
import { IMock } from "typemoq";
import { OverallStats } from "../../src/core/model";

interface Setup{
    readonly prop: (x: OverallStats) => number,
    readonly value: number
}

interface Expectation{
    readonly prop: () => number,
    readonly value: number
}

export class CalculatedOverallStatsTester{

    constructor(private mock: IMock<OverallStats>) { }

    public testProperty(setups: Setup[], expectation: Expectation): void {
        for(const setup of setups)
            this.mock.setup(setup.prop).returns(() => setup.value);
        expect(expectation.prop()).toBe(expectation.value);       
    }

    public testPropertyPerMatch(setup: Setup, expectation: Expectation, matches: number): void {
        this.testProperty(
            [
                setup,
                { prop: x => x.wins, value: Math.ceil(matches / 2) },
                { prop: x => x.losses, value: Math.floor(matches / 2) },
            ],
            expectation
        );
    }

    public testPropertyPerMinutesPlayed(setup: Setup, expectation: Expectation, minutes: number): void {
        this.testProperty(
            [
                setup,
                { prop: x => x.minutesPlayed, value: minutes }
            ],
            expectation
        );
    }

    public testEqualProperty(setup: Setup, expectation: Expectation): void {
        this.testProperty(
            [
                setup
            ],
            expectation
        );
    }
}