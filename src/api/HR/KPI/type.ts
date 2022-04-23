export type ItemRequestType = {
  code: string;
  version: string;
};

export type ItemType = {
  pid: number;
  code: string;
  name: string;
  version: string;
} & BaseModelFields;
