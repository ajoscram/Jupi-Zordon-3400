import axios, {AxiosResponse } from "axios";
import { HttpClient } from "./HttpClient";

export class AxiosHttpClient implements HttpClient {

    public async get(requestUrl:string, requestHeader:object):Promise<object>{
        const response:AxiosResponse = await axios.get(requestUrl, requestHeader );
        return response.data;
    }
    
}