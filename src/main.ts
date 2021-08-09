import { Bot } from "./core/abstractions";
import { DiscordBot } from "./discord";
import { MockDatabase, MockMatchFetcher, MockPredictor, MockSummonerFetcher } from "./mock";
import { config } from "dotenv";
import { ConsoleWriter, Logger } from "./core/concretions/logging";

async function main(): Promise<void>{
    config();
    Logger.add(new ConsoleWriter());
    const bot: Bot = new DiscordBot(
        "+",
        new MockDatabase(),
        new MockMatchFetcher(),
        new MockSummonerFetcher(),
        new MockPredictor()
    );
    await bot.initialize();
    await bot.run();
}

main();