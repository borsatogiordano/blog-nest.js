import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthenticateController } from "@/controllers/authenticate.controller";
import { Env } from "@/env";
import { PrismaService } from "@/prisma/prisma.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<Env, true>) => {
				const privateKey = config.get<string>('JWT_PRIVATE_KEY', '', { infer: true });
				const publicKey = config.get<string>('JWT_PUBLIC_KEY', '', { infer: true });
				return {
					privateKey: Buffer.from(privateKey, 'base64').toString('utf-8'),
					publicKey: Buffer.from(publicKey, 'base64').toString('utf-8'),
					signOptions: { algorithm: 'RS256' },
				};
			},
		})
	],
	controllers: [AuthenticateController],
	providers: [PrismaService, JwtStrategy],
})
export class AuthModule { }