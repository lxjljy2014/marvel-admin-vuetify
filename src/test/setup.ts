import { config } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import { createRulesPlugin } from 'vuetify/labs/rules';

const vuetify = createVuetify();
const pinia = createPinia();

config.global.plugins = [[vuetify], [createRulesPlugin({}, vuetify.locale)], pinia];

config.global.stubs = {
  ...config.global.stubs,
  VIcon: true,
  VExpansionPanels: {
    template: '<div><slot /></div>'
  },
  VExpansionPanel: {
    template: '<div><slot /></div>'
  },
  VExpansionPanelTitle: {
    template: '<div><slot /></div>'
  },
  VExpansionPanelText: {
    template: '<div><slot /></div>'
  }
};
