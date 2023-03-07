import { isString } from '@/libs/stringUtil'

describe('isString test', () => {
  it('not string with allowEmpty', () => {
    expect(isString(123)).toBe(false)
  })

  it('not string with allowEmpty', () => {
    expect(isString(123, false)).toBe(false)
  })

  it('empty string with allowEmpty', () => {
    expect(isString("")).toBe(true)
  })

  it('empty string with not allowEmpty', () => {
    expect(isString("", false)).toBe(false)
  })

  it('string with not allowEmpty', () => {
    expect(isString("123", false)).toBe(true)
  })
})