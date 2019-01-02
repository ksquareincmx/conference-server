import { IProfileResponse } from "./../interfaces/ProfileInterfaces";
import * as fp from "lodash/fp";
import { toSyntax } from "./../libraries/util";

export const profileMapper = {
  toEntity: profileJSON => toSyntax(profileJSON, fp.camelCase),
  toJSON: (profileEntity): IProfileResponse =>
    <IProfileResponse>toSyntax(profileEntity, fp.snakeCase)
};
