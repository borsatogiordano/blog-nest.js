import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import z from 'zod';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { QuestionPresenter } from '../presenters/question-presenter';

const createQuestionBody = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBody>;

@Controller('/questions')
export class QuestionsController {

  constructor(
    private createQuestionUseCase: CreateQuestionUseCase,
    private fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase
  ) { }

  @Post()
  async createQuestion(
    @Body(new ZodValidationPipe(createQuestionBody)) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const result = await this.createQuestionUseCase.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }

  @Get()
  async getQuestions(
    @CurrentUser() user: UserPayload,
    @Query() query: { page?: string }
  ) {

    const perPage = 20;

    const result = await this.fetchRecentQuestionsUseCase.execute({
      page: Number(query.page ?? '1'),
    })

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const questions = result.value.questions
    return { questions: questions.map(QuestionPresenter.toHTTP) }
  }
}
