import { UserEntity } from "../entities/user-entity";
import { getManager } from "typeorm";

export class AuthRepo {
  checkEmail(email: string) {
    return getManager()
      .getRepository(UserEntity)
      .findOne({ Email: email });
  }
}
