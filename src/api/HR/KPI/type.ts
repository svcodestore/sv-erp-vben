export type KpiRequestType = {
  category: string;
  version: string;
};

export type ItemType = {
  pid: number;
  code: string;
  name: string;
  version: string;
} & BaseModelFields;

export type ItemCategoryType = {
  code: string;
  name: string;
  version: string;
} & BaseModelFields;

export type TitleType = {
  name: string;
  version: string;
} & BaseModelFields;

export type TitleCategoryType = {
  name: string;
  version: string;
} & BaseModelFields;

export type RankType = {
  name: string;
  version: string;
} & BaseModelFields;

export type PositionGroupType = {
  pid: number;
  name: string;
  version: string;
} & BaseModelFields;

export type PositionItemType = {
  name: string;
  version: string;
} & BaseModelFields;

export type PositionType = {
  itemId: number;
  groupId: number;
  kpiId: number;
  categoryId: number;
  scorePercent: number;
  version: string;
} & BaseModelFields;
