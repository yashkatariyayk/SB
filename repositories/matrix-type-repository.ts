import { getManager } from "typeorm";
import { MatrixTypeEntity } from "../entities/matrixType-entity";

export class MatrixTypeRepo {
  get() {
    return getManager()
      .getRepository(MatrixTypeEntity)
      .find();
  }
}
