import { Module } from "@nestjs/common";
import { AccountController } from "./controllers/account.controller";
import { QuestionsController } from "./controllers/questions.controller";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [AccountController, QuestionsController],
})
export class HttpModule {
  constructor() { }

}