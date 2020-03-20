import { getManager } from "typeorm";
import { StaticContentLanguage } from "../models/static-content-language";
import { StaticContentLanguageEntity } from "../entities/staticContentLanguage-entity";
import { SurveySelecteeLanguageEntity } from "../entities/surveySelecteeLanguage-entity";
import { SurveySelecteeLanguage } from "../models/survey-selectee-language";
import { EmailTemplateLanguage } from "../models/emailTemplateLanguage";
import { EmailTemplateLanguageEntity } from "../entities/emailTemplateLanguage-entity";
import { SurveyLanguageEntity } from "../entities/surveyLanguage-entity";
import { SurveyPageLanguageEntity } from "../entities/surveyPageLanguage-entity";
import { SurveyQuestionOptionLanguageEntity } from "../entities/surveyQuestionOptionLanguage-entity";
import { SurveyQuestionLanguageEntity } from "../entities/surveyQuestionLanguage-entity";

export class SurveyLanguageRepo {
  saveStaticContent(queryObject: StaticContentLanguage[]) {
    return getManager()
      .getRepository(StaticContentLanguageEntity)
      .save(queryObject);
  }

  saveSelectee(queryObject: SurveySelecteeLanguage[]) {
    return getManager()
      .getRepository(SurveySelecteeLanguageEntity)
      .save(queryObject);
  }

  saveEmailTemplate(queryObject: EmailTemplateLanguage[]) {
    return getManager()
      .getRepository(EmailTemplateLanguageEntity)
      .save(queryObject);
  }

  async saveSurvey(queryObject: any[]) {
    let result = await Promise.all(
      queryObject.map(async (element) => {
        this.save(element);
      })
    );
  }

  async save(element: any) {
    switch (element.name) {
      case "survey": {
        return getManager()
          .getRepository(SurveyLanguageEntity)
          .save(element.data);
        break;
      }
      case "page": {
        return getManager()
          .getRepository(SurveyPageLanguageEntity)
          .save(element.data);
        break;
      }
      case "question": {
        return getManager()
          .getRepository(SurveyQuestionLanguageEntity)
          .save(element.data);
        break;
      }
      case "option": {
        return getManager()
          .getRepository(SurveyQuestionOptionLanguageEntity)
          .save(element.data);
        break;
      }
    }
  }
}
