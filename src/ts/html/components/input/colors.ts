const COLOR_NAMES = ["blue", "green", "pink", "red", "yellow", "orange", "black2"];
export const COLORS = COLOR_NAMES.reduce((acc, name) => ({
  ...acc, [name]: getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()
}), {} as Record<string, string>);
