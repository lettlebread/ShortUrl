export const isString = (s: any, allowEmpty: boolean = false): boolean => {
  return (typeof s === "string" && (s.length > 0 || allowEmpty))
}