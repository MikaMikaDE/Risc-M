// Mirrors the CSS variables in style.css.
// Previously used getComputedStyle(), which fails on deploy because
// the stylesheet may not be applied when monaco.editor.defineTheme() runs.
export const COLORS = {
  blue:   "569EE6",
  green:  "88CC88",
  pink:   "CC88CC",
  red:    "DB7093",
  yellow: "EEE8AA",
  orange: "DD8855",
};
