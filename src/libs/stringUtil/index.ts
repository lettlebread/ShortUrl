export const isString = (s: any, allowEmpty: boolean = true): boolean => {
  return (typeof s === "string" && (s.length > 0 || allowEmpty))
}