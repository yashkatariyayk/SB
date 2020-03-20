import { Request, Response } from "express";
import { CommonService } from "../common/common-service";
import CommonMessage from "../common/response-message-config";
import { SurveyPageRepo } from "../repositories/survey-page-repository";
import { SurveyPage } from "../models/survey-page";
let surveyPageRepo: SurveyPageRepo = new SurveyPageRepo();
let commonMessage = new CommonMessage();
let commonService = new CommonService();
export let saveSurveyPage = async (req: Request, res: Response) => {
  let queryObject = new SurveyPage();
  queryObject = req.body;
  try {
    surveyPageRepo.save(queryObject).then((result) => {
      let response = commonService.setResponse(
        false,
        commonMessage._DefaultSuccessMsg,
        result,
        ""
      );
      res.send(response);
    });
  } catch (error) {
    res.send(commonMessage._DefaultErrorMessage);
  }
};

export let getSurveyPage = async (req: Request, res: Response) => {
  let queryObject = new SurveyPage();
  queryObject = new SurveyPage();
  queryObject.SurveyId = parseInt(req.query.SurveyId);
  queryObject.IsDeleted = false;
  if (req.query.SurveyPageId) {
    queryObject.SurveyPageId = req.query.SurveyPageId;
  }
  try {
    surveyPageRepo.get(queryObject).then((result) => {
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

export let updateSurveyPage = async (req: Request, res: Response) => {
  let queryObject = new SurveyPage();
  queryObject = req.body;
  try {
    surveyPageRepo.update(queryObject).then((result) => {
      let response = commonService.setResponse(
        false,
        commonMessage._SuccessUpdateMsg,
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

export let deleteSurveyPage = async (req: Request, res: Response) => {
  let queryObject = new SurveyPage();
  queryObject.SurveyPageId = parseInt(req.query.id);
  queryObject.PageOrder = parseInt(req.query.PageOrder);
  try {
    surveyPageRepo.delete(queryObject).then((result) => {
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
