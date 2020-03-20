import { getManager } from "typeorm";
import { ClientEntity } from "../entities/client-entity";

export class ClientRepo {
  get() {
    return getManager()
      .getRepository(ClientEntity)
      .find({ IsDeleted: false });
  }
}
