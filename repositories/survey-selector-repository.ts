import { ImportSelectorEntity } from "../entities/importSelector-entity";
import { getManager } from "typeorm";
import { SurveySelectorEntity } from "../entities/surveySelector-entity";
import { SurveySelector, SurveySelectorIds } from "../models/survey-selector";
import { ImportSelector } from "../models/import-selector";
import { SurveySelectorStatusEntity } from "../entities/surveySelectorStatus-entity";

export class SurveySelectorRepo {
  async get(queryObject: SurveySelector, limit: number, skip: number) {
    let result = await Promise.all([
      this.getselector(queryObject, limit, skip),
      this.getLastImportedDate(queryObject.SurveyId),
      this.getTotlaSelector(queryObject)
    ]);
    return result;
  }

  async getselector(queryObject: SurveySelector, limit: number, skip: number) {
    let query = getManager()
      .getRepository(SurveySelectorEntity)
      .createQueryBuilder("selector")
      .leftJoinAndMapMany(
        "selector.Status",
        SurveySelectorStatusEntity,
        "surveySelectorStatus",
        "selector.SurveySelectorStatusId=surveySelectorStatus.SurveySelectorStatusId"
      )
      .where("selector.SurveyId = :SurveyId", {
        SurveyId: queryObject.SurveyId
      })
      .skip(skip)
      .take(limit);

    query.andWhere("selector.IsDeleted = :IsDeleted", { IsDeleted: false });
    queryObject.FirstName
      ? query.andWhere("selector.FirstName like :FirstName", {
          FirstName: "%" + queryObject.FirstName + "%"
        })
      : false;
    queryObject.LastName
      ? query.andWhere("selector.LastName like :LastName", {
          LastName: "%" + queryObject.LastName + "%"
        })
      : false;
    queryObject.Email
      ? query.andWhere("selector.Email like :Email", {
          Email: "%" + queryObject.Email + "%"
        })
      : false;
    queryObject.Language
      ? query.andWhere("selector.Language like :Language", {
          Language: "%" + queryObject.Language + "%"
        })
      : false;
    queryObject.SurveySelectorStatusId
      ? query.andWhere(
          "selector.SurveySelectorStatusId = :SurveySelectorStatusId",
          {
            SurveySelectorStatusId: queryObject.SurveySelectorStatusId
          }
        )
      : false;
    let result = query.getMany();
    return result;
  }

  async getLastImportedDate(Id: number) {
    return getManager()
      .getRepository(ImportSelectorEntity)
      .findOne({ SurveyId: Id });
  }

  async getTotlaSelector(queryObject: SurveySelector) {
    let query = getManager()
      .getRepository(SurveySelectorEntity)
      .createQueryBuilder("selector")
      .leftJoinAndMapMany(
        "selector.Status",
        SurveySelectorStatusEntity,
        "surveySelectorStatus",
        "selector.SurveySelectorStatusId=surveySelectorStatus.SurveySelectorStatusId"
      )
      .where("selector.SurveyId = :SurveyId", {
        SurveyId: queryObject.SurveyId
      });

    query.andWhere("selector.IsDeleted = :IsDeleted", { IsDeleted: false });
    queryObject.FirstName
      ? query.andWhere("selector.FirstName like :FirstName", {
          FirstName: "%" + queryObject.FirstName + "%"
        })
      : false;
    queryObject.LastName
      ? query.andWhere("selector.LastName like :LastName", {
          LastName: "%" + queryObject.LastName + "%"
        })
      : false;
    queryObject.Email
      ? query.andWhere("selector.Email like :Email", {
          Email: "%" + queryObject.Email + "%"
        })
      : false;
    queryObject.Language
      ? query.andWhere("selector.Language like :Language", {
          Language: "%" + queryObject.Language + "%"
        })
      : false;
    queryObject.SurveySelectorStatusId
      ? query.andWhere(
          "selector.SurveySelectorStatusId = :SurveySelectorStatusId",
          {
            SurveySelectorStatusId: queryObject.SurveySelectorStatusId
          }
        )
      : false;
    let result = query.getCount();
    return result;
  }

  async save(queryObjectS: SurveySelector[], queryObjectSD: ImportSelector) {
    let result = await Promise.all([
      this.saveS(queryObjectS),
      this.saveSD(queryObjectSD)
    ]);
    return result;
  }

