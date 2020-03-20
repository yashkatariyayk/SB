import { SurveyStatusEntity } from "../entities/surveyStatus-entity";
import { getManager } from "typeorm";
import { Survey } from "../models/survey";

export class SurveyStatusRepo {
  get() {
    return getManager()
      .getRepository(SurveyStatusEntity)
      .find();
  }
}
