import { IProfileResponse } from "../../interfaces/v1/ProfileInterfaces";
import { toSyntax } from "../../libraries/util";

import * as fp from "lodash/fp";

export const profileMapper = {
  toEntity: profileJSON => toSyntax(profileJSON, fp.camelCase),
  toDTO: (profileEntity): IProfileResponse =>
    <IProfileResponse>toSyntax(profileEntity, fp.snakeCase)
};
