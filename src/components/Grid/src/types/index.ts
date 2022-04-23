import type { VxeGridProps, VxeGridInstance, VxeTableDefines, VxeGridPropTypes } from 'vxe-table';

interface InsertOptionsType {
  defaultRowValues: { [key: string]: any };
  focusField: string;
}

type SaveApiType = <T>(modifications: GridModificationApiType) => Promise<T>;

type ToolBarCustomType = Partial<{
  saveApi: SaveApiType;
  insertOptions: InsertOptionsType;
  title: string;
  desc: string;
}>;

type ToolBarType = ToolBarCustomType & {
  grid: VxeGridInstance;
  gridEmit: EmitType;
  gridCurrentRow: any;
  gridOriginalData: any[];
  gridWrappedColumns: GridColumnType[] | VxeGridPropTypes.Columns;
};

type GridCustomType = Partial<{
  mode: GridModeType;
  editable: boolean;
  readable: boolean;
  writable: boolean;
  removable: boolean;
  importable: boolean;
  exportable: boolean;
  printable: boolean;
  seachable: boolean;
  draggable: boolean;
  reactable: boolean;
}>;

type GridPropsType = ToolBarCustomType &
  VxeGridProps &
  GridCustomType &
  Partial<{ columns: GridColumnType[] }>;

type modItemType = { [key: string]: any };

type GridModificationType = {
  insert: modItemType[];
  update: modItemType[];
  remove: modItemType[];
};

type GridModificationFmtType = Partial<{
  insert: modItemType[];
  update: modItemType[];
  remove: { [key: string]: modItemType[] };
}>;

type GridModificationApiType = Partial<{
  A: modItemType[];
  U: modItemType[];
  D: { [key: string]: modItemType[] };
}>;

enum GridModeEnum {
  TOOLBAR = 'TOOLBAR',
  INLINE = 'INLINE',
  KEYBOARD = 'KEYBOARD',
  CONTEXTMENU = 'CONTEXTMENU',
}

type GridModeType = keyof typeof GridModeEnum;

type GridColumnType = VxeTableDefines.ColumnOptions &
  Partial<{
    key: string;
    editable: boolean;
    readable: boolean;
    writable: boolean;
    removable: boolean;
    formatType: 'number' | 'date';
  }>;

export {
  SaveApiType,
  ToolBarType,
  modItemType,
  InsertOptionsType,
  GridPropsType,
  GridModificationType,
  GridModificationFmtType,
  GridModificationApiType,
  GridModeEnum,
  GridModeType,
  GridColumnType,
};
