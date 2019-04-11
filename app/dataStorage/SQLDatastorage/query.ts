import { Op } from "sequelize";
import * as fp from "lodash/fp";

import { db } from "./../../db";
import { IQuery } from "./interfaces";
import { config } from "./../../config/config";

const parseOrder = (order: string) => {
  if (fp.isUndefined(order)) {
    return undefined;
  }

  const splitedOrder: Array<string> = order.split(" ");
  const colName = splitedOrder[0];
  const orderParam = splitedOrder[1];

  if (orderParam !== "ASC" && orderParam !== "DESC") {
  }

  return [[colName, orderParam]];
};

const parseOffset = (offset: number): number => {
  return Number(offset || config.api.offset);
};

const parseLimit = (limit: number): number => {
  return Number(limit || config.api.limit);
};

const parseInclude = (models: string) => {
  if (models) {
    const modelsDB = getModelsFromDB(JSON.parse(models));
    return modelsDB.map(model => ({
      model: model,
      required: false
    }));
  }
  return [];
};

const parseWhere = (filters: any) => {
  return fp.mapValues((filter: any) => {
    const operation = Object.keys(filter)[0];
    return {
      [Op[operation]]: filter[operation]
    };
  }, filters);
};

// only return existing models
const getModelsFromDB = (includeModels: string[]) =>
  includeModels.reduce(
    (modelsBD, model) =>
      db.models[model] ? [...modelsBD, db.models[model]] : modelsBD,
    []
  );

// Compute offset and limit useful for pagination
const paginationData = (pageSize: number, page: number = 1) => ({
  offset: pageSize * page - pageSize,
  limit: pageSize
});

// TODO: add parseWhere
const parseQueryFactory = (query: IQuery) => {
  const { pageSize, page, order, include, ...where } = query;
  const { offset, limit } = paginationData(pageSize, page);

  return {
    limit: parseLimit(limit),
    offset: parseOffset(offset),
    order: parseOrder(order),
    include: parseInclude(include),
    where: parseWhere(where)
  };
};

export { parseQueryFactory };
