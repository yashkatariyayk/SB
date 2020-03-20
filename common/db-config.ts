import "reflect-metadata";
import { ConnectionOptions } from "typeorm";
require("dotenv").config({ path: "./.env" });

export let dbOptions: any = {
  type: "mysql",
  host: `${process.env.DB_HOST}`,
  port: process.env.DB_PORT,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  CHARSET: `${process.env.CHARSET}`,
  entities: ["dist/entities/*.js"],
  timeout: 2147483,
  synchronize: true
};
