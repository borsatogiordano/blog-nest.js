import { Body, Controller, Get, Param, Post, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import z from 'zod';

const createQuestionBody = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBody>;


@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {

  constructor(
    private prisma: PrismaService
  ) { }

  @Post()
  async createQuestion(
    @Body(new ZodValidationPipe(createQuestionBody)) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { title, content } = body;
    const userId = user.sub;

    await this.prisma.question.create({
      data: {
        title,
        content,
        authorId: userId,
        slug: title.toLowerCase().normalize().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '').slice(0, 200)
      }
    })
  }

  @Get()
  async getQuestions(
    @CurrentUser() user: UserPayload,
    @Query() query: { page?: string, perPage?: string }
  ) {

    const questions = await this.prisma.question.findMany({
      take: query.perPage ? parseInt(query.perPage) : 20,
      skip: query.page ? (parseInt(query.page) - 1) * (query.perPage ? parseInt(query.perPage) : 20) : 0,
      orderBy: {
        createdAt: 'desc',
      }
    })
    const totalItems = await this.prisma.question.count();

    const pagination = {
      page: query.page ? parseInt(query.page) : 1,
      perPage: query.perPage ? parseInt(query.perPage) : 20,
      totalItems,
      totalPages: Math.ceil(totalItems / (query.perPage ? parseInt(query.perPage) : 20)),
    }

    return { questions, pagination };
  }
}
