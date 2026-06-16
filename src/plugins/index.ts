import {setupRouter} from '../router';
import {setupStore} from '../stores';
import { getLocale, setupI18n } from '../locales';
import type { App } from 'vue';
import {setupLoading} from './loading';
import {setupNProgress} from './nprogress';
import {setupIconifyOffline} from './iconify';
import {setupDayjs} from './dayjs';
import {setupAppVersionNotification} from './app';
import { setupVueRootValidator } from 'vite-plugin-vue-transition-root-validator/client';

// Plugins
import vuetify from './vuetify'

export async function registerPlugins (app: App) {
  setupLoading();

  setupNProgress();

  setupIconifyOffline();

  setupDayjs();
 app.use(vuetify)

 setupStore(app);

 await setupRouter(app);

  setupI18n(app);

  setupAppVersionNotification();

  setupVueRootValidator(app, {
    lang: getLocale() === 'zh-CN' ? 'zh' : 'en'
  });
}
