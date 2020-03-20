import { Request, Response } from "express";
import { CommonService } from "../common/common-service";
import CommonMessage from "../common/response-message-config";
import { ConfigRepo } from "../repositories/config-repository";

let configRepo: ConfigRepo = new ConfigRepo();
let commonMessage = new CommonMessage();
let commonService = new CommonService();

export let getConfig = async (req: Request, res: Response) => {
  try {
    configRepo.getEmailCount().then((result) => {
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
