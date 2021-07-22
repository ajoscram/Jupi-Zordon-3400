// import { Bot } from "./core/abstractions";

import { TableBuilder } from "./discord/presentation/TableBuilder";

// const bot: Bot = new DiscordBot("!");
// bot.initialize();
// bot.run();

console.log(new TableBuilder()
    .addHeader(["title 1", "title 2", "title 3"])
    .addData(["data 1", "data 2", "data 3"])
    .addData(["data 4", "data 5", "data 6"])
    .addData(["data 7", "data 8", "data 9"])
    .addData(["data 10", "data 11"])
    .addLineSeparator()
    .build()
);