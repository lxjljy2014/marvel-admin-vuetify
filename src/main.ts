import { createApp } from 'vue';
import { registerPlugins } from '@/plugins';

import App from './App.vue';

import 'unfonts.css';
import 'virtual:uno.css';
import './styles/main.scss';

const app = createApp(App);

registerPlugins(app).then(() => {
  app.mount('#app');
});
