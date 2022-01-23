import { config as loadEnvironmentVariables } from "dotenv";
import { Bot } from "./core/interfaces";
import { DiscordBot } from "./discord";
import { MockPredictor } from "./mock";
import { ConsoleWriter, Logger } from "./core/concretions/logging";
import { DefaultCommandFactory } from "./core/concretions/commands/creation";
import { MongoDatabase } from "./mongo";
import { MongoDao } from "./mongo/dao";
import { RiotMatchFetcher, RiotSummonerFetcher } from "./riot";
import { AxiosHttpClient } from "./riot/http";
import { DataDragonChampionFetcher } from "./riot/champions";

async function main(): Promise<void>{
    loadEnvironmentVariables();
    Logger.add(new ConsoleWriter());
    const bot: Bot = new DiscordBot(
        new DefaultCommandFactory("!"),
        new MongoDatabase(new MongoDao()),
        new RiotMatchFetcher(
            new AxiosHttpClient(),
            new DataDragonChampionFetcher(new AxiosHttpClient())
        ),
        new RiotSummonerFetcher(new AxiosHttpClient()),
        new MockPredictor()
    );
    await bot.run();
}

main();