import { getManager } from "typeorm";
import { EmailLogEntity } from "../entities/emailLog-entity";
import { EmailLog } from "../models/emailLog";
import { SurveySelector, SurveySelectorIds } from "../models/survey-selector";
import { SurveySelectorEntity } from "../entities/surveySelector-entity";
import { SurveySelectorStatusEntity } from "../entities/surveySelectorStatus-entity";

export class EmailLogRepo {
  async save(
    queryObject: EmailLog[],
    unchecked?: SurveySelectorIds[],
    IsAllSelected?: boolean,
    SurveyId?: number,
    filterObject?: SurveySelector,
    Subject?: string,
    Body?: string
  ) {
    if (
      queryObject &&
      queryObject.length > 0 &&
      (IsAllSelected == false || !IsAllSelected)
    ) {
      let result = await this.saveEmailLog(queryObject);
      let statusUpdate = await this.updateStatus(queryObject);
      return result;
    } else {
      let selectors = await this.getselector(unchecked, SurveyId, filterObject);
      let mappedSelectors: any = [];
      await selectors.forEach(async (element: any) => {
        let object: any = {};
        let FinalBody: string = "";
        let body1 = this.replaceAll(Body, "@SendToUserName", element.FirstName);
        FinalBody = this.replaceAll(body1, "@HashKey", element.Hash);
        object["Subject"] = Subject;
        object["Body"] = FinalBody;
        object["Email"] = element.Email;
        object["Status"] = element.SurveySelectorStatusId;
        object["SurveySelectorId"] = element.SurveySelectorId;
        mappedSelectors.push(object);
      });
      let result = await this.saveEmailLog(mappedSelectors);
      let statusUpdate = await this.updateStatus(mappedSelectors);
      return result;
    }
  }
  replaceAll(originalString: string, find: string, replace: string) {
    return originalString.replace(new RegExp(find, "g"), replace);
  }
  async getselector(
    unchecked?: SurveySelectorIds[],
    SurveyId?: number,
    filterObject?: SurveySelector
  ) {
    let query = await getManager()
      .getRepository(SurveySelectorEntity)
      .createQueryBuilder("selector")
      .where("selector.SurveyId = :SurveyId", { SurveyId: SurveyId });
    query.andWhere("selector.IsDeleted = :IsDeleted", { IsDeleted: false });
    filterObject.FirstName
      ? query.andWhere("selector.FirstName like :FirstName", {
          FirstName: "%" + filterObject.FirstName + "%"
        })
      : false;
    filterObject.LastName
      ? query.andWhere("selector.LastName like :LastName", {
          LastName: "%" + filterObject.LastName + "%"
        })
      : false;
    filterObject.Email
      ? query.andWhere("selector.Email like :Email", {
          Email: "%" + filterObject.Email + "%"
        })
      : false;
    filterObject.Language
      ? query.andWhere("selector.Language = :Language", {
          Language: filterObject.Language
        })
      : false;
    filterObject.SurveySelectorStatusId
      ? query.andWhere(
          "selector.SurveySelectorStatusId = :SurveySelectorStatusId",
          {
            SurveySelectorStatusId: filterObject.SurveySelectorStatusId
          }
        )
      : false;
    if (unchecked && unchecked.length > 0) {
      query.andWhere("selector.SurveySelectorId NOT IN (:SurveySelectorId)", {
        SurveySelectorId: unchecked
      });
    }
    let result: any = [];
    result = await query.getMany();
    return result;
  }
  async saveEmailLog(queryObject: EmailLog[]) {
    return getManager()
      .getRepository(EmailLogEntity)
      .save(queryObject);
  }
  async updateStatus(queryObject: any[]) {
    await Promise.all(
      queryObject.map(async (element) => {
        return await getManager()
          .getRepository(SurveySelectorEntity)
          .update(
            { SurveySelectorId: element.SurveySelectorId },
            { SurveySelectorStatusId: 6 }
          );
      })
    );
  }
}
