import { SurveyQuestionScaleTypeEntity } from "../entities/surveyQuestionScaleType-entity";
import { getManager } from "typeorm";
import { SurveyQuestionScaleBankEntity } from "../entities/surveyQuestionScaleBank-entity";
import { SurveyQuestionScaleBankValueEntity } from "../entities/surveyQuestionScaleBankValue-entity";

export class QuestionScaleTypeRepo {
  get() {
    return getManager()
      .getRepository(SurveyQuestionScaleTypeEntity)
      .find();
  }

  getScaleBank() {
    return getManager()
      .getRepository(SurveyQuestionScaleBankEntity)
      .createQueryBuilder("surveyQuestionScaleBank")
      .leftJoinAndMapMany(
        "surveyQuestionScaleBank.Value",
        SurveyQuestionScaleBankValueEntity,
        "surveyQuestionQuestionScaleBankValue",
        "surveyQuestionScaleBank.SurveyQuestionScaleBankId=surveyQuestionQuestionScaleBankValue.SurveyQuestionScaleBankId"
      )
      .getMany();
  }
}
