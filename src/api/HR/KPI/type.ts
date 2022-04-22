import { ModificationFields } from '../../model/baseModel';

export type ItemRequestType = {
  code: string;
  version: string;
};

export type ItemType = {
  id: number;
  pid: number;
  code: string;
  name: string;
  version: string;
  createdBy: string;
  updatedBy: string;
} & ModificationFields;
