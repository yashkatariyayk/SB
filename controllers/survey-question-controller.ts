import { Request, Response } from "express";
import { CommonService } from "../common/common-service";
import CommonMessage from "../common/response-message-config";
import { SurveyQuestion } from "../models/survey-question";
import { SurveyQuestionOption } from "../models/survey-question-option";
import { SurveyQuestionRepo } from "../repositories/survey-question-repository";

let surveyQuestionRepo: SurveyQuestionRepo = new SurveyQuestionRepo();
let commonMessage = new CommonMessage();
let commonService = new CommonService();
let queryObjectQ: SurveyQuestion[] = [];
let queryObjectQO: SurveyQuestionOption[] = [];

export let saveSurveyQuestion = async (req: Request, res: Response) => {
  queryObjectQ = req.body.Question;
  queryObjectQO = req.body.Option;
  let firstQuestion = queryObjectQ.splice(0, 1);
  let secondQuestionArr: SurveyQuestion[] = queryObjectQ;
  try {
    surveyQuestionRepo
      .save(firstQuestion, secondQuestionArr, queryObjectQO)
      .then((result) => {
        if (result) {
          let response = commonService.setResponse(
            false,
            commonMessage._DefaultSuccessMsg,
            result,
            ""
          );
          res.send(response);
        }
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

export let getSurveyQuestion = async (req: Request, res: Response) => {
  let queryObject: SurveyQuestion = new SurveyQuestion();
  req.query.questionId
    ? (queryObject.SurveyQuestionId = parseInt(req.query.questionId))
    : false;
  req.query.surveyId
    ? (queryObject.SurveyId = parseInt(req.query.surveyId))
    : false;
  queryObject.IsDeleted = false;
  try {
    await surveyQuestionRepo.get(queryObject).then(async (result) => {
      if (result) {
        let response = commonService.setResponse(
          false,
          commonMessage._DefaultSuccessMsg,
          result,
          ""
        );
        res.send(response);
      }
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

export let deleteSurveyQuestion = async (req: Request, res: Response) => {
  try {
    let queryObject: SurveyQuestion = new SurveyQuestion();
    queryObject.SurveyQuestionId = parseInt(req.query.questionId);
    surveyQuestionRepo.delete(queryObject).then((result) => {
      let response = commonService.setResponse(
        false,
        commonMessage._SuccessDeleteMsg,
        "",
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

export let updateSurveyQuestion = async (req: Request, res: Response) => {
  try {
    queryObjectQ = req.body.Question;
    queryObjectQO = req.body.Option;
    let result = surveyQuestionRepo
      .update(queryObjectQ, queryObjectQO)
      .then((result) => {
        let response = commonService.setResponse(
          false,
          commonMessage._SuccessUpdateMsg,
          "",
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

export let deleteOption = async (req: Request, res: Response) => {
  try {
    let queryObject = new SurveyQuestionOption();
    queryObject.SurveyQuestionOptionId = parseInt(req.query.id);
    surveyQuestionRepo.deleteOption(queryObject).then((result) => {
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
