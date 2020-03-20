import { CommonResponse } from "../models/response";
export class CommonService {
  setResponse(isError: boolean, message: string, data: any, token: string) {
    let response = new CommonResponse();
    return (response = {
      StatusCode: isError ? 500 : 200,
      Status: isError ? "error" : "success",
      Message: message,
      Data: data ? data : [],
      Token: token ? token : ""
    });
  }
  toUTCDateTime(dateTime: string) {
    if (dateTime) {
      return new Date(dateTime)
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
    } else {
      return new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
    }
  }
}
