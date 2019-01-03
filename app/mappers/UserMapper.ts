import { IUserResponse } from "./../interfaces/UserInterfaces";
import { toSyntax } from "./../libraries/util";

import * as fp from "lodash/fp";

export const userMapper = {
  toEntity: userJSON => toSyntax(userJSON, fp.camelCase),
  toJSON: (userEntity): IUserResponse =>
    <IUserResponse>toSyntax(userEntity, fp.snakeCase)
};
