import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import z from 'zod';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-user';

const authenticateBodySchema = z.object({
	email: z.email(),
	password: z.string().min(6).max(100),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
	constructor(
		private authenticateStudent: AuthenticateStudentUseCase
	) { }

	@Post()
	@HttpCode(200)
	@UsePipes(new ZodValidationPipe(authenticateBodySchema))
	async handle(@Body() body: AuthenticateBodySchema) {
		const { email, password } = body;

		const result = await this.authenticateStudent.execute({
			email,
			password
		});

		if (result.isLeft()) {
			throw new Error(result.value.message);
		}

		const { accessToken } = result.value;

		return {
			accessToken
		};
	}
}
