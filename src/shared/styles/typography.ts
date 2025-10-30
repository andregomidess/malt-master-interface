/**
 * TYPOGRAPHY GUIDE - Malt Master Interface (React Native)
 *
 * FONT CONVENTION:
 *
 * 1. Inter (Primary Font)
 *    - Body text (paragraphs, descriptions)
 *    - Form labels
 *    - Buttons
 *    - Navigation and menus
 *    - Lists and data
 *    - General UI texts
 *
 * 2. Lora (Accent Font)
 *    - Headings (H1, H2, H3, H4, H5, H6)
 *    - Logos and branding
 *    - Large numbers and statistics
 *    - Special call-to-actions
 *    - Elements that require visual emphasis
 */

export const FONT_FAMILY = {
  primary: 'Inter',
  heading: 'Lora',
} as const

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
} as const

export const FONT_WEIGHT = {
  light: '300',
  normal: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
} as const

export const LINE_HEIGHT = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
} as const

export const LETTER_SPACING = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
} as const

export const HEADING_STYLES = {
  h1: {
    fontFamily: FONT_FAMILY.heading,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE['5xl'],
    lineHeight: FONT_SIZE['5xl'] * LINE_HEIGHT.tight,
    letterSpacing: LETTER_SPACING.tight,
  },
  h2: {
    fontFamily: FONT_FAMILY.heading,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE['4xl'],
    lineHeight: FONT_SIZE['4xl'] * LINE_HEIGHT.tight,
    letterSpacing: LETTER_SPACING.tight,
  },
  h3: {
    fontFamily: FONT_FAMILY.heading,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE['3xl'],
    lineHeight: FONT_SIZE['3xl'] * LINE_HEIGHT.tight,
    letterSpacing: LETTER_SPACING.normal,
  },
  h4: {
    fontFamily: FONT_FAMILY.heading,
    fontWeight: FONT_WEIGHT.semiBold,
    fontSize: FONT_SIZE['2xl'],
    lineHeight: FONT_SIZE['2xl'] * LINE_HEIGHT.tight,
    letterSpacing: LETTER_SPACING.normal,
  },
  h5: {
    fontFamily: FONT_FAMILY.heading,
    fontWeight: FONT_WEIGHT.semiBold,
    fontSize: FONT_SIZE.xl,
    lineHeight: FONT_SIZE.xl * LINE_HEIGHT.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
  h6: {
    fontFamily: FONT_FAMILY.heading,
    fontWeight: FONT_WEIGHT.semiBold,
    fontSize: FONT_SIZE.lg,
    lineHeight: FONT_SIZE.lg * LINE_HEIGHT.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
} as const

export const TEXT_STYLES = {
  body: {
    fontFamily: FONT_FAMILY.primary,
    fontWeight: FONT_WEIGHT.normal,
    fontSize: FONT_SIZE.base,
    lineHeight: FONT_SIZE.base * LINE_HEIGHT.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
  bodyLarge: {
    fontFamily: FONT_FAMILY.primary,
    fontWeight: FONT_WEIGHT.normal,
    fontSize: FONT_SIZE.lg,
    lineHeight: FONT_SIZE.lg * LINE_HEIGHT.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
  bodySmall: {
    fontFamily: FONT_FAMILY.primary,
    fontWeight: FONT_WEIGHT.normal,
    fontSize: FONT_SIZE.sm,
    lineHeight: FONT_SIZE.sm * LINE_HEIGHT.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
  label: {
    fontFamily: FONT_FAMILY.primary,
    fontWeight: FONT_WEIGHT.medium,
    fontSize: FONT_SIZE.sm,
    lineHeight: FONT_SIZE.sm * LINE_HEIGHT.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
  button: {
    fontFamily: FONT_FAMILY.primary,
    fontWeight: FONT_WEIGHT.semiBold,
    fontSize: FONT_SIZE.base,
    lineHeight: FONT_SIZE.base * LINE_HEIGHT.normal,
    letterSpacing: LETTER_SPACING.wide,
  },
  caption: {
    fontFamily: FONT_FAMILY.primary,
    fontWeight: FONT_WEIGHT.normal,
    fontSize: FONT_SIZE.xs,
    lineHeight: FONT_SIZE.xs * LINE_HEIGHT.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
} as const
