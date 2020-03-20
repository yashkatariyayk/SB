import { SurveyEntity } from "../entities/survey-entity";
import { getManager } from "typeorm";
import { Survey } from "../models/survey";
import { SurveyStatusEntity } from "../entities/surveyStatus-entity";
import { SurveyQuestionEntity } from "../entities/surveyQuestion-entity";
import { SurveyQuestionOptionEntity } from "../entities/surveyQuestionOption-entity";
import { SurveyPageEntity } from "../entities/SurveyPage-entity";
import { SurveyPage } from "../models/survey-page";
import { SurveyQuestion } from "../models/survey-question";
import { SurveyQuestionOption } from "../models/survey-question-option";
import { SurveyPageTypeEntity } from "../entities/SurveyPageType-entity";
import { SurveyResponseEntity } from "../entities/SurveyResponse-entity";
import { SurveyResponseLinkEntity } from "../entities/SurveyResponseLink-entity";
import { SurveySelecteeEntity } from "../entities/surveySelectee-entity";
import { SurveySelectorEntity } from "../entities/surveySelector-entity";
import { SurveyLanguageEntity } from "../entities/surveyLanguage-entity";
import { SurveyPageLanguageEntity } from "../entities/surveyPageLanguage-entity";
import { SurveyQuestionLanguageEntity } from "../entities/surveyQuestionLanguage-entity";
import { SurveyQuestionOptionLanguageEntity } from "../entities/surveyQuestionOptionLanguage-entity";

export class SurveyRepo {
  public LastSavesParentQuestionId: number;
  async add(queryObject: any) {
    let survey: Survey = await getManager()
      .getRepository(SurveyEntity)
      .save(queryObject);
    let getDefaultPage = await getManager()
      .getRepository(SurveyPageTypeEntity)
      .find();
    let objectArr: SurveyPage[] = [];
    getDefaultPage.forEach((page) => {
      let newQueryObject: SurveyPage = new SurveyPage();
      newQueryObject.Name = page.Name;
      newQueryObject.Description = page.Description;
      newQueryObject.SurveyPageTypeId = page.SurveyPageTypeId;
      newQueryObject.PageOrder = page.SurveyPageTypeId;
      newQueryObject.SurveyId = survey.SurveyId;
      objectArr.push(newQueryObject);
    });
    let pages = await getManager()
      .getRepository(SurveyPageEntity)
      .save(objectArr);
    let result: any;
    result = survey;
    result["SurveyPages"] = pages;
    return survey;
  }

  async copy(queryObject: any, SurveyId: number) {
    let survey: Survey = await getManager()
      .getRepository(SurveyEntity)
      .save(queryObject);
    let pages: SurveyPage[] = await getManager()
      .getRepository(SurveyPageEntity)
      .find({ SurveyId: SurveyId });
    await this.copyPage(pages, survey);
    return survey;
  }

  async copyPage(pages: SurveyPage[], survey: Survey) {
    await Promise.all(pages.map((p) => this.runCopyPage(p, survey)));
  }

  async runCopyPage(p: SurveyPage, survey: Survey) {
    let surveyId = p.SurveyId;
    p.SurveyId = survey.SurveyId;
    let pageId = p.SurveyPageId;
    delete p.SurveyPageId;
    let newPage: SurveyPage = await getManager()
      .getRepository(SurveyPageEntity)
      .save(p);
    let question: SurveyQuestion[] = await getManager()
      .getRepository(SurveyQuestionEntity)
      .find({ SurveyId: surveyId, SurveyPageId: pageId });
    await this.copyQuestion(question, newPage);
  }

  async copyQuestion(question: SurveyQuestion[], newPage: SurveyPage) {
    let parentQuestionId = 0;
    let parentQuestion = question.filter(
      (x) => x.ParentQuestionId == 0 && x.MatrixTypeId == 3
    );

    if (parentQuestion && parentQuestion.length > 0) {
      await Promise.all(
        parentQuestion.map(async (item) => {
          let childQuestion = question.filter(
            (x) => x.ParentQuestionId == item.SurveyQuestionId
          );
          parentQuestionId = await this.saveReturParentQuestion(item, newPage);
          await Promise.all(
            childQuestion.map(async (q) => {
              q.ParentQuestionId = parentQuestionId;
              this.runCopyQuestions(q, newPage);
            })
          );
        })
      );
    }

    let otherQuestion = question.filter((x) => x.MatrixTypeId != 3);
    if (otherQuestion && otherQuestion.length > 0) {
      await Promise.all(
        otherQuestion.map(async (q) => this.runCopyQuestions(q, newPage))
      );
    }
  }

