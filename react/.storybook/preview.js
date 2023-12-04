import "../src/index.scss"
import "../src/react-widgets.scss"
import { themes } from "@storybook/theming"

export const parameters = {
  darkMode: {
    stylePreview: true,
    darkClass: 'dark',
    lightClass: 'light',
    dark: { ...themes.dark, appBg: 'black' },
    light: { ...themes.normal, appBg: 'white' }
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: ['Atoms', 'Molecules', 'Organisms', 'Templates', 'Pages'],
    }
  }
}