import { IProfileResponse } from "./../interfaces/ProfileInterfaces";
import { toSyntax } from "./../libraries/util";

import * as fp from "lodash/fp";

export const profileMapper = {
  toEntity: profileJSON => toSyntax(profileJSON, fp.camelCase),
  toJSON: (profileEntity): IProfileResponse =>
    <IProfileResponse>toSyntax(profileEntity, fp.snakeCase)
};
