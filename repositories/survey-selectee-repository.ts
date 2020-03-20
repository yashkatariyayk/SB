import { ImportSelecteeEntity } from "../entities/importSelectee-entity";
import { getManager } from "typeorm";
import { SurveySelecteeEntity } from "../entities/surveySelectee-entity";
import { SurveySelectee, SurveySelecteeIds } from "../models/survey-selectee";
import { ImportSelectee } from "../models/import-selectee";
import { SurveySelecteeLanguageEntity } from "../entities/surveySelecteeLanguage-entity";

export class SurveySelecteeRepo {
  async get(
    queryObject: SurveySelectee,
    limit: number,
    skip: number,
    languageId: number
  ) {
    let results = await Promise.all([
      this.getselectee(queryObject, limit, skip, languageId),
      this.getLastImportedDate(queryObject.SurveyId),
      this.getTotleSelectee(queryObject)
    ]);
    return results;
  }

  async getselectee(
    queryObject: SurveySelectee,
    limit?: number,
    skip?: number,
    languageId?: number
  ) {
    let query = await getManager()
      .getRepository(SurveySelecteeEntity)
      .createQueryBuilder("selectee")
      .leftJoinAndMapOne(
        "selectee.Language",
        SurveySelecteeLanguageEntity,
        "language",
        `selectee.SurveySelecteeId=language.SurveySelecteeId and language.LanguageId=${languageId}`
      )
      .where("selectee.SurveyId = :SurveyId", {
        SurveyId: queryObject.SurveyId
      })
      .take(limit)
      .skip(skip);
    query.andWhere("selectee.IsDeleted = :IsDeleted", { IsDeleted: false });
    queryObject.FirstName || queryObject.LastName
      ? query.andWhere(
          "(selectee.FirstName like :FirstName OR selectee.LastName like :LastName)",
          {
            FirstName: "%" + queryObject.FirstName + "%",
            LastName: "%" + queryObject.LastName + "%"
          }
        )
      : false;
    queryObject.Email
      ? query.andWhere("selectee.Email like :Email", {
          Email: "%" + queryObject.Email + "%"
        })
      : false;
    queryObject.Role
      ? query.andWhere("selectee.Role like :Role", {
          Role: "%" + queryObject.Role + "%"
        })
      : false;
    queryObject.Department
      ? query.andWhere("selectee.Department like :Department", {
          Department: "%" + queryObject.Department + "%"
        })
      : false;
    queryObject.Miscellaneous
      ? query.andWhere("selectee.Miscellaneous like :Miscellaneous", {
          Miscellaneous: "%" + queryObject.Miscellaneous + "%"
        })
      : false;

    let result = query.getMany();
    return result;
  }

  async getLastImportedDate(Id: number) {
    return await getManager()
      .getRepository(ImportSelecteeEntity)
      .findOne({ SurveyId: Id });
  }

  async getTotleSelectee(queryObject: SurveySelectee) {
    let query = await getManager()
      .getRepository(SurveySelecteeEntity)
      .createQueryBuilder("selectee")
      .where("selectee.SurveyId = :SurveyId", {
        SurveyId: queryObject.SurveyId
      });
    query.andWhere("selectee.IsDeleted = :IsDeleted", { IsDeleted: false });
    queryObject.FirstName || queryObject.LastName
      ? query.andWhere(
          "(selectee.FirstName like :FirstName OR selectee.LastName like :LastName)",
          {
            FirstName: "%" + queryObject.FirstName + "%",
            LastName: "%" + queryObject.LastName + "%"
          }
        )
      : false;
    queryObject.Email
      ? query.andWhere("selectee.Email like :Email", {
          Email: "%" + queryObject.Email + "%"
        })
      : false;
    queryObject.Role
      ? query.andWhere("selectee.Role like :Role", {
          Role: "%" + queryObject.Role + "%"
        })
      : false;
    queryObject.Department
      ? query.andWhere("selectee.Department like :Department", {
          Department: "%" + queryObject.Department + "%"
        })
      : false;

    let result = query.getCount();
    return result;
  }

