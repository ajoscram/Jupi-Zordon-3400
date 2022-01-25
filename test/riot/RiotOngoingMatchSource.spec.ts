import "jasmine";
import { OngoingMatch } from "../../src/core/model";
import { OngoingMatchSource } from "../../src/riot/OngoingMatchSource";
import { Url } from "../../src/riot/Url";
import { DummyModelFactory } from "../../test/utils";


describe('RiotOngoingMatchSource', () => {
    it('getUrls(): should return the riot api urls', async () => {
        const match: OngoingMatch = new DummyModelFactory().createOngoingMatch();
        const expectedUrl: string = Url.COMPLETED_MATCH + encodeURIComponent(match.id);

        const source: OngoingMatchSource = new OngoingMatchSource([ match ]);
        const actualUrl: string = source.getUrls()[0];

        expect(actualUrl).toBe(expectedUrl);
    });
});