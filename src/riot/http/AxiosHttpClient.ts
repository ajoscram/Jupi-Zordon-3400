import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BotError, ErrorCode } from "../../core/concretions";
import { Header, HttpClient } from ".";

export class AxiosHttpClient implements HttpClient {

    public async get(url:string, headers: Header[]): Promise<object> {
        try{
            const config: AxiosRequestConfig = this.createConfig(headers);
            const response: AxiosResponse = await axios.get(url, config);
            return response.data;
        } catch(error) {
            throw this.createBotError(error, url, "GET");
        }
    }
    
    private createConfig(headers: Header[]): AxiosRequestConfig {
        const headersObject: { [parameter: string]: string } = {};
        for(const header of headers)
            headersObject[header.name] = header.value;
        return { headers: headersObject };
    }

    private createBotError(error: any, url: string, method: string): BotError{
        const errorMessage: string = axios.isAxiosError(error) ? 
            `${method} failed with code ${error.response?.status} on ${url} with error: ${error}` :
            `${method} failed on ${url} with error: ${error}`;
        const innerError: Error = new Error(errorMessage);
        return new BotError(ErrorCode.UNSUCCESSFUL_REQUEST, innerError);
    }
}