import { compareWithHash } from '@/libs/bycryptUtil'

describe('encryptString test', () => {
  it('compare with correct hash', () => {
    expect(compareWithHash('testpassword', '$2b$10$nfAx05UdLjmpVMq2ptVLfeQRqgMmeIdX97urYlmYW9OekUTMJ0hyi')).toBe(true)
  })

  it('compare with incorrect hash', () => {
    expect(compareWithHash('testpassword', '$2b$10$nfAx05UdLjmpVMq2ptVLfeQRqgMmeIdX97urYlmYW9OekUTMJ0hy_')).toBe(false)
  })
})