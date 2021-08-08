// import { Bot } from "./core/abstractions";

// const bot: Bot = new DiscordBot("!");
// bot.initialize();
// bot.run();

/*
import { MatchFetcher, Predictor } from "./core/abstractions";
import { OngoingMatch, Prediction } from "./core/model";
import { StringPresenter } from "./discord/presentation";
import { MockMatchFetcher, MockPredictor } from "./mock";

const predictor: Predictor = new MockPredictor();
const matchFetcher: MatchFetcher = new MockMatchFetcher();
const presenter: StringPresenter = new StringPresenter();

async function test(): Promise<void>{
    const match: OngoingMatch = await matchFetcher.getOngoingMatch({id:"1", name:"Ajo con pan"}, {id:"1", name:""});
    const prediction: Prediction = await predictor.predict(match);
    console.log(presenter.createReplyFromPrediction(prediction));
}

test();*/

/*
import { Database } from "./core/abstractions";
import { StringPresenter } from "./discord/presentation";
import { MockDatabase } from "./mock";

const database: Database = new MockDatabase();

async function test(): Promise<void>{
    const account = await database.getAccount({id: "user_id", name: "user_name"});
    console.log(new StringPresenter().createReplyFromAccount(account));
}

test();
*/