import bcrypt from 'bcrypt'

export const encryptString = (str: string):string => {
  return bcrypt.hashSync(str, 10)
}

export const compareWithHash = (str: string, hashStr: string):boolean => {
  return bcrypt.compareSync(str, hashStr)
}