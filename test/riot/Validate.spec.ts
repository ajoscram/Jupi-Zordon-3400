import "jasmine";
import { DummyModelFactory } from "../utils";
import { Validate } from "../../src/riot/Validate";
import { BotError, ErrorCode } from "../../src/core/concretions";

describe('Validator', () => {

    const dummyFactory: DummyModelFactory = new DummyModelFactory();

    it('validateRawOngoingMatch(): should return true if given a valid RawOngoingMatch', async () => {
        const match: any = dummyFactory.createRawOngoingMatch();
        const result: boolean = Validate.rawOngoingMatch(match);
        expect(result).toBe(true);
    });

    it('validateRawOngoingMatch(): should fail with TYPE_ASSERTION_FAILED if a property is missing', async () => {
        const match: any = dummyFactory.createRawOngoingMatch();
        delete(match.gameId); //picked arbitrarily
        expect(() => Validate.rawOngoingMatch(match)).toThrow(
            new BotError(ErrorCode.TYPE_ASSERTION_FAILED)
        );
    });

    it('validateRawOngoingMatch(): should fail with ONGOING_MATCH_IS_NOT_CUSTOM if the gameType is incorrect', async () => {
        const match: any = dummyFactory.createRawOngoingMatch();
        match.gameType = "incorrect gameType";
        expect(() => Validate.rawOngoingMatch(match)).toThrow(
            new BotError(ErrorCode.ONGOING_MATCH_IS_NOT_CUSTOM)
        );
    });

    it('validateRawOngoingMatch(): should fail with ONGOING_MATCH_IS_PRACTICE_TOOL if the gameMode is PRACTICETOOL', async () => {
        const match: any = dummyFactory.createRawOngoingMatch();
        match.gameMode = "PRACTICETOOL";
        expect(() => Validate.rawOngoingMatch(match)).toThrow(
            new BotError(ErrorCode.ONGOING_MATCH_IS_PRACTICE_TOOL)
        );
    });

    it('validateRawCompletedMatch(): should return true if given a valid RawCompletedMatch', async () => {
        const match: any = dummyFactory.createRawCompletedMatch();
        const result: boolean = Validate.rawCompletedMatch(match);
        expect(result).toBe(true);
    });

    it('validateRawCompletedMatch(): should fail with TYPE_ASSERTION_FAILED if a property is missing', async () => {
        const match: any = dummyFactory.createRawCompletedMatch();
        delete(match.participants[0].timeline.role); //picked arbitrarily
        expect(() => Validate.rawCompletedMatch(match)).toThrow(
            new BotError(ErrorCode.TYPE_ASSERTION_FAILED)
        );
    });
});