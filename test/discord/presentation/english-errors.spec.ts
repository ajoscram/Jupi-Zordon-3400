import "jasmine";
import { ErrorCode } from "../../../src/core/concretions";
import { errors } from "../../../src/discord/presentation/english-errors";

describe('english-errors', () => {
    const errorMessage: string = "These ErrorCodes are missing in src/discord/presentation/english-errors.ts: ";

    it('should include every ErrorCode', async () => {
        const missingCodes: string[] = [];
        for(const code in ErrorCode)
            if(!code.match(/\d+/) && !errors[code])
                missingCodes.push(code);
        
        if(missingCodes.length > 0)
            fail(errorMessage + missingCodes.join(", "));
    });
});