  async saveS(queryObject: SurveySelector[]) {
    let divideArr: any = [];
    divideArr = this.divideArray(queryObject);
    let result = await Promise.all(
      divideArr.map(async (selector: any) => {
        if (selector.length > 0) {
          console.log("Selector Length : ---------", selector.length);
          await getManager()
            .getRepository(SurveySelectorEntity)
            .save(selector);
        }
      })
    );
  }

  divideArray(queryObjectS: any) {
    let count = queryObjectS.length;
    let selectorCount = 50000;
    //let selectorCount = 10000;
    let ArrayDivide: any;
    if (count > selectorCount) {
      let divide = count / selectorCount;
      if (divide > 1) {
        ArrayDivide = [];
        for (let index = 0; index <= divide + 1; index++) {
          if (index < divide) {
            ArrayDivide[index] = queryObjectS.slice(
              index * selectorCount,
              index * selectorCount + selectorCount
            );
          } else {
            ArrayDivide[index] = queryObjectS.slice(
              index * selectorCount,
              queryObjectS.length
            );
          }
        }
      }
    } else {
      ArrayDivide = [];
      ArrayDivide[0] = queryObjectS;
    }
    return ArrayDivide;
  }

  async update(queryObject: SurveySelector) {
    return getManager()
      .getRepository(SurveySelectorEntity)
      .createQueryBuilder()
      .update()
      .set({ ...queryObject })
      .where({ SurveySelectorId: queryObject.SurveySelectorId })
      .execute();
  }

  async saveSD(queryObject: ImportSelector) {
    let selector = await getManager()
      .getRepository(ImportSelectorEntity)
      .findOne({ SurveyId: queryObject.SurveyId });
    if (selector) {
      return getManager()
        .getRepository(ImportSelectorEntity)
        .update({ SurveyId: queryObject.SurveyId }, queryObject);
    } else {
      return getManager()
        .getRepository(ImportSelectorEntity)
        .save(queryObject);
    }
  }

  delete(queryObject: SurveySelector) {
    return getManager()
      .getRepository(SurveySelectorEntity)
      .update(queryObject, { IsDeleted: true });
  }
  async deleteMultiple(
    Selectors: SurveySelectorIds,
    IsAllSelected: boolean,
    SurveyId: number,
    filterObject: SurveySelector
  ) {
    let result = await this.deleteSlector(
      Selectors,
      IsAllSelected,
      SurveyId,
      filterObject
    );
    return result;
  }

  async deleteSlector(
    Selectors: SurveySelectorIds,
    IsAllSelected: boolean,
    SurveyId: number,
    filterObject: SurveySelector
  ) {
    let queryObject: SurveySelector = new SurveySelector();
    if (IsAllSelected == false || !IsAllSelected) {
      await Promise.all(
        Selectors.SurveySelectorId.map(async (selector) => {
          queryObject.SurveySelectorId = selector;
          await getManager()
            .getRepository(SurveySelectorEntity)
            .update(queryObject, { IsDeleted: true });
        })
      );
    } else {
      let query = await getManager()
        .getRepository(SurveySelectorEntity)
        .createQueryBuilder("selector")
        .update()
        .set({ IsDeleted: true })
        .where(`SurveyId=${SurveyId}`);
      filterObject.FirstName
        ? query.andWhere(
            "(FirstName like :FirstName OR LastName like :LastName)",
            {
              FirstName: "%" + filterObject.FirstName + "%",
              LastName: "%" + filterObject.LastName + "%"
            }
          )
        : false;
      filterObject.Email
        ? query.andWhere("Email like :Email", {
            Email: "%" + filterObject.Email + "%"
          })
        : false;
      filterObject.Language
        ? query.andWhere("Language = :Language", {
            Language: filterObject.Language
          })
        : false;
      filterObject.SurveySelectorStatusId
        ? query.andWhere("SurveySelectorStatusId = :SurveySelectorStatusId", {
            SurveySelectorStatusId: filterObject.SurveySelectorStatusId
          })
        : false;
      await query.execute();
      if (Selectors.SurveySelectorId && Selectors.SurveySelectorId.length > 0) {
        await Promise.all(
          Selectors.SurveySelectorId.map(async (selector) => {
            queryObject.SurveySelectorId = selector;
            await getManager()
              .getRepository(SurveySelectorEntity)
              .update(queryObject, { IsDeleted: false });
          })
        );
      }
    }
  }
}
