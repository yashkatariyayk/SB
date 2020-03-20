import { SurveyQuestionEntity } from "../entities/surveyQuestion-entity";
import { getManager } from "typeorm";
import { SurveyQuestion } from "../models/survey-question";
import { SurveyQuestionOption } from "../models/survey-question-option";
import { SurveyQuestionOptionEntity } from "../entities/surveyQuestionOption-entity";

export class SurveyQuestionRepo {
  async save(
    firstQuestion: SurveyQuestion[],
    queryObjectQ: SurveyQuestion[],
    queryObjectQO: SurveyQuestionOption[]
  ) {
    let savedQuestion = await this.saveFirstQuestion(
      firstQuestion,
      queryObjectQO
    );
    if (queryObjectQ.length > 0) {
      let questionObject: SurveyQuestion[] = queryObjectQ.map((element) => {
        element.ParentQuestionId = savedQuestion.SurveyQuestionId;
        return element;
      });
      let result = await getManager()
        .getRepository(SurveyQuestionEntity)
        .save(questionObject);
      result.unshift(savedQuestion);
      return result;
    } else {
      return savedQuestion;
    }
  }
  async saveFirstQuestion(
    firstQuestion: SurveyQuestion[],
    queryObjectQO: SurveyQuestionOption[]
  ) {
    let result = await getManager()
      .getRepository(SurveyQuestionEntity)
      .save(firstQuestion[0]);
    let queryObject: SurveyQuestionOption[] = queryObjectQO.map((element) => {
      element.SurveyQuestionId = result.SurveyQuestionId;
      element.SurveyId = result.SurveyId;
      return element;
    });
    let questionOption = await getManager()
      .getRepository(SurveyQuestionOptionEntity)
      .save(queryObject);
    return result;
  }

  async delete(queryObjectQ: SurveyQuestion) {
    let result = await Promise.all([
      this.deleteQ(queryObjectQ),
      this.deleteChildQ(queryObjectQ),
      this.deleteQO(queryObjectQ)
    ]);
    return result;
  }
  async deleteQ(queryObject: SurveyQuestion) {
    return getManager()
      .getRepository(SurveyQuestionEntity)
      .update(
        { SurveyQuestionId: queryObject.SurveyQuestionId },
        { IsDeleted: true }
      );
  }
  async deleteChildQ(queryObject: SurveyQuestion) {
    return getManager()
      .getRepository(SurveyQuestionEntity)
      .update(
        { ParentQuestionId: queryObject.SurveyQuestionId },
        { IsDeleted: true }
      );
  }
  async deleteQO(queryObject: SurveyQuestion) {
    return getManager()
      .getRepository(SurveyQuestionOptionEntity)
      .update(
        { SurveyQuestionId: queryObject.SurveyQuestionId },
        { IsDeleted: true }
      );
  }

  async update(
    queryObjectQ: SurveyQuestion[],
    queryObjectQO: SurveyQuestionOption[]
  ) {
    let result = await Promise.all([
      this.updateQ(queryObjectQ),
      this.updateQO(queryObjectQO, queryObjectQ[0].SurveyQuestionId)
    ]);
    return result;
  }
  async updateQ(queryObject: SurveyQuestion[]) {
    await Promise.all(
      queryObject.map(async (element) => {
        await getManager()
          .getRepository(SurveyQuestionEntity)
          .save(element);
      })
    );
    return true;
  }
  async updateQO(queryObject: SurveyQuestionOption[], id: number) {
    let whereQuery = { SurveyQuestionId: id };
    let result = await getManager()
      .getRepository(SurveyQuestionOptionEntity)
      .update({ ...whereQuery }, { IsDeleted: true });
    return await getManager()
      .getRepository(SurveyQuestionOptionEntity)
      .save(queryObject);
  }

  async get(queryObject: SurveyQuestion) {
    queryObject.ParentQuestionId = 0;
    // console.log(queryObject);
    return await getManager()
      .getRepository(SurveyQuestionEntity)
      .createQueryBuilder("surveyQuestion")
      .leftJoinAndMapMany(
        "surveyQuestion.ChildQuestion",
        SurveyQuestionEntity,
        "childQue",
        "surveyQuestion.SurveyQuestionId=childQue.ParentQuestionId and childQue.IsDeleted=false"
      )
      .leftJoinAndMapMany(
        "surveyQuestion.SurveyQuestionOption",
        SurveyQuestionOptionEntity,
        "surveyQuestionOption",
        "surveyQuestion.SurveyQuestionId=surveyQuestionOption.SurveyQuestionId and surveyQuestionOption.IsDeleted=false"
      )
      .where(queryObject)
      .orderBy("surveyQuestion.SurveyQuestionId", "ASC")
      .addOrderBy("childQue.SurveyQuestionId", "ASC")
      .getMany();
  }

  async deleteOption(queryObject: SurveyQuestionOption) {
    console.log("option", queryObject);
    return getManager()
      .getRepository(SurveyQuestionOptionEntity)
      .update(queryObject, { IsDeleted: true });
  }
}
