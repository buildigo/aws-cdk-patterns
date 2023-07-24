import {isString} from 'lodash'

export function parseDimensionValue(value?: unknown): number | undefined {
  if (!isString(value)) {
    return undefined
  }
  const num = parseInt(value, 10)
  if (Number.isNaN(num)) {
    return undefined
  }

  // round to avoid generating images for fractional dimensions
  return Math.ceil(num)
}
