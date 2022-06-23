import {
  KpiRequestType,
  ItemType,
  TitleType,
  ItemCategoryType,
  RankType,
  PositionGroupType,
  PositionType,
  PositionItemType,
  RankTitleType,
  StaffType,
} from './type';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Items = '/hr/items',
  SaveItemsBatch = '/hr/items/batch',
  ItemCategories = '/hr/item-categories',
  SaveItemCategoriesBatch = '/hr/item-categories/batch',
  Titles = '/hr/titles',
  SaveTitlesBatch = '/hr/titles/batch',
  Ranks = '/hr/ranks',
  SaveRanksBatch = '/hr/ranks/batch',
  RankTitles = '/hr/rank-titles',
  SaveRankTitlesBatch = '/hr/rank-titles/batch',
  Positions = '/hr/positions',
  SavePositionsBatch = '/hr/positions/batch',
  PositionItems = '/hr/position-items',
  SavePositionItemsBatch = '/hr/position-items/batch',
  PositionGroups = '/hr/position-groups',
  SavePositionGroupsBatch = '/hr/position-groups/batch',
  Staffs = '/hr/staffs',
  SaveStaffsBatch = '/hr/staffs/batch',
}

export function getAllItem(params: KpiRequestType) {
  return defHttp.get<ItemType[]>({ url: Api.Items, params });
}

export function saveKpiItems(params) {
  return defHttp.post({ url: Api.SaveItemsBatch, params });
}

export function getAllItemCategory(params: KpiRequestType) {
  return defHttp.get<ItemCategoryType[]>({ url: Api.ItemCategories, params });
}

export function saveKpiItemCategories(params) {
  return defHttp.post({ url: Api.SaveItemCategoriesBatch, params });
}

export function getAllTitle(params: KpiRequestType) {
  return defHttp.get<TitleType[]>({ url: Api.Titles, params });
}

export function saveKpiTitlesBatch(params) {
  return defHttp.post({ url: Api.SaveTitlesBatch, params });
}

export function getAllRank(params: KpiRequestType) {
  return defHttp.get<RankType[]>({ url: Api.Ranks, params });
}

export function saveKpiRanksBatch(params) {
  return defHttp.post({ url: Api.SaveRanksBatch, params });
}

export function getAllRankTitle(params: KpiRequestType) {
  return defHttp.get<RankTitleType[]>({ url: Api.RankTitles, params });
}

export function saveKpiRankTitlesBatch(params) {
  return defHttp.post({ url: Api.SaveRankTitlesBatch, params });
}

export function getAllPositionGroup(params: KpiRequestType) {
  return defHttp.get<PositionGroupType[]>({ url: Api.PositionGroups, params });
}

export function saveKpiPositionGroups(params) {
  return defHttp.post({ url: Api.SavePositionGroupsBatch, params });
}

export function getAllPositionItem(params: KpiRequestType) {
  return defHttp.get<PositionItemType[]>({ url: Api.PositionItems, params });
}

export function saveKpiPositionItemsBatch(params) {
  return defHttp.post({ url: Api.SavePositionItemsBatch, params });
}

export function getAllPosition(params: KpiRequestType) {
  return defHttp.get<PositionType[]>({ url: Api.Positions, params });
}

export function saveKpiPositionsBatch(params) {
  return defHttp.post({ url: Api.SavePositionsBatch, params });
}

export function getAllStaff(params: KpiRequestType) {
  return defHttp.get<StaffType[]>({ url: Api.Staffs, params });
}

export function saveKpiStaffBatch(params) {
  return defHttp.post({ url: Api.SaveStaffsBatch, params });
}
