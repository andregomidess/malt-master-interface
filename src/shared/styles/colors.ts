export const COLORS = {
  background: '#FEFEFD',
  brand: {
    primary: '#D58300',
    malt: '#8B4513',
  },

  icons: '#565D6D',

  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },

  text: {
    primary: '#171a1f',
    secondary: '#666666',
    tertiary: '#999999',
    inverse: '#FFFFFF',
  },

  status: {
    success: '#00cc66',
    error: '#cc0066',
    warning: '#FFA726',
    info: '#0066cc',
  },

  border: {
    light: '#E0E0E0',
    default: '#DDDDDD',
    dark: '#BDBDBD',
  },

  shadow: '#171a1f',
} as const

export type Color = typeof COLORS