  async runCopyQuestions(q: SurveyQuestion, newPage: SurveyPage) {
    let SurveyId = q.SurveyId;
    q.SurveyId = newPage.SurveyId;
    q.SurveyPageId = newPage.SurveyPageId;
    let questionId = q.SurveyQuestionId;
    delete q.SurveyQuestionId;
    let newQuestion: SurveyQuestion = await getManager()
      .getRepository(SurveyQuestionEntity)
      .save(q);
    let questionOption: SurveyQuestionOption[] = await getManager()
      .getRepository(SurveyQuestionOptionEntity)
      .find({ SurveyId: SurveyId, SurveyQuestionId: questionId });
    await this.copyQuestionOption(questionOption, newQuestion);
  }

  async saveReturParentQuestion(q: SurveyQuestion, newPage: SurveyPage) {
    let SurveyId = q.SurveyId;
    q.SurveyId = newPage.SurveyId;
    q.SurveyPageId = newPage.SurveyPageId;
    let questionId = q.SurveyQuestionId;
    delete q.SurveyQuestionId;
    let newQuestion: SurveyQuestion = await getManager()
      .getRepository(SurveyQuestionEntity)
      .save(q);
    let questionOption: SurveyQuestionOption[] = await getManager()
      .getRepository(SurveyQuestionOptionEntity)
      .find({ SurveyId: SurveyId, SurveyQuestionId: questionId });
    await this.copyQuestionOption(questionOption, newQuestion);
    return newQuestion.SurveyQuestionId;
  }

  async copyQuestionOption(
    questionOption: SurveyQuestionOption[],
    newQuestion: SurveyQuestion
  ) {
    await Promise.all(
      questionOption.map((qo) => this.runCopyQuestionOption(qo, newQuestion))
    );
  }

  async runCopyQuestionOption(
    qo: SurveyQuestionOption,
    newQuestion: SurveyQuestion
  ) {
    qo.SurveyId = newQuestion.SurveyId;
    qo.SurveyQuestionId = newQuestion.SurveyQuestionId;
    let questionOptionId = qo.SurveyQuestionOptionId;
    delete qo.SurveyQuestionOptionId;
    await getManager()
      .getRepository(SurveyQuestionOptionEntity)
      .save(qo);
  }

