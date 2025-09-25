import { Module } from "@nestjs/common";
import { AccountController } from "./controllers/account.controller";
import { QuestionsController } from "./controllers/questions.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [AccountController, QuestionsController],
  providers: [PrismaService]
})
export class HttpModule {
  constructor() { }

}