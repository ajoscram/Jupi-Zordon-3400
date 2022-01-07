import { Bot } from "./core/abstractions";
import { DiscordBot } from "./discord";
import { MockDatabase, MockMatchFetcher, MockPredictor, MockSummonerFetcher } from "./mock";
import { config as loadEnvironmentVariables } from "dotenv";
import { ConsoleWriter, Logger } from "./core/concretions/logging";
import { DefaultCommandFactory } from "./core/concretions/commands/creation";

async function main(): Promise<void>{
    loadEnvironmentVariables();
    Logger.add(new ConsoleWriter());
    const bot: Bot = new DiscordBot(
        new DefaultCommandFactory("!"),
        new MockDatabase(),
        new MockMatchFetcher(),
        new MockSummonerFetcher(),
        new MockPredictor()
    );
    await bot.initialize();
    await bot.run();
}

main();