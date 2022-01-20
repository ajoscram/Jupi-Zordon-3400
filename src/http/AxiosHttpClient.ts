import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BotError, ErrorCode } from "../core/concretions";
import { Header, HttpClient } from ".";

export class AxiosHttpClient implements HttpClient {

    public async get<T>(url:string, headers: Header[], validator?: (x: any) => asserts x is T): Promise<T> {
        try{
            const config: AxiosRequestConfig = this.createConfig(headers);
            const response: AxiosResponse = await axios.get(url, config);
            if(!validator || validator(response.data))
                return response.data;
            else
                throw new BotError(ErrorCode.RESPONSE_TYPE_ASSERTION_FAILED);
        } catch(error) {
            if(error instanceof BotError)
                throw error;
            else
                throw this.createRequestError(error, url, "GET");
        }
    }
    
    private createConfig(headers: Header[]): AxiosRequestConfig {
        const headersObject: { [parameter: string]: string } = {};
        for(const header of headers)
            headersObject[header.name] = header.value;
        return { headers: headersObject };
    }

    private createRequestError(error: any, url: string, method: string): BotError{
        const errorMessage: string = axios.isAxiosError(error) ? 
            `${method} failed with code ${error.response?.status} on ${url} with error: ${error}` :
            `${method} failed on ${url} with error: ${error}`;
        const innerError: Error = new Error(errorMessage);
        return new BotError(ErrorCode.UNSUCCESSFUL_REQUEST, innerError);
    }
}