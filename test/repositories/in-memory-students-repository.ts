import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  constructor(
  ) { }

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((item) => item.email === email)
    return student ? student : null
  }
  create(student: Student): Promise<void> {
    this.items.push(student)
    return Promise.resolve()
  }
}
