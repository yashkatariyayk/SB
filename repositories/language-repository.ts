import { getManager } from "typeorm";
import { LanguageEntity } from "../entities/language-entity";
import { Language } from "../models/language";

export class LanguageRepo {
  get() {
    return getManager()
      .getRepository(LanguageEntity)
      .find({ IsDeleted: false });
  }

  save(queryObject: Language) {
    return getManager()
      .getRepository(LanguageEntity)
      .save(queryObject);
  }

  delete(queryObject: Language) {
    return getManager()
      .getRepository(LanguageEntity)
      .update({ LanguageId: queryObject.LanguageId }, { IsDeleted: true });
  }
}
