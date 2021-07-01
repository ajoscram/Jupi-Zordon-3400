import { AIModel } from "../model";

export interface AIModelSource{
    initialize(): Promise<void>;
    getAIModel(): Promise<AIModel>;
}