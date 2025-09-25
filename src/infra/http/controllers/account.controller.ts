import { ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, Post } from "@nestjs/common";
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { z } from "zod";

const createAccountSchema = z.object({
	name: z.string().min(2).max(100),
	email: z.email(),
	password: z.string().min(6).max(100),
});

type CreateAccountBodySchema = z.infer<typeof createAccountSchema>;

@Controller('/accounts')
export class AccountController {
	constructor(private prisma: PrismaService) { }

	@Post()
	@UsePipes(new ZodValidationPipe(createAccountSchema))
	async createAccount(@Body() body: CreateAccountBodySchema) {

		const { name, email, password } = body;

		const userWithSameEmail = await this.prisma.user.findUnique({
			where: {
				email,
			}
		})

		if (userWithSameEmail) {
			throw new ConflictException('Email already in use');
		}

		const hashedPassword = await hash(password, 8)

		await this.prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			}
		})
	}
}