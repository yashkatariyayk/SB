import { getManager } from "typeorm";
import { EmailTemplateEntity } from "../entities/emailTemplate-entity";
import { EmailTemplate } from "../models/emailTemplate";
import { SurveySelectorEntity } from "../entities/surveySelector-entity";
import { SurveySelector } from "../models/survey-selector";
import * as nodemailer from "nodemailer";
import { EmailLog } from "../models/emailLog";
import { EmailLogEntity } from "../entities/emailLog-entity";
import { error } from "util";
import { EmailConfig } from "../models/emailConfig";
import { EmailConfigEntity } from "../entities/emailConfig-entity";
import { EmailTemplateLanguageEntity } from "../entities/emailTemplateLanguage-entity";
import { ConfigRepo } from "./config-repository";

export class EmailTemplateRepo {
  get(languageId: number) {
    return getManager()
      .getRepository(EmailTemplateEntity)
      .createQueryBuilder("emailTemplate")
      .leftJoinAndMapOne(
        "emailTemplate.Language",
        EmailTemplateLanguageEntity,
        "language",
        `emailTemplate.EmailTemplateId=language.EmailTemplateId and language.LanguageId=${languageId}`
      )
      .getMany();
  }
  // ########################################### Email Scedular Start ###########################################//
  async runEmailSchedular() {
    let emailConfig = await this.getEmailConfig(false);
    let configRepo: ConfigRepo = new ConfigRepo();
    let emailCount;
    let count = await configRepo.getEmailCount().then((result: any) => {
      emailCount = result.Count;
    });
    let EmaiLogs: EmailLog[] = await getManager()
      .getRepository(EmailLogEntity)
      .createQueryBuilder("emailLog")
      .where("emailLog.Status IN (:Status)", { Status: [3, 5] })
      .take(emailCount)
      .getMany();
    console.log("emails get successfully!", EmaiLogs.length);
    if (EmaiLogs && EmaiLogs.length > 0) {
      Promise.all(
        EmaiLogs.map(async (element) => {
          await this.sendMailToSelector(element, emailConfig[0]);
        })
      );
    } else {
      return false;
    }
  }
  async sendMailToSelector(element: any, emailConfig: any) {
    let transporter = nodemailer.createTransport({
      host: emailConfig.Host,
      port: emailConfig.Port,
      secure: emailConfig.IsSecure, // true for 465, false for other ports
      auth: {
        user: emailConfig.Username, // generated ethereal user
        pass: emailConfig.Password // generated ethereal password
      }
    });
    if (!element.TriedCount || element.TriedCount < 3) {
      await transporter.sendMail(
        {
          from: emailConfig.FromEmail, // sender address
          to: element.Email,
          subject: element.Subject,
          text: element.Subject,
          html: element.Body
        },
        async (err, info) => {
          if (err) {
            element.Status = 5;
            element.TriedCount = element.TriedCount
              ? parseInt(element.TriedCount) + 1
              : 1;
            element.SurveySelectorStatusId = 5;
            element.Error = err.message;
          } else {
            element.Status = 4;
            element.SurveySelectorStatusId = 4;
          }
          let result = await Promise.all([
            this.updateSelectorStatus(element),
            this.updateEmailLog(element)
          ]);
          return true;
        }
      );
    }
  }
  async updateSelectorStatus(queryObject: any) {
    await getManager()
      .getRepository(SurveySelectorEntity)
      .update(
        { SurveySelectorId: queryObject.SurveySelectorId },
        { SurveySelectorStatusId: queryObject.SurveySelectorStatusId }
      );
  }
  async updateEmailLog(queryObject: EmailLog) {
    await getManager()
      .getRepository(EmailLogEntity)
      .save(queryObject);
  }
  // ########################################### Email Scedular End ###########################################//

  getById(queryObject: any, languageId: any) {
    return getManager()
      .getRepository(EmailTemplateEntity)
      .createQueryBuilder("emailTemplate")
      .leftJoinAndMapOne(
        "emailTemplate.Language",
        EmailTemplateLanguageEntity,
        "language",
        `emailTemplate.EmailTemplateId=language.EmailTemplateId and language.LanguageId=${languageId}`
      )
      .where(queryObject)
      .getMany();
  }

  async send(queryObject: EmailTemplate[]) {
    let result = await Promise.all([
      this.updateStatus(queryObject),
      this.sendEmail(queryObject)
    ]);
    return result;
    // return queryObject;
  }
  async sendEmail(queryObject: EmailTemplate[]) {
    let emailConfig = await this.getEmailConfig(false);
    await Promise.all(
      queryObject.map(async (element) => {
        this.sendMailToSelector(element, emailConfig);
      })
    );
  }
  async updateStatus(queryObject: EmailTemplate[]) {
    await Promise.all(
      queryObject.map(async (element) => {
        return getManager()
          .getRepository(SurveySelectorEntity)
          .update(
            { SurveySelectorId: element.SurveySelectorId },
            { SurveySelectorStatusId: 4 }
          );
      })
    );
  }

  getEmailConfig(isAll: boolean) {
    let queryObject: EmailConfig = new EmailConfig();
    isAll == false ? (queryObject.IsActive = true) : false;
    return getManager()
      .getRepository(EmailConfigEntity)
      .find(queryObject);
  }

  async updateEmailConfig(queryObject: EmailConfig) {
    let result = await getManager()
      .getRepository(EmailConfigEntity)
      .createQueryBuilder("emailConfig")
      .update()
      .set({ IsActive: false })
      .where({ IsActive: true })
      .execute();

    return getManager()
      .getRepository(EmailConfigEntity)
      .createQueryBuilder("emailConfig")
      .update()
      .set({ IsActive: true })
      .where(queryObject)
      .execute();
  }
}
