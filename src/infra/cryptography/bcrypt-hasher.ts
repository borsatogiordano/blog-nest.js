import { HashComparer } from "@/domain/forum/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";
import { compare, hash } from "bcryptjs";

export class BcryptHasher implements HashGenerator, HashComparer {

  private HASH_SALT = 8;

  async hash(value: string): Promise<string> {
    return hash(value, this.HASH_SALT);
  }
  async compare(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed);
  }

}