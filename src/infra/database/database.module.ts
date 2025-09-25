import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository";
import { PrismaAnswerRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaQuestionsAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments";
import { PrismaQuestionsCommentsRepository } from "./prisma/repositories/prisma-questions-comments-repository";

@Module({
  providers: [
    PrismaService,
    PrismaAnswerCommentsRepository,
    PrismaAnswerRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaQuestionsRepository,
    PrismaQuestionsAttachmentsRepository,
    PrismaQuestionsCommentsRepository,
  ],
  exports: [
    PrismaService,
    PrismaAnswerCommentsRepository,
    PrismaAnswerRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaQuestionsRepository,
    PrismaQuestionsAttachmentsRepository,
    PrismaQuestionsCommentsRepository,
  ],
})
export class DatabaseModule { }