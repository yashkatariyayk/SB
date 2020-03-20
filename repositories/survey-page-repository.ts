import { SurveyPageEntity } from "../entities/SurveyPage-entity";
import { getManager } from "typeorm";
import { SurveyPage } from "../models/survey-page";
import { SurveyQuestionEntity } from "../entities/surveyQuestion-entity";
import { SurveyQuestionOptionEntity } from "../entities/surveyQuestionOption-entity";

export class SurveyPageRepo {
  async save(queryObject: SurveyPage) {
    let res = await getManager()
      .getRepository(SurveyPageEntity)
      .createQueryBuilder("surveyPage")
      .update()
      .set({ PageOrder: () => "PageOrder + 1" })
      .where("PageOrder >= " + queryObject.PageOrder)
      .execute();
    let savePage = await getManager()
      .getRepository(SurveyPageEntity)
      .save(queryObject);
    return savePage;
  }
  get(queryObject: SurveyPage) {
    return getManager()
      .getRepository(SurveyPageEntity)
      .createQueryBuilder("surveyPage")
      .leftJoinAndMapMany(
        "surveyPage.SurveyQuestion",
        SurveyQuestionEntity,
        "surveyQuestion",
        "surveyPage.SurveyId = surveyQuestion.SurveyId and surveyPage.SurveyPageId = surveyQuestion.SurveyPageId and surveyQuestion.ParentQuestionId=0 and surveyQuestion.IsDeleted=false"
      )
      .leftJoinAndMapMany(
        "surveyQuestion.ChildQuestion",
        SurveyQuestionEntity,
        "question",
        "surveyQuestion.SurveyQuestionId=question.ParentQuestionId and question.IsDeleted=false"
      )
      .leftJoinAndMapMany(
        "surveyQuestion.SurveyQuestionOption",
        SurveyQuestionOptionEntity,
        "surveyQuestionOption",
        "surveyQuestion.SurveyQuestionId=surveyQuestionOption.SurveyQuestionId and surveyQuestionOption.IsDeleted=false"
      )
      .where(queryObject)
      .orderBy({ PageOrder: "ASC" })
      .getMany();
  }
  update(queryObject: SurveyPage) {
    return getManager()
      .getRepository(SurveyPageEntity)
      .createQueryBuilder()
      .update()
      .set({ ...queryObject })
      .where({ SurveyPageId: queryObject.SurveyPageId })
      .execute();
  }
  async delete(queryObject: SurveyPage) {
    let result = await Promise.all([
      this.deletePageAndChangeOrder(queryObject),
      this.deleteQuestion(queryObject),
      this.deleteQuestionOption(queryObject)
    ]);
    return result;
  }

  async deletePageAndChangeOrder(queryObject: SurveyPage) {
    let deletePage = await this.deletePage(queryObject);
    let updatedPageOrder = await this.updatePageOrder(queryObject);
    return deletePage;
  }

  deletePage(queryObject: SurveyPage) {
    return getManager()
      .getRepository(SurveyPageEntity)
      .createQueryBuilder("surveyPage")
      .update()
      .set({ IsDeleted: true, PageOrder: 0 })
      .where("SurveyPageId = :SurveyPageId and PageOrder = :PageOrder", {
        SurveyPageId: queryObject.SurveyPageId,
        PageOrder: queryObject.PageOrder
      })
      .execute();
  }

  updatePageOrder(queryObject: SurveyPage) {
    return getManager()
      .getRepository(SurveyPageEntity)
      .createQueryBuilder("surveyPage")
      .update({ ...queryObject })
      .set({ PageOrder: () => "PageOrder - 1" })
      .where("PageOrder > " + queryObject.PageOrder)
      .execute();
  }

  async deleteQuestion(queryObject: SurveyPage) {
    return getManager()
      .getRepository(SurveyQuestionEntity)
      .update(queryObject, { IsDeleted: true });
  }

  async deleteQuestionOption(queryObject: SurveyPage) {
    let result: any;
    let quetions = await getManager()
      .getRepository(SurveyQuestionEntity)
      .find(queryObject);
    quetions.forEach(async (element) => {
      result = await getManager()
        .getRepository(SurveyQuestionOptionEntity)
        .update(
          { SurveyQuestionId: element.SurveyQuestionId },
          { IsDeleted: true }
        );
    });
    return result;
  }
}
