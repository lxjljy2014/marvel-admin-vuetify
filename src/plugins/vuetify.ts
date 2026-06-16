import { createVuetify } from 'vuetify';
import { forVuetify } from '../theme/breakpoints';

import '@mdi/font/css/materialdesignicons.css';
import '../styles/layers.css';

import 'vuetify/styles';

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          background: '#fff',
          primary: '#646cff',
          secondary: '#2080f0',
          info: '#2080f0',
          success: '#52c41a',
          warning: '#faad14',
          error: '#f5222d'
        }
      },
      dark: {
        colors: {
          primary: '#646cff',
          secondary: '#2080f0',
          info: '#2080f0',
          success: '#52c41a',
          warning: '#faad14',
          error: '#f5222d'
        }
      }
    }
  },
  display: {
    mobileBreakpoint: 'md',
    thresholds: forVuetify
  }
});
