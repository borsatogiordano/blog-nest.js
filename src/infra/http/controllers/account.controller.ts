import { BadRequestException, ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, Post } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";
import { StudentAlreadyExistsError } from "@/domain/forum/application/use-cases/errors/student-already-exists-error";

const createAccountSchema = z.object({
	name: z.string().min(2).max(100),
	email: z.email(),
	password: z.string().min(6).max(100),
});

type CreateAccountBodySchema = z.infer<typeof createAccountSchema>;

@Controller('/accounts')
export class AccountController {
	constructor(private registerStudent: RegisterStudentUseCase) { }

	@Post()
	@UsePipes(new ZodValidationPipe(createAccountSchema))
	async createAccount(@Body() body: CreateAccountBodySchema) {

		const { name, email, password } = body;

		const result = await this.registerStudent.execute({
			name,
			email,
			password
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case StudentAlreadyExistsError:
					throw new ConflictException(error.message);

				default:
					throw new BadRequestException(error.message);
			}
		}
	}
}