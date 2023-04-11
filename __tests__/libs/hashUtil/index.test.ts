import { createHashString } from '@/libs/hashUtil'

describe('createHashString test', () => {
  jest
    .useFakeTimers()
    .setSystemTime(new Date('2020-01-01'))
  
  it('no input - create hash string by time', () => {
    expect(createHashString()).toBe('2ihArU')
  })

  it('create hash string by string', () => {
    expect(createHashString('test')).toBe('2fqMea')
  })
})