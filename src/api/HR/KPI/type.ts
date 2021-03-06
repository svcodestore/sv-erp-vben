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

export type RankType = {
  code: string;
  version: string;
} & BaseModelFields;

export type RankTitleType = {
  rankId: number;
  titleId: number;
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

export type StaffType = {
  number: number;
  name: string;
  positionGroupId: number;
  positionId: number;
  rankTitleId: number;
  employedIn: string;
} & BaseModelFields;

export type RuleItemType = {
  category: string;
  expression: string;
  remark: string;
} & BaseModelFields;

export type RuleType = {
  kpiId: number;
  positionGroupId: number;
  ruleItemId: number;
  ruleExpression: string;
} & BaseModelFields;

export type GroupScoreType = {
  ruleId: number;
  month: string;
  score: string;
  kpiScore: string;
} & BaseModelFields;

export type StaffScoreType = {
  staffId: number;
  kpiId: number;
  month: string;
  score: string;
  kpiScore: string;
} & BaseModelFields;
