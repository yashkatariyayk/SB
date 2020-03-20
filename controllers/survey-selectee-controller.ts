import { Request, Response } from "express";
import { CommonService } from "../common/common-service";
import CommonMessage from "../common/response-message-config";
import { SurveySelecteeRepo } from "../repositories/survey-selectee-repository";
import { SurveySelectee, SurveySelecteeIds } from "../models/survey-selectee";
import { ImportSelectee } from "../models/import-selectee";

let surveySelecteeRepo: SurveySelecteeRepo = new SurveySelecteeRepo();
let commonMessage = new CommonMessage();
let commonService = new CommonService();
let queryObjectS: SurveySelectee[];
let queryObject: SurveySelectee = new SurveySelectee();
let queryObjectSD: ImportSelectee = new ImportSelectee();

export let saveSurveySelectee = async (req: Request, res: Response) => {
  queryObjectS = req.body.Selectee;
  queryObjectS.forEach((element) => {
    element.SurveyId = req.body.SurveyId;
    let index = queryObjectS.indexOf(element);
    queryObjectS[index] = element;
  });
  queryObjectSD.SurveyId = req.body.SurveyId;
  queryObjectSD.LastImportedDate = req.body.LastImportedDate;
  try {
    surveySelecteeRepo.save(queryObjectS, queryObjectSD).then((result) => {
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

export let getSurveySelectee = async (req: Request, res: Response) => {
  let queryObject: SurveySelectee = new SurveySelectee();
  let limit: number = req.body.limit ? parseInt(req.body.limit) : null;
  let skip: number = req.body.skip;
  let languageId = req.query.languageId ? parseInt(req.query.languageId) : null;
  delete req.body.limit;
  delete req.body.skip;
  queryObject = req.body;
  queryObject.SurveyId = parseInt(req.params.surveyId);
  try {
    surveySelecteeRepo
      .get(queryObject, limit, skip, languageId)
      .then((result) => {
        let mappedRes: any = {};
        result[0].length > 0
          ? (mappedRes["Selectee"] = result[0])
          : (mappedRes = []);
        result[1]
          ? (mappedRes["LastImportedDate"] = result[1].LastImportedDate)
          : (mappedRes = []);
        result[2] ? (mappedRes["Total"] = result[2]) : (mappedRes = []);
        let response = commonService.setResponse(
          false,
          commonMessage._DefaultSuccessMsg,
          mappedRes,
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

export let updateSurveySelectee = async (req: Request, res: Response) => {
  let queryObject = new SurveySelectee();
  queryObject = req.body;
  try {
    surveySelecteeRepo.update(queryObject).then((result) => {
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

export let deleteSurveySelectee = async (req: Request, res: Response) => {
  req.query.selecteeId
    ? (queryObject.SurveySelecteeId = parseInt(req.query.selecteeId))
    : (queryObject.SurveyId = parseInt(req.query.surveyId));
  try {
    surveySelecteeRepo.delete(queryObject).then((result) => {
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

export let deleteMultipleSurveySelectee = async (
  req: Request,
  res: Response
) => {
  let queryObject: SurveySelecteeIds = new SurveySelecteeIds();
  let filterObject: SurveySelectee = new SurveySelectee();
  let IsAllSelected: boolean;
  let SurveyId: number;
  req.body.IsAllSelected ? (IsAllSelected = true) : false;
  req.body.SurveyId ? (SurveyId = req.body.SurveyId) : false;
  req.body.filterObject ? (filterObject = req.body.filterObject) : false;
  req.body.selecteeIds
    ? (queryObject.SurveySelecteeId = req.body.selecteeIds)
    : false;
  try {
    surveySelecteeRepo
      .deleteMultiple(queryObject, IsAllSelected, SurveyId, filterObject)
      .then((result) => {
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
