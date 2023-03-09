import { isString } from '@/libs/stringUtil'

describe('isString test', () => {
  it('not string with allowEmpty', () => {
    expect(isString(123, true)).toBe(false)
  })

  it('not string with not allowEmpty', () => {
    expect(isString(123)).toBe(false)
  })

  it('empty string with allowEmpty', () => {
    expect(isString('', true)).toBe(true)
  })

  it('empty string with not allowEmpty', () => {
    expect(isString('')).toBe(false)
  })

  it('string with allowEmpty', () => {
    expect(isString('str', true)).toBe(true)
  })

  it('string with not allowEmpty', () => {
    expect(isString('str')).toBe(true)
  })
})