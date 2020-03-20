import { Request, Response } from "express";
import { CommonService } from "../common/common-service";
import CommonMessage from "../common/response-message-config";
import { QuestionScaleTypeRepo } from "../repositories/survey-question-scale-type-repository";

let questionScaleTypeRepo: QuestionScaleTypeRepo = new QuestionScaleTypeRepo();
let commonMessage = new CommonMessage();
let commonService = new CommonService();

export let getQuestionScaleType = async (req: Request, res: Response) => {
  try {
    questionScaleTypeRepo.get().then((result) => {
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

export let getQuestionScaleBank = async (req: Request, res: Response) => {
  try {
    questionScaleTypeRepo.getScaleBank().then((result) => {
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
