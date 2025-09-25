import { HashComparer } from "@/domain/forum/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";

export class FakeHasher implements HashGenerator, HashComparer {

  async hash(value: string): Promise<string> {
    return value.concat("-hashed")
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return plain.concat("-hashed") === hashed
  }
}