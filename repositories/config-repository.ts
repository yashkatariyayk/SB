import { getManager } from "typeorm";
import { ConfigEntity } from "../entities/config-entity";

export class ConfigRepo {
  getEmailCount() {
    return getManager()
      .getRepository(ConfigEntity)
      .findOne({ Name: "EmailCount" });
  }
}
