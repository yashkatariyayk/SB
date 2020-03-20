import { Request, Response } from "express";
import { CommonService } from "../common/common-service";
import CommonMessage from "../common/response-message-config";
import { SurveyLanguageRepo } from "../repositories/survey-language-repository";
import { StaticContentLanguage } from "../models/static-content-language";
import { SurveySelecteeLanguage } from "../models/survey-selectee-language";
import { EmailTemplateLanguage } from "../models/emailTemplateLanguage";
import { SurveyLanguage } from "../models/survey-language";
import { SurveyPageLanguage } from "../models/survey-page-language";
import { SurveyQuestionLanguage } from "../models/survey-question-language";
import { SurveyQuestionOptionLanguage } from "../models/survey-question-option-language";

let surveyLanguageRepo: SurveyLanguageRepo = new SurveyLanguageRepo();
let commonMessage = new CommonMessage();
let commonService = new CommonService();

export let saveStaticContentMultiLanguage = async (
  req: Request,
  res: Response
) => {
  try {
    let queryObject: StaticContentLanguage[] = [];
    queryObject = req.body;
    surveyLanguageRepo.saveStaticContent(queryObject).then((result) => {
      let response = commonService.setResponse(
        false,
        commonMessage._DefaultSuccessMsg,
        result,
        ""
      );
      res.send(response);
    });
  } catch (error) {
    let response = commonService.setResponse(
      true,
      commonMessage._DefaultErrorMessage,
      "",
      ""
    );
    res.send(response);
  }
};

export let saveSelecteeMultiLanguage = async (req: Request, res: Response) => {
  try {
    //   console.log('SelecteeMultiLanguage', req.body);
    let queryObject: SurveySelecteeLanguage[] = [];
    queryObject = req.body;
    surveyLanguageRepo.saveSelectee(queryObject).then((result) => {
      let response = commonService.setResponse(
        false,
        commonMessage._DefaultSuccessMsg,
        result,
        ""
      );
      res.send(response);
    });
  } catch (error) {
    let response = commonService.setResponse(
      true,
      commonMessage._DefaultErrorMessage,
      "",
      ""
    );
    res.send(response);
  }
};

export let saveEmailTemplateMultiLanguage = async (
  req: Request,
  res: Response
) => {
  try {
    let queryObject: EmailTemplateLanguage[] = [];
    queryObject = req.body;
    surveyLanguageRepo.saveEmailTemplate(queryObject).then((result) => {
      let response = commonService.setResponse(
        false,
        commonMessage._DefaultSuccessMsg,
        result,
        ""
      );
      res.send(response);
    });
  } catch (error) {
    let response = commonService.setResponse(
      true,
      commonMessage._DefaultErrorMessage,
      "",
      ""
    );
    res.send(response);
  }
};

export let saveSurveyMultiLanguage = async (req: Request, res: Response) => {
  try {
    let queryObject: any = [];
    let queryObjectSurvey: SurveyLanguage[] = req.body.Survey;
    let queryObjectSurveyPages: SurveyPageLanguage[] = req.body.SurveyPage;
    let queryObjectSurveyQuestions: SurveyQuestionLanguage[] =
      req.body.SurveyQuestions;
    let queryObjectSurveyQuestionOptions: SurveyQuestionOptionLanguage[] =
      req.body.SurveyQuestionOptions;
    queryObject.push({ name: "survey", data: queryObjectSurvey });
    queryObject.push({ name: "page", data: queryObjectSurveyPages });
    queryObject.push({ name: "question", data: queryObjectSurveyQuestions });
    queryObject.push({
      name: "option",
      data: queryObjectSurveyQuestionOptions
    });
    surveyLanguageRepo.saveSurvey(queryObject).then((result) => {
      let response = commonService.setResponse(
        false,
        commonMessage._DefaultSuccessMsg,
        result,
        ""
      );
      res.send(response);
    });
  } catch (error) {
    let response = commonService.setResponse(
      true,
      commonMessage._DefaultErrorMessage,
      "",
      ""
    );
    res.send(response);
  }
};
