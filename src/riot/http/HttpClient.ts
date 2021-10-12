import { Header } from ".";

export interface HttpClient {
    get(url: string, headers: Header[]): Promise<object>;
}