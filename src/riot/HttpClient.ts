export interface HttpClient {

    get(requestUrl:string, requestHeader:object):Promise<object>;
        
}