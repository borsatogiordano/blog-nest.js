import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { PrismaStudentMapper } from "../mappers/prisma-student-mapper";

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {

  constructor(private readonly prisma: PrismaService) { }
  async findByEmail(email: string): Promise<Student | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    }).then((prismaStudent) => {
      if (!prismaStudent) {
        return null;
      }
      return PrismaStudentMapper.toDomain(prismaStudent);
    });
  }
  async create(student: Student): Promise<void> {
    await this.prisma.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    });

    return Promise.resolve();
  }
}