import { getManager } from "typeorm";
import { StaticContentEntity } from "../entities/staticContent-entity";
import { StaticContentLanguageEntity } from "../entities/staticContentLanguage-entity";
import { StaticContent } from "../models/static-content";

export class SurveyStaticContentRepo {
  get(languageId: number, surveyId: number) {
    return getManager()
      .getRepository(StaticContentEntity)
      .createQueryBuilder("static")
      .leftJoinAndMapOne(
        "static.Language",
        StaticContentLanguageEntity,
        "language",
        `static.StaticContentId=language.StaticContentId and language.SurveyId=${surveyId} and language.LanguageId=${languageId}`
      )
      .getMany();
  }

  save(queryObject: StaticContent[]) {
    return getManager()
      .getRepository(StaticContentEntity)
      .save(queryObject);
  }
}
