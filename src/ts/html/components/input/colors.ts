const COLOR_NAMES = ["blue", "green", "pink", "red", "yellow", "orange"];
export const COLORS = COLOR_NAMES.reduce((acc, name) => ({
  ...acc, [name]: getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim()
    .replace('#', '')  // strip # for Monaco rules
}), {} as Record<string, string>);
