import { Request, Response } from "express";
import { CommonService } from "../common/common-service";
import CommonMessage from "../common/response-message-config";
import { EmailTemplateRepo } from "../repositories/email-template-repository";
import { EmailLogRepo } from "../repositories/email-log-repository";
import { EmailTemplate } from "../models/emailTemplate";
import { EmailLog } from "../models/emailLog";
import { EmailConfig } from "../models/emailConfig";
import { SurveySelector, SurveySelectorIds } from "../models/survey-selector";

let emailTemplateRepo: EmailTemplateRepo = new EmailTemplateRepo();
let emailLogRepo: EmailLogRepo = new EmailLogRepo();
let commonMessage = new CommonMessage();
let commonService = new CommonService();

export let getEmailTemplate = async (req: Request, res: Response) => {
  try {
    let languageId = req.query.languageId
      ? parseInt(req.query.languageId)
      : null;
    emailTemplateRepo.get(languageId).then((result) => {
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

export let getEmailTemplateById = async (req: Request, res: Response) => {
  try {
    let queryObject: any = {};
    queryObject["EmailTemplateId"] = req.params.id;
    let languageId = req.params.languageId ? req.params.languageId : 0;
    emailTemplateRepo.getById(queryObject, languageId).then((result) => {
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

export let sendEmail = async (req: Request, res: Response) => {
  let queryObject = req.body.Selector;
  try {
    emailTemplateRepo.send(queryObject).then((result: any) => {
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

export let saveEmailLog = async (req: Request, res: Response) => {
  let queryObject: EmailLog[] = [];
  let filterObject: SurveySelector = new SurveySelector();
  let unchecked: SurveySelectorIds[] = [];
  let IsAllSelected: boolean;
  let SurveyId: number;
  let Subject: string;
  let Body: string;
  req.body.IsAllSelected ? (IsAllSelected = true) : false;
  req.body.SurveyId ? (SurveyId = req.body.SurveyId) : false;
  req.body.SurveySelectorIds ? (unchecked = req.body.SurveySelectorIds) : false;
  req.body.filterObject ? (filterObject = req.body.filterObject) : false;
  req.body.Selector ? (queryObject = req.body.Selector) : false;
  req.body.Subject ? (Subject = req.body.Subject) : false;
  req.body.Body ? (Body = req.body.Body) : false;
  try {
    emailLogRepo
      .save(
        queryObject,
        unchecked,
        IsAllSelected,
        SurveyId,
        filterObject,
        Subject,
        Body
      )
      .then((result: any) => {
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

export let getEmailConfig = async (req: Request, res: Response) => {
  try {
    let isAll: boolean;
    if (parseInt(req.params.isAll) == 1) isAll = true;
    if (parseInt(req.params.isAll) == 0) isAll = false;
    emailTemplateRepo.getEmailConfig(isAll).then((result: any) => {
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

export let updateEmailConfig = async (req: Request, res: Response) => {
  let queryObject: EmailConfig = new EmailConfig();
  queryObject.EmailConfigId = parseInt(req.params.id);
  try {
    emailTemplateRepo.updateEmailConfig(queryObject).then((result: any) => {
      let response = commonService.setResponse(
        false,
        commonMessage._DefaultSuccessMsg,
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