  async save(queryObjectS: SurveySelectee[], queryObjectSD: ImportSelectee) {
    let result = await Promise.all([
      await this.saveS(queryObjectS),
      await this.saveSD(queryObjectSD)
    ]);
    return result;
  }

  async saveS(queryObject: SurveySelectee[]) {
    let divideArr: any = [];
    divideArr = this.divideArray(queryObject);
    let result = await Promise.all(
      divideArr.map(async (selectee: any) => {
        if (selectee.length > 0) {
          console.log("Selectee Length : ---------", selectee.length);
          await getManager()
            .getRepository(SurveySelecteeEntity)
            .save(selectee);
        }
      })
    );
    return result;
  }

  async saveSD(queryObject: ImportSelectee) {
    let selectee = await getManager()
      .getRepository(ImportSelecteeEntity)
      .findOne({ SurveyId: queryObject.SurveyId });
    if (selectee) {
      return getManager()
        .getRepository(ImportSelecteeEntity)
        .update({ SurveyId: queryObject.SurveyId }, queryObject);
    } else {
      return getManager()
        .getRepository(ImportSelecteeEntity)
        .save(queryObject);
    }
  }

  update(queryObject: SurveySelectee) {
    return getManager()
      .getRepository(SurveySelecteeEntity)
      .createQueryBuilder()
      .update()
      .set({ ...queryObject })
      .where({ SurveySelecteeId: queryObject.SurveySelecteeId })
      .execute();
  }

  delete(queryObject: SurveySelectee) {
    return getManager()
      .getRepository(SurveySelecteeEntity)
      .update(queryObject, { IsDeleted: true });
  }

  async deleteMultiple(
    Selectees: SurveySelecteeIds,
    IsAllSelected?: boolean,
    SurveyId?: number,
    filterObject?: SurveySelectee
  ) {
    let result = await this.deleteSlectee(
      Selectees,
      IsAllSelected,
      SurveyId,
      filterObject
    );
    return result;
  }

  async deleteSlectee(
    Selectees: SurveySelecteeIds,
    IsAllSelected: boolean,
    SurveyId: number,
    filterObject?: SurveySelectee
  ) {
    let queryObject: SurveySelectee = new SurveySelectee();
    if (IsAllSelected == false || !IsAllSelected) {
      await Promise.all(
        Selectees.SurveySelecteeId.map(async (selectee) => {
          queryObject.SurveySelecteeId = selectee;
          await getManager()
            .getRepository(SurveySelecteeEntity)
            .update(queryObject, { IsDeleted: true });
        })
      );
    } else {
      let query = await getManager()
        .getRepository(SurveySelecteeEntity)
        .createQueryBuilder("selectee")
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
      filterObject.Role
        ? query.andWhere("Role like :Role", {
            Role: "%" + filterObject.Role + "%"
          })
        : false;
      filterObject.Department
        ? query.andWhere("Department like :Department", {
            Department: "%" + filterObject.Department + "%"
          })
        : false;
      await query.execute();
      if (Selectees.SurveySelecteeId && Selectees.SurveySelecteeId.length > 0) {
        let array = Selectees.SurveySelecteeId;
        await Promise.all(
          array.map(async (selectee) => {
            queryObject.SurveySelecteeId = selectee;
            await getManager()
              .getRepository(SurveySelecteeEntity)
              .update(queryObject, { IsDeleted: false });
          })
        );
      }
    }
  }

  divideArray(queryObjectS: any) {
    let count = queryObjectS.length;
    let selecteeCount = 50000;
    let ArrayDivide: any;
    if (count > selecteeCount) {
      let divide = count / selecteeCount;
      if (divide > 1) {
        ArrayDivide = [];
        for (let index = 0; index <= divide + 1; index++) {
          if (index < divide) {
            ArrayDivide[index] = queryObjectS.slice(
              index * selecteeCount,
              index * selecteeCount + selecteeCount
            );
          } else {
            ArrayDivide[index] = queryObjectS.slice(
              index * selecteeCount,
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
}