  async get(queryObject: Survey, languageId: number) {
    const response = await getManager()
      .getRepository(SurveyEntity)
      .createQueryBuilder("survey")
      .select([
        "survey",
        "SurveyStatusEntity.Name",
        "SurveyThemeEntity.Name",
        "ClientEntity.Name"
      ])
      .innerJoin("survey.SurveyStatus", "SurveyStatusEntity")
      .innerJoin("survey.SurveyTheme", "SurveyThemeEntity")
      .innerJoin("survey.Client", "ClientEntity")
      .leftJoinAndMapOne(
        "survey.Language",
        SurveyLanguageEntity,
        "languageSurvey",
        `survey.SurveyId=languageSurvey.SurveyId and languageSurvey.LanguageId=${languageId}`
      )
      .leftJoinAndMapMany(
        "survey.surveyPage",
        SurveyPageEntity,
        "surveyPage",
        "survey.SurveyId=surveyPage.SurveyId and surveyPage.IsDeleted=false"
      )
      .leftJoinAndMapOne(
        "surveyPage.Language",
        SurveyPageLanguageEntity,
        "languagePage",
        `surveyPage.SurveyPageId=languagePage.SurveyPageId and languagePage.LanguageId=${languageId}`
      )
      .leftJoinAndMapMany(
        "surveyPage.SurveyQuestion",
        SurveyQuestionEntity,
        "surveyQuestion",
        "surveyPage.SurveyPageId=surveyQuestion.SurveyPageId and surveyQuestion.ParentQuestionId=0 and surveyPage.SurveyId = surveyQuestion.SurveyId and surveyPage.SurveyPageId and surveyQuestion.IsDeleted=false"
      )
      .leftJoinAndMapOne(
        "surveyQuestion.Language",
        SurveyQuestionLanguageEntity,
        "languageQuestion",
        `surveyQuestion.SurveyQuestionId=languageQuestion.SurveyQuestionId and languageQuestion.LanguageId=${languageId}`
      )
      .leftJoinAndMapMany(
        "surveyQuestion.ChildQuestion",
        SurveyQuestionEntity,
        "question",
        "surveyQuestion.SurveyQuestionId=question.ParentQuestionId and question.IsDeleted=false"
      )
      .leftJoinAndMapOne(
        "question.Language",
        SurveyQuestionLanguageEntity,
        "languageChildQuestion",
        `question.SurveyQuestionId=languageChildQuestion.SurveyQuestionId and languageChildQuestion.LanguageId=${languageId}`
      )
      .leftJoinAndMapMany(
        "surveyQuestion.SurveyQuestionOption",
        SurveyQuestionOptionEntity,
        "surveyQuestionOption",
        "surveyQuestion.SurveyQuestionId=surveyQuestionOption.SurveyQuestionId and surveyQuestionOption.IsDeleted=false"
      )
      .leftJoinAndMapOne(
        "surveyQuestionOption.Language",
        SurveyQuestionOptionLanguageEntity,
        "languageQuestionOption",
        `surveyQuestionOption.SurveyQuestionOptionId=languageQuestionOption.SurveyQuestionOptionId and languageQuestion.LanguageId=${languageId}`
      )
      .where(queryObject)
      .orderBy({ "surveyPage.PageOrder": "ASC" })
      .addOrderBy("surveyQuestion.SortOrder", "ASC")
      .addOrderBy("question.SurveyQuestionId", "ASC")
      .addOrderBy("surveyQuestionOption.SurveyQuestionOptionId", "ASC")
      .getMany();
    return response;
  }

  async getAll(queryObject: any) {
    let queryStr: string = "";
    queryStr = "survey.IsDeleted = :IsDeleted";

    queryObject.SurveyStatusId
      ? (queryObject["SurveyStatusId"] = parseInt(queryObject.SurveyStatusId))
      : false;
    queryObject.SurveyStatusId
      ? (queryStr =
          queryStr +
          (queryStr ? " AND " : "") +
          "survey.SurveyStatusId = :SurveyStatusId")
      : false;

    queryObject.Name
      ? (queryObject["Name"] = "%" + queryObject.Name + "%")
      : false;
    queryObject.Name
      ? (queryStr =
          queryStr + (queryStr ? " AND " : "") + "survey.Name like :Name")
      : false;

    queryObject.Client
      ? (queryObject["survey.Client.Name"] = "%" + queryObject.Client + "%")
      : false;
    queryObject.Client
      ? (queryStr =
          queryStr +
          (queryStr ? " AND " : "") +
          "ClientEntity.Name like :survey.Client.Name")
      : false;
    queryObject.Client ? delete queryObject.Client : false;

    queryObject.StartDate
      ? (queryObject["CreatedOnStart"] = queryObject.StartDate)
      : false;
    queryObject.StartDate
      ? (queryStr =
          queryStr +
          (queryStr ? " AND " : "") +
          "survey.CreatedOn >= :CreatedOnStart")
      : false;
    queryObject.StartDate ? delete queryObject.StartDate : false;

    queryObject.EndDate
      ? (queryStr =
          queryStr +
          (queryStr ? " AND " : "") +
          "survey.CreatedOn <= :CreatedOnEnd")
      : false;
    queryObject.EndDate
      ? (queryObject["CreatedOnEnd"] = new Date(
          new Date(queryObject.EndDate).setHours(23, 59, 59, 999)
        ))
      : false;
    queryObject.EndDate ? delete queryObject.EndDate : false;
    let query = getManager()
      .getRepository(SurveyEntity)
      .createQueryBuilder("survey")
      .select([
        "survey",
        "SurveyStatusEntity.Name",
        "SurveyThemeEntity.Name",
        "ClientEntity.Name"
      ])
      .innerJoin("survey.SurveyStatus", "SurveyStatusEntity")
      .innerJoin("survey.SurveyTheme", "SurveyThemeEntity")
      .innerJoin("survey.Client", "ClientEntity")
      .orderBy({ CreatedOn: "DESC" })
      .where(queryStr, queryObject);
    let response = query.getMany();
    return response;
  }

