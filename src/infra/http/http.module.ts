import { Module } from "@nestjs/common";
import { AccountController } from "./controllers/account.controller";
import { QuestionsController } from "./controllers/questions.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";

@Module({
  imports: [DatabaseModule],
  controllers: [AccountController, QuestionsController],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase],
})
export class HttpModule {
  constructor() { }
}