import { Request, Response } from "express";
import { CommonService } from "../common/common-service";
import CommonMessage from "../common/response-message-config";
import { SurveySelector, SurveySelectorIds } from "../models/survey-selector";
import { ImportSelector } from "../models/import-selector";
import { SurveySelectorRepo } from "../repositories/survey-selector-repository";
import * as uniqid from "uniqid";

let surveySelectorRepo: SurveySelectorRepo = new SurveySelectorRepo();
let commonMessage = new CommonMessage();
let commonService = new CommonService();
let queryObjectS: SurveySelector[];
let queryObject: SurveySelector = new SurveySelector();
let queryObjectSD: ImportSelector = new ImportSelector();

export let saveSurveySelector = async (req: Request, res: Response) => {
  try {
    queryObjectS = req.body.Selector;
    // console.log('Selector', queryObjectS[0]);
    queryObjectS.forEach((element) => {
      element.SurveyId = req.body.SurveyId;
      element.SurveySelectorStatusId = 3;
      element.Hash = uniqid.process();
      let index = queryObjectS.indexOf(element);
      queryObjectS[index] = element;
    });
    queryObjectSD.SurveyId = req.body.SurveyId;
    queryObjectSD.LastImportedDate = req.body.LastImportedDate;

    surveySelectorRepo.save(queryObjectS, queryObjectSD).then((result) => {
      let response = commonService.setResponse(
        false,
        commonMessage._DefaultSuccessMsg,
        result,
        ""
      );
      res.send(response);
    });
  } catch (error) {
    console.log(error);
    let response = commonService.setResponse(
      true,
      commonMessage._DefaultErrorMessage,
      "",
      ""
    );
    res.send(response);
  }
};

export let getSurveySelector = async (req: Request, res: Response) => {
  let queryObject: SurveySelector = new SurveySelector();
  let limit: number = req.body.limit ? parseInt(req.body.limit) : null;
  let skip: number = req.body.skip ? parseInt(req.body.skip) : null;
  delete req.body.limit;
  delete req.body.skip;
  queryObject = req.body;
  queryObject.SurveyId = parseInt(req.params.surveyId);
  req.body.SurveySelectorStatusId
    ? (queryObject.SurveySelectorStatusId = parseInt(
        req.body.SurveySelectorStatusId
      ))
    : false;
  try {
    surveySelectorRepo.get(queryObject, limit, skip).then((result) => {
      let mappedRes: any = {};
      result[0].length > 0
        ? (mappedRes["Selector"] = result[0])
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

export let updateSurveySelector = async (req: Request, res: Response) => {
  let queryObject = new SurveySelector();
  queryObject = req.body;
  try {
    surveySelectorRepo.update(queryObject).then((result) => {
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

export let deleteSurveySelector = async (req: Request, res: Response) => {
  req.query.selectorId
    ? (queryObject.SurveySelectorId = parseInt(req.query.selectorId))
    : (queryObject.SurveyId = parseInt(req.query.surveyId));
  try {
    surveySelectorRepo.delete(queryObject).then((result) => {
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

export let deleteMultipleSurveySelector = async (
  req: Request,
  res: Response
) => {
  let queryObject: SurveySelectorIds = new SurveySelectorIds();
  let filterObject: SurveySelector = new SurveySelector();
  let IsAllSelected: boolean;
  let SurveyId: number;
  req.body.IsAllSelected ? (IsAllSelected = true) : false;
  req.body.SurveyId ? (SurveyId = req.body.SurveyId) : false;
  req.body.filterObject ? (filterObject = req.body.filterObject) : false;
  req.body.selectorIds
    ? (queryObject.SurveySelectorId = req.body.selectorIds)
    : false;
  try {
    surveySelectorRepo
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