  async delete(Id: number) {
    let queryObject = { SurveyId: Id };
    let result = await Promise.all([
      this.deleteSurvey(queryObject),
      this.deleteSurveyPage(queryObject),
      this.deleteSurveyQuestion(queryObject),
      this.deleteSurveyQuestionOption(queryObject)
    ]);
    return result;
  }

  async deleteSurvey(queryObject: any) {
    return getManager()
      .getRepository(SurveyEntity)
      .update(queryObject, { IsDeleted: true });
  }

  async deleteSurveyPage(queryObject: any) {
    return getManager()
      .getRepository(SurveyPageEntity)
      .update(queryObject, { IsDeleted: true });
  }

  async deleteSurveyQuestion(queryObject: any) {
    return getManager()
      .getRepository(SurveyQuestionEntity)
      .update(queryObject, { IsDeleted: true });
  }

  async deleteSurveyQuestionOption(queryObject: any) {
    return getManager()
      .getRepository(SurveyQuestionOptionEntity)
      .update(queryObject, { IsDeleted: true });
  }

  update(Id: number, updateQueryObject: Survey) {
    return getManager()
      .getRepository(SurveyEntity)
      .createQueryBuilder("survey")
      .update({ SurveyId: Id })
      .set({ ...updateQueryObject })
      .where({ SurveyId: Id })
      .execute();
  }

  getStatus() {
    return getManager()
      .getRepository(SurveyStatusEntity)
      .find();
  }

  async getResponse(queryObject: any) {
    const response = await getManager()
      .getRepository(SurveyResponseEntity)
      .createQueryBuilder("surveyResponse")
      .leftJoinAndMapMany(
        "surveyResponse.selector",
        SurveySelectorEntity,
        "selector",
        "surveyResponse.SurveySelectorId=selector.SurveySelectorId"
      )
      .leftJoinAndMapOne(
        "surveyResponse.Question",
        "SurveyQuestionEntity",
        "question",
        "surveyResponse.SurveyQuestionId=question.SurveyQuestionId"
      )
      .leftJoinAndMapOne(
        "question.Scale",
        "SurveyQuestionScaleTypeEntity",
        "scale",
        "question.ScaleTypeId=scale.SurveyQuestionScaleTypeId"
      )
      .leftJoinAndMapMany(
        "surveyResponse.ResponseLink",
        SurveyResponseLinkEntity,
        "response",
        "surveyResponse.SurveyResponseId=response.SurveyResponseId and response.IsDeleted=false"
      )
      .leftJoinAndMapOne(
        "response.QuetionMatrixText",
        "SurveyQuestionEntity",
        "matrix",
        "response.MatrixTypeId=3 and response.MatrixTableRecordId=matrix.SurveyQuestionId"
      )
      .leftJoinAndMapMany(
        "response.Selectee",
        SurveySelecteeEntity,
        "selectee",
        "(response.MatrixTypeId=1 or response.MatrixTypeId=2) and response.MatrixTableRecordId=selectee.SurveySelecteeId"
      )
      .select([
        "selector.SurveySelectorId",
        "selector.Email",
        "surveyResponse.SurveyQuestionId",
        "matrix.Name",
        "scale.Name",
        "question.Name",
        "question.ScaleTypeId",
        "question.MatrixTypeId",
        "response",
        "selectee.SurveySelecteeId",
        "selectee.Email"
      ])
      .where(queryObject)
      .getMany();
    return response;
  }

  async clearResponse(queryObject: any) {
    let getResponseIdList = await this.getResponseBySurveyId(queryObject);
    let clearRelsponseLink = await Promise.all(
      getResponseIdList.map(async (q) => {
        return await getManager()
          .getRepository(SurveyResponseLinkEntity)
          .update(
            { SurveyResponseId: q.SurveyResponseId },
            { IsDeleted: true }
          );
      })
    );
    let result = await getManager()
      .getRepository(SurveyResponseEntity)
      .update(queryObject, { IsDeleted: true });
    return result;
  }
  async getResponseBySurveyId(queryObject: any) {
    return await getManager()
      .getRepository(SurveyResponseEntity)
      .find(queryObject);
  }
}
