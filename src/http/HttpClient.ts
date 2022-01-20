import { Header } from ".";

export interface HttpClient {
    get<T>(url: string, headers: Header[], validator?: (x: any) => x is T): Promise<T>;
}