import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import z from 'zod';

const authenticateBodySchema = z.object({
	email: z.email(),
	password: z.string().min(6).max(100),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
	constructor(
		private jwt: JwtService,
		private prisma: PrismaService) { }

	@Post()
	@HttpCode(200)
	@UsePipes(new ZodValidationPipe(authenticateBodySchema))
	async handle(@Body() body: AuthenticateBodySchema) {

		const { email, password } = body;
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			}
		})
		if (!user) {
			return {
				message: 'Email or password incorrect'
			}
		}
		const isPasswordValid = await compare(password, user.password);

		if (!isPasswordValid) {
			return {
				message: 'Email or password incorrect'
			}
		}

		const accessToken = this.jwt.sign({
			sub: user.id,
		})

		return {
			accessToken
		}
	}
}
