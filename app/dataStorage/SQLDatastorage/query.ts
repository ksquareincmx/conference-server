import * as fp from "lodash/fp";

import { IQuery } from "./interfaces";
import { config } from "./../../config/config";

/*
 TODO:
    add parseInclude, receive a include base,
    add parseWhere, receive a where base
*/
const parseOrder = (order: string) => {
  if (fp.isUndefined(order)) {
    return undefined;
  }

  const splitedOrder: Array<string> = order.split(" ");
  const colName = splitedOrder[0];
  const orderParam = splitedOrder[1];

  if (orderParam !== "ASC" && orderParam !== "DESC") {
    throw new Error("Invalid query");
  }

  return [[colName, orderParam]];
};

const parseOffset = (offset: number): number => {
  return Number(offset || config.api.offset);
};

const parseLimit = (limit: number): number => {
  return Number(limit || config.api.limit);
};

// Compute offset and limit useful for pagination
const paginationData = (pageSize: number, page = 1) => ({
  offset: pageSize * page - pageSize,
  limit: pageSize
});

// TODO: add parseInclude and parseWhere
const parseQueryFactory = (query: IQuery) => {
  const { pageSize, page, order } = query;
  const { offset, limit } = paginationData(pageSize, page);

  return {
    limit: parseLimit(limit),
    offset: parseOffset(offset),
    order: parseOrder(order)
  };
};

export { parseQueryFactory };
