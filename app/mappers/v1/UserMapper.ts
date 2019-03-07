import { IUserResponse } from "../../interfaces/v1/UserInterfaces";
import { toSyntax } from "../../libraries/util";

import * as fp from "lodash/fp";

export const userMapper = {
  toEntity: userJSON => toSyntax(userJSON, fp.camelCase),
  toDTO: (userEntity): IUserResponse =>
    <IUserResponse>toSyntax(userEntity, fp.snakeCase)
};
