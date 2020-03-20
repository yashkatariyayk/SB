import { Request, Response } from "express";
import * as fs from "fs";
import { CommonService } from "../common/common-service";
import CommonMessage from "../common/response-message-config";
import { Survey } from "../models/survey";
import { SurveyRepo } from "../repositories/survey-repository";
import { SurveyStatusRepo } from "../repositories/survey-status-repository";
import { SurveyStaticContentRepo } from "../repositories/survey-static-content-repository";
import { StaticContent } from "../models/static-content";
import { log } from "util";

let surveyRepo: SurveyRepo = new SurveyRepo();
let surveyStaticContentRepo: SurveyStaticContentRepo = new SurveyStaticContentRepo();
let surveyStatusRepo: SurveyStatusRepo = new SurveyStatusRepo();
let commonMessage = new CommonMessage();
let commonService = new CommonService();

export let createSurvey = async (req: Request, res: Response) => {
  let queryObject = new Survey();
  queryObject = req.body;
  queryObject["CreatedBy"] = "Admin";
  queryObject["CreatedOn"] = commonService.toUTCDateTime("");
  queryObject["SurveyStatusId"] = 3;
  queryObject["ThemeId"] = 1;
  req.body.ClientId ? false : (queryObject["ClientId"] = 1);
  try {
    surveyRepo.add(queryObject).then((result) => {
      let response = commonService.setResponse(
        false,
        // commonMessage._SuccessMsg,
        commonMessage._SuccessMsg,
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

export let copySurvey = async (req: Request, res: Response) => {
  let queryObject = new Survey();
  queryObject["Name"] = "Copy Of - " + req.body.Name;
  queryObject["CreatedBy"] = "Admin";
  queryObject["CreatedOn"] = commonService.toUTCDateTime("");
  queryObject["SurveyStatusId"] = 3;
  queryObject["ClientId"] = req.body.ClientId;
  queryObject["ThemeId"] = 1;
  try {
    surveyRepo.copy(queryObject, req.body.SurveyId).then((result) => {
      let response = commonService.setResponse(
        false,
        commonMessage._SuccessMsg,
        { SurveyId: result.SurveyId },
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

export let getSurvey = async (req: Request, res: Response) => {
  try {
    let queryObject: Survey = new Survey();
    queryObject.SurveyId = parseInt(req.query.id);
    let languageId = 0;
    req.query.languageId
      ? (languageId = parseInt(req.query.languageId))
      : false;
    queryObject.IsDeleted = false;
    surveyRepo.get(queryObject, languageId).then((result) => {
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

export let getAllSurvey = async (req: Request, res: Response) => {
  let queryObject: any = new Object();
  req.body ? (queryObject = req.body) : false;
  queryObject.IsDeleted = false;
  try {
    surveyRepo.getAll(queryObject).then((result) => {
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

export let deleteSurvey = async (req: Request, res: Response) => {
  let Id = req.query.id;
  try {
    surveyRepo.delete(Id).then((result) => {
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

export let updateSurvey = async (req: Request, res: Response) => {
  let Id = req.query.id;
  let updateObject: Survey = req.body;
  if (req.file) {
    updateObject.LogoName = req.file.filename;
  }
  if (
    req.body.OldLogoName &&
    fs.existsSync("./uploads/" + req.body.OldLogoName)
  ) {
    fs.unlinkSync("./uploads/" + req.body.OldLogoName);
  }
  try {
    surveyRepo.update(Id, updateObject).then((result) => {
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

export let getSurveyStatus = async (req: Request, res: Response) => {
  try {
    surveyStatusRepo.get().then((result) => {
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

export let getSurveyResponse = async (req: Request, res: Response) => {
  try {
    let queryObject: any = {};
    queryObject.SurveyId = parseInt(req.params.id);
    queryObject.SurveySelectorStatusId = 1;
    queryObject.IsDeleted = false;
    surveyRepo.getResponse(queryObject).then((result) => {
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

export let clearResponse = async (req: Request, res: Response) => {
  try {
    let queryObject: any = {};
    queryObject.SurveyId = parseInt(req.params.surveyId);
    surveyRepo.clearResponse(queryObject).then((result) => {
      let response = commonService.setResponse(
        false,
        commonMessage._SuccessDeleteMsg,
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

export let getSurveyStaticContent = async (req: Request, res: Response) => {
  try {
    let languageId = req.query.languageId
      ? parseInt(req.query.languageId)
      : null;
    let surveyId = req.query.surveyId ? parseInt(req.query.surveyId) : null;
    surveyStaticContentRepo.get(languageId, surveyId).then((result) => {
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

export let saveSurveyStaticContent = async (req: Request, res: Response) => {
  try {
    let queryObject: StaticContent[] = [];
    for (let i = 0; i <= 100; i++) {
      let arrayObj: StaticContent = new StaticContent();
      arrayObj.Code = i.toString();
      arrayObj.Name = i.toString();
      arrayObj.Value = i.toString();
      queryObject.push(arrayObj);
    }
    surveyStaticContentRepo.save(queryObject).then((result) => {
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
