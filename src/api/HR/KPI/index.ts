import {
  KpiRequestType,
  ItemType,
  TitleType,
  ItemCategoryType,
  TitleCategoryType,
  RankType,
  PositionGroupType,
  PositionType,
} from './type';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Items = '/hr/items',
  SaveItemsBatch = '/hr/items/batch',
  ItemCategories = '/hr/item-categories',
  Titles = '/hr/titles',
  TitleCategories = '/hr/title-categories',
  Ranks = '/hr/ranks',
  Positions = '/hr/positions',
  PositionGroups = '/hr/position-groups',
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

export function getAllTitle(params: KpiRequestType) {
  return defHttp.get<TitleType[]>({ url: Api.Titles, params });
}

export function getAllTitleCategory(params: KpiRequestType) {
  return defHttp.get<TitleCategoryType[]>({ url: Api.TitleCategories, params });
}

export function getAllRank(params: KpiRequestType) {
  return defHttp.get<RankType[]>({ url: Api.Ranks, params });
}

export function getAllPositionGroup(params: KpiRequestType) {
  return defHttp.get<PositionGroupType[]>({ url: Api.PositionGroups, params });
}

export function getAllPosition(params: KpiRequestType) {
  return defHttp.get<PositionType[]>({ url: Api.Positions, params });
}
