import { Request, Response } from "express";
import { CommonService } from "../common/common-service";
import CommonMessage from "../common/response-message-config";
import { LanguageRepo } from "../repositories/language-repository";
import { Language } from "../models/language";

let languageRepo: LanguageRepo = new LanguageRepo();
let commonMessage = new CommonMessage();
let commonService = new CommonService();
let queryObject = new Language();
export let saveLanguage = async (req: Request, res: Response) => {
  queryObject = req.body;
  try {
    languageRepo.save(queryObject).then((result) => {
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

export let getLanguage = async (req: Request, res: Response) => {
  try {
    languageRepo.get().then((result) => {
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

export let deleteLanguage = async (req: Request, res: Response) => {
  queryObject.LanguageId = req.query.id;
  try {
    languageRepo.delete(queryObject).then((result) => {
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
