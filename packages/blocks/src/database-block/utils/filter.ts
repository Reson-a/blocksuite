import type { DatabaseItemBlockModel } from '../database-item-model';
import type { ISchema } from '../database-model';
import { Field, FieldFactory, FieldType } from '../fields';

export enum FilterOperator {
  IS_EQUAL,
  IS_NOT_EQUAL,
  IS_NULL,
  IS_NOT_NULL,
  GREATER_THAN,
  LESS_THAN,
}

export enum FilterType {
  AND,
  OR,
}

export interface IFilter {
  id: string;
  value: Field;
  operator: FilterOperator;
}

function isFiltered(filter: IFilter, type: FieldType, field: Field) {
  const value = FieldFactory.getField(type)?.valueToCompare(field);
  const isNull = value == null || value == undefined;
  const result = FieldFactory.compareField(type, value, filter.value);
  switch (filter.operator) {
    case FilterOperator.IS_NULL:
      return isNull;
    case FilterOperator.IS_NOT_NULL:
      return !isNull;
    case FilterOperator.IS_EQUAL:
      return !isNull && result == 0;
    case FilterOperator.IS_NOT_EQUAL:
      return result != 0;
    case FilterOperator.GREATER_THAN:
      return !isNull && result > 0;
    case FilterOperator.LESS_THAN:
      return !isNull && result < 0;
    default:
      return false;
  }
}

export function filter(
  items: DatabaseItemBlockModel[],
  schemaMap: Record<string, ISchema>,
  filterType = FilterType.AND,
  filters?: IFilter[]
) {
  if (!filters || !filters.length) return [...items];
  return items.filter(item => {
    if (filterType == FilterType.OR) {
      return filters.some(filter =>
        isFiltered(filter, schemaMap[filter.id].type, item.fields[filter.id])
      );
    } else {
      return filters.every(filter =>
        isFiltered(filter, schemaMap[filter.id].type, item.fields[filter.id])
      );
    }
  });
}
