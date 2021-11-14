import axios, { AxiosResponse } from "axios";
import { BotError, ErrorCode } from "../../core/concretions";
import { Header, HttpClient } from ".";

export class AxiosHttpClient implements HttpClient {

    private static readonly SUCCESSFUL_RESPONSE_STATUS: number = 200;

    public async get(url:string, headers: Header[]): Promise<object> {
        const headersObject: object = this.createHeadersObject(headers);
        const response: AxiosResponse = await axios.get(url, headersObject);
        
        if(response.status === AxiosHttpClient.SUCCESSFUL_RESPONSE_STATUS)
            return response.data;
        else {
            const innerError: Error = new Error(`GET failed with code ${response.status} on: ${url}`);
            throw new BotError(ErrorCode.UNSUCCESSFUL_REQUEST, innerError);
        }
    }
    
    private createHeadersObject(headers: Header[]): object {
        const headersObject: { [parameter: string]: string } = {};
        for(const header of headers)
            headersObject[header.name] = header.value;
        return headersObject;
    }
}