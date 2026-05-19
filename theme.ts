/**
 * THEME — single source of truth for accent colors.
 *
 * To change the color scheme:
 *  1. Update PRIMARY / SECONDARY / TERTIARY hex values below.
 *  2. Update the matching CSS variables in app/globals.css (:root block).
 *  3. Update the GLSL vec3 phase + background in animated-shader-hero.tsx
 *     (search for "phase offsets" and "background tint" comments).
 *
 * Current palette: Gold / Amber (yellow theme)
 */

export const THEME = {
  /** Primary accent — used for glows, headings, borders, active states */
  primary:        '#68BA7F',
  /** Secondary accent — used for gradients, hover states */
  secondary:      '#2E6F40',
  /** Tertiary / light accent — used for subtle tints */
  tertiary:       '#CFFFDC',

  /** RGB tuple strings for rgba() usage in JS/TSX */
  primaryRgb:     '104,186,127',
  secondaryRgb:   '46,111,64',
  tertiaryRgb:    '207,255,220',

  /** Surface colors */
  bg:             '#080d09',
  panel:          '#0d160f',
  elevated:       '#131e15',

  /** Text */
  text:           '#d4f0dc',
  muted:          '#4a7a55',
} as const;

export type Theme = typeof THEME;
