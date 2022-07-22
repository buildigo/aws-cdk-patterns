import {StackUtils} from './stack-utils'

describe(StackUtils.parseInteger.name, () => {
  it('works for optional value', () => {
    expect(StackUtils.parseInteger(undefined)).toBe(undefined)
  })
  it('works for int values', () => {
    expect(StackUtils.parseInteger('20')).toBe(20)
    expect(StackUtils.parseInteger('-27')).toBe(-27)
    expect(StackUtils.parseInteger('3.14')).toBe(3)
  })
  it('throws if value is not a number', () => {
    expect(() => StackUtils.parseInteger('abc')).toThrowError()
    expect(() => StackUtils.parseInteger('d21wq qw')).toThrowError()
  })
})

describe(StackUtils.parseCorsAllowedOrigins.name, () => {
  it('falls back', () => {
    expect(StackUtils.parseCorsAllowedOrigins(undefined, ['*', 'test.com'])).toStrictEqual(['*', 'test.com'])
  })

  it('falls back when string is empty', () => {
    expect(StackUtils.parseCorsAllowedOrigins('', ['*', 'test.com'])).toStrictEqual(['*', 'test.com'])
  })

  it('parses simple string', () => {
    expect(StackUtils.parseCorsAllowedOrigins('domain.com', ['fallback.com'])).toStrictEqual(['domain.com'])
  })

  it('parses complex string', () => {
    expect(StackUtils.parseCorsAllowedOrigins('domain.com domain2.com', ['fallback.com'])).toStrictEqual([
      'domain.com',
      'domain2.com',
    ])
  })
  it('parses wildcard', () => {
    expect(StackUtils.parseCorsAllowedOrigins('*', ['fallback.com'])).toStrictEqual(['*'])
  })
})
