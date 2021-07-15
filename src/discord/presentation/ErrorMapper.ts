import { ErrorCode } from "src/core/concretions";

export class ErrorMapper{
    public map(error: ErrorCode): string{
        switch(error){
            default:
                return "Sorry! An unknown error has occurred while processing your command.";
        }
    }
}