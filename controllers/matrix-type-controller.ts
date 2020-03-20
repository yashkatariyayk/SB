import { Request, Response } from "express";
import { CommonService } from "../common/common-service";
import CommonMessage from "../common/response-message-config";
import { MatrixTypeRepo } from "../repositories/matrix-type-repository";

let matrixTypeRepo: MatrixTypeRepo = new MatrixTypeRepo();
let commonMessage = new CommonMessage();
let commonService = new CommonService();

export let getMatrixType = async (req: Request, res: Response) => {
  try {
    matrixTypeRepo.get().then((result) => {
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
