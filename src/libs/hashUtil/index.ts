import crypto from 'crypto'
import base62 from 'base62'

export const createHashString = (message?: string): string => {
  const str = message || Date.now().toString()
  const sNum = stringToNum(str)
  return base62.encode(sNum).substring(0, 6)
}

function stringToNum(str: string) {
  const md5Str = crypto.createHash('md5').update(str).digest('hex')
  let md5BinStr = ''

  for(let i = 0; i < md5Str.length; i++) {
    md5BinStr += md5Str.charCodeAt(i).toString(2)
  }

  return parseInt(md5BinStr, 2)
}