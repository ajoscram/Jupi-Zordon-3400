import { OngoingMatch } from "../core/model";
import { Source } from "../core/interfaces";
import { Url } from "./Url";

export class OngoingMatchSource implements Source{
    constructor(
        private readonly matches: OngoingMatch[]
    ){}

    public getUrls(): string[] {
        return this.matches.map(x => this.getRiotMatchUrl(x));
    }

    private getRiotMatchUrl(match: OngoingMatch): string{
        return Url.COMPLETED_MATCH + encodeURIComponent(match.id);
    }
}