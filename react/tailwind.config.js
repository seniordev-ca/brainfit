const colors = require('tailwindcss/colors');

// Added to address Tailwind build warnings as these colour names are deprecated
delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
    './node_modules/tw-elements/dist/js/**/*.js'
  ],
  darkMode: 'class',
  safelist: [
    {
      pattern:
        /fill-(default|exercise|nutrition|stress|social|sleep|mental|purple|pink|red|orange|yellow|teal|green|blue|lightBlue|brown|grey|black)/
    },
    {
      pattern:
        /stroke-(default|primary|exercise|nutrition|stress|social|sleep|mental|purple|pink|red|orange|yellow|teal|green|blue|lightBlue|brown|grey|black)/
    }
  ],
  theme: {
    fontFamily: {
      playfair: ['playfair', 'serif'],
      inter: ['inter', 'sans-serif']
    },
    fontSize: {
      xs: '.75rem',
      sm: '.875rem',
      tiny: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
      display: ['40px', '48px'],
      headingLarge: ['32px', '39px'],
      headingMedium: ['24px', '29px'],
      headingSmall: ['16px', '19px'],
      body: ['16px', '19px'],
      captionMedium: ['14px', '17px'],
      captionRegular: ['14px', '17px'],
      tabBarTablet: ['14px', '17px'],
      tabBar: ['12px', '15px'],
      historyBold: ['10px', '12px'],
      historyRegular: ['10px', '12px'],
      buttonRegular: ['16px', '16px']
    },
    colors: {
      ...colors,
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      green: colors.green,
      yellow: colors.yellow,
      blue: colors.blue,
      gray: {
        ...colors.gray,
        dark: '#212121',
        DEFAULT: '#303030',
        light: '#a2a2a2',
        lighter: '#3B3B3B'
      },
      mom_lightMode_text: {
        dark: '#231825',
        neutral: '#46304B',
        light: '#F8F2F4',
        primary: '#9A67A4',
        overMaximum: '#FF3A33'
      },
      mom_darkMode_text: {
        neutral: '#F8F2F4',
        dark: '#231825',
        primary: '#F0C8AF'
      },
      mom_lightMode_surface: {
        background: '#ffffff',
        dimmed: '#f0f0f0',
        border: '#c8c5c8',
        borderDimmed: '#E1E1E1'
      },
      mom_darkMode_surface: {
        background: '#231825',
        dimmed: '#392F3B',
        border: '#8d858d',
        borderDimmed: '#584f59',
        backgroundRaised: '#2A1D2D'
      },
      mom_lightMode_action: {
        neutral: '#231825',
        primary: '#815889'
      },
      mom_darkMode_action: {
        neutral: '#F8F2F4',
        primary: '#F0C8AF'
      },
      mom_lightMode_icon: {
        exercise: '#BA5050',
        nutrition: '#7B8A58',
        stress: '#4E7FAD',
        social: '#D98355',
        sleep: '#EDBB32',
        mental: '#AA6CBC',
        dark: '#231825',
        neutral: '#46304B',
        primary: '#815889',
        pink: '#EA6699',
        orange: '#D98355',
        yellow: '#EDBB32',
        green: '#7B8A58',
        teal: '#5F958B',
        lightBlue: '#5EB2BF',
        blue: '#4E7FAD',
        purple: '#AA6CBC',
        red: '#BA5050',
        brown: '#896A58',
        grey: '#868686',
        black: '#212121'
      },
      mom_darkMode_icon: {
        neutral: '#F8F2F4',
        primary: '#F0C8AF'
      },
      mom_pillar: {
        exercise: '#BA5050',
        nutrition: '#7B8A58',
        stress: '#4E7FAD',
        social: '#D98355',
        sleep: '#EDBB32',
        mental: '#AA6CBC'
      }
    },
    extend: {
      scale: {
        'modal': '0.92',
      },
      width: {
        '5.5': '1.375rem',
      },
      dropShadow: {
        '1x': '4px 8px 28px rgba(70, 48, 75, 0.25)',
        '2x': [
          '0px 4px 8px rgba(35, 24, 37, 0.06)',
          '0px 8px 48px #19101B',
          '0px 0px 1px rgba(196, 210, 224, 0.32)'
        ],
        cardLight: [
          '0px 4px 8px rgba(66, 71, 76, 0.06)',
          '0px 8px 48px #EEEEEE'
        ],
        cardDark: [
          '0px 4px 8px rgba(35, 24, 37, 0.06)',
          '0px 8px 48px #19101B'
        ],
        themeIconLight: [
          '0px 0.888889px 1.77778px rgba(66, 71, 76, 0.06)',
          '0px 1.77778px 10.6667px #EEEEEE'
        ],
        themeIconDark: [
          '0px 0px 1px rgba(196, 210, 224, 0.32)',
          '0px 4px 8px rgba(35, 24, 37, 0.06)',
          '0px 8px 48px #19101B'
        ]
      },
      boxShadow: {
        '1x': '4px 8px 28px rgba(70, 48, 75, 0.25)',
        '2x': [
          '0px 4px 8px rgba(35, 24, 37, 0.06)',
          '0px 8px 48px #19101B',
          '0px 0px 1px rgba(196, 210, 224, 0.32)'
        ],
        'cardLight': [
          '0px 4px 8px rgba(66, 71, 76, 0.06)',
          '0px 8px 48px #EEEEEE'
        ],
        'cardDark': [
          '0px 4px 8px rgba(35, 24, 37, 0.06)',
          '0px 8px 48px #19101B'
        ],
        'themeIconLight': [
          '0px 0.888889px 1.77778px rgba(66, 71, 76, 0.06)',
          '0px 1.77778px 10.6667px #EEEEEE'
        ],
        'themeIconDark': [
          '0px 0px 1px rgba(196, 210, 224, 0.32)',
          '0px 4px 8px rgba(35, 24, 37, 0.06)',
          '0px 8px 48px #19101B'
        ]
      },
      borderRadius: {
        card: '1.125rem'
      },
      spacing: {
        2.5: '0.625rem',
        6.5: '1.625rem',
        13: '3.25rem',
        38: '9.5rem'
      },
      transitionProperty: {
        strokeOffset: 'stroke-dashoffset'
      },
      translate: {
        fullx2: '200%',
        fullx3: '300%',
        fullx4: '400%',
        fullx5: '500%'
      },
      rotate: {
        30: '30deg'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tw-elements/dist/plugin'),
    require('@tailwindcss/line-clamp')
  ]
};
