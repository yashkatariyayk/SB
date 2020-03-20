import { Request, Response } from "express";
import { AuthRepo } from "../repositories/auth-repository";
import { CommonService } from "../common/common-service";
import Auth from "../common/auth-config";
import CommonMessage from "../common/response-message-config";
import * as jwt from "jsonwebtoken";
import { Base64 } from "js-base64";
import { User } from "../models/user";

export let getToken = async (req: Request, res: Response) => {
  let authRepo: AuthRepo = new AuthRepo();
  let email = req.body.User.UserName;
  let decodedData = Base64.decode(req.body.User.Password);

  console.log("CheckEmail", email);
  console.log("CheckPassword", decodedData);

  let password = decodedData;
  authRepo.checkEmail(email).then((result: User) => {
    let commonMessage = new CommonMessage();
    let commonService = new CommonService();
    console.log(result);
    console.log("authentication successfull", result);

    if (result) {
      let user = result;
      Auth.compare(
        password,
        user.Password,
        (error: string | null, match: boolean | null) => {
          var payload = { id: result.UserId };
          var token = jwt.sign(payload, "HS256", {
            expiresIn: "1d"
          });
          let response = commonService.setResponse(
            false,
            commonMessage._EmailAuthorizedSuccessMsg,
            result,
            token
          );
          res.send(response);
          //   if (error) {
          //     let response = commonService.setResponse(
          //       true,
          //       commonMessage._UnAuthorizedUser,
          //       "",
          //       ""
          //     );
          //     res.send(response);
          //   } else {
          //     var payload = { id: result.UserId };
          //     var token = jwt.sign(payload, "HS256", {
          //       expiresIn: "1d"
          //     });
          //     let response = commonService.setResponse(
          //       false,
          //       commonMessage._EmailAuthorizedSuccessMsg,
          //       result,
          //       token
          //     );
          //     res.send(response);
          //   }
        }
      );
    } else {
      let response = commonService.setResponse(
        true,
        commonMessage._UnAuthorizedUser,
        "",
        ""
      );
      res.send(response);
    }
  });
};
