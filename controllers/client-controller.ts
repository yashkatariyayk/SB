import { error } from "util";
import { Request, Response } from "express";
import { CommonService } from "../common/common-service";
import CommonMessage from "../common/response-message-config";
import { ClientRepo } from "../repositories/client-repository";

let clientRepo: ClientRepo = new ClientRepo();
let commonMessage = new CommonMessage();
let commonService = new CommonService();

// export let getUser = async (req: Request, res: Response) => {
//   try {
//     clientRepo.get().then((result) => {
//       let response = commonService.setResponse(
//         false,
//         commonMessage._DataSuccessMsg,
//         result,
//         ""
//       );
//       res.send(response);
//     });
//   } catch (error) {
//     let response = commonService.setResponse(
//       true,
//       commonMessage._DefaultErrorMessage,
//       "",
//       ""
//     );
//     res.send(response);
//   }
// };

export let getClient = async (req: Request, res: Response) => {
  try {
    clientRepo.get().then((result) => {
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
