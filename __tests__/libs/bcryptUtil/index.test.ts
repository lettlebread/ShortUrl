import { compareWithHash } from '@/libs/bycryptUtil'

describe('encryptString test', () => {
  it('compare hash', () => {
    expect(compareWithHash("testpassword", "$2b$10$nfAx05UdLjmpVMq2ptVLfeQRqgMmeIdX97urYlmYW9OekUTMJ0hyi")).toBe(true)
  })
})