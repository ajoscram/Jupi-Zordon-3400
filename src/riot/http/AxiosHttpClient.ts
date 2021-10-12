import axios, { AxiosResponse } from "axios";
import { Header, HttpClient } from ".";

export class AxiosHttpClient implements HttpClient {

    public async get(url:string, headers: Header[]): Promise<object> {
        const headersObject: object = this.createHeadersObject(headers);
        const response:AxiosResponse = await axios.get(url, headersObject);
        return response.data;
    }
    
    private createHeadersObject(headers: Header[]): object {
        const headersObject: { [parameter: string]: string } = {};
        for(const header of headers)
            headersObject[header.name] = header.value;
        return headersObject;
    }
}