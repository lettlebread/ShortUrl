import { createHashString } from '@/libs/hashUtil'

describe('createHashString test', () => {
  jest
    .useFakeTimers()
    .setSystemTime(new Date('2020-01-01'))
  
  it('no input - create hash string by time', () => {
    expect(createHashString()).toBe('1990880442aae060bbe3ce18f03c88aa')
  })

  it('create hash string by string', () => {
    expect(createHashString('test')).toBe('098f6bcd4621d373cade4e832627b4f6')
  })
})