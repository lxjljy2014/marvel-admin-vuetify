import type { App } from 'vue';
import { createVuetify } from 'vuetify';
import { forVuetify } from '@/theme/breakpoints';
import { createRulesPlugin } from 'vuetify/labs/rules';
import { zhHans } from 'vuetify/locale';
import { VCommandPalette } from 'vuetify/labs/VCommandPalette';

import '@mdi/font/css/materialdesignicons.css';
import '../styles/layers.css';

import 'vuetify/styles';

import { themeSettings } from '@/theme/settings';

export function setupVuetify(app: App) {
  const vuetify = createVuetify({
    components: {
      VCommandPalette
    },
    defaults: {
      VCard: {
        class: 'card-wrapper'
      },
      global: {}
    },
    theme: {
      defaultTheme: themeSettings.themeScheme,
      themes: {
        light: {
          colors: {
            // 背景与表面
            background: '#FEFBFF',
            'on-background': '#1C1B1F',
            primary: themeSettings.themeColor,
            'on-primary': '#FFFFFF',
            surface: '#FFFFFF',
            'on-surface': '#1C1B1F',
            'surface-variant': '#E7E4F0',
            'on-surface-variant': '#494653',
            secondary: '#5B6BAF',
            error: themeSettings.otherColor.error,
            info: themeSettings.otherColor.info,
            success: themeSettings.otherColor.success,
            warning: themeSettings.otherColor.warning
          },
          variables: {
            'border-color': '#79747E',
            'border-opacity': 0.12,
            'high-emphasis-opacity': 0.82,
            'medium-emphasis-opacity': 0.6,
            'disabled-opacity': 0.38,
            'idle-opacity': 0.04,
            'hover-opacity': 0.04,
            'focus-opacity': 0.12,
            'selected-opacity': 0.08,
            'activated-opacity': 0.12,
            'pressed-opacity': 0.12,
            'dragged-opacity': 0.08
          }
        },
        dark: {
          colors: {
            background: '#131216',
            'on-background': '#E6E3ED',
            primary: themeSettings.themeColor,
            surface: '#1C1B1F',
            'on-surface': '#E6E3ED',
            'surface-variant': '#464653',
            'on-surface-variant': '#C5C2D0',
            secondary: '#BCC3F0',
            error: themeSettings.otherColor.error,
            info: themeSettings.otherColor.info,
            success: themeSettings.otherColor.success,
            warning: themeSettings.otherColor.warning
          },
          variables: {
            'border-color': '#938F99',
            'border-opacity': 0.12,
            'high-emphasis-opacity': 0.87,
            'medium-emphasis-opacity': 0.6,
            'disabled-opacity': 0.38,
            'idle-opacity': 0.04,
            'hover-opacity': 0.04,
            'focus-opacity': 0.12,
            'selected-opacity': 0.08,
            'activated-opacity': 0.12,
            'pressed-opacity': 0.12,
            'dragged-opacity': 0.08
          }
        }
      }
    },
    display: {
      mobileBreakpoint: 'md',
      thresholds: forVuetify
    },
    locale: {
      locale: 'zhHans',
      messages: { zhHans }
    }
  });

  app.use(vuetify);
  app.use(createRulesPlugin({}, vuetify.locale));
}
