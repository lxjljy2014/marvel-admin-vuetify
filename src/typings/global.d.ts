export {};

declare global {
  export interface Window {
    NProgress?: import('nprogress').NProgress;
    $loadingBar?: typeof import('@/plugins/vuetify-feedback').loadingBarApi;
    $dialog?: typeof import('@/plugins/vuetify-feedback').dialogApi;
    $message?: typeof import('@/plugins/vuetify-feedback').messageApi;
    $notification?: typeof import('@/plugins/vuetify-feedback').notificationApi;
  }

  export const BUILD_TIME: string;
}
