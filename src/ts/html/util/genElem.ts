export const genElem = (elementType: string, options: any = {}) => {
  const element = document.createElement(elementType);
  Object.entries(options).forEach(([key, val]) => (element as any)[key] = val);
  return element;
};
