import { reactive } from 'vue';
import type { VNode } from 'vue';

type MessageType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface MessageItem {
  id: number;
  type: MessageType;
  content: string;
  duration: number;
}

interface MessageReactive {
  destroy: () => void;
}

interface DialogOptions {
  title?: string;
  content?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  positiveText?: string;
  negativeText?: string;
  onPositiveClick?: () => void | Promise<void>;
  onNegativeClick?: () => void | Promise<void>;
  onClose?: () => void;
}

interface DialogState extends DialogOptions {
  visible: boolean;
}

interface NotificationOptions {
  title?: string;
  content?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  action?: () => VNode;
  onClose?: () => void;
}

interface NotificationItem extends NotificationOptions {
  id: number;
}

interface NotificationReactive {
  destroy: () => void;
}

interface LoadingBarState {
  loading: boolean;
  error: boolean;
}

let messageIdCounter = 0;
let notificationIdCounter = 0;

const messages = reactive<MessageItem[]>([]);
const dialogState = reactive<DialogState>({ visible: false });
const notifications = reactive<NotificationItem[]>([]);
const loadingBarState = reactive<LoadingBarState>({ loading: false, error: false });

function removeMessage(id: number) {
  const index = messages.findIndex(m => m.id === id);
  if (index > -1) messages.splice(index, 1);
}

function removeNotification(id: number) {
  const index = notifications.findIndex(n => n.id === id);
  if (index > -1) notifications.splice(index, 1);
}

const messageTypeColorMap: Record<MessageType, string> = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  loading: 'primary'
};

function createMessage(content: string, options?: Partial<MessageItem>): MessageReactive {
  const id = messageIdCounter++;
  const duration = options?.duration ?? (options?.type === 'loading' ? 0 : 3000);
  const item: MessageItem = { id, type: 'info', content, duration, ...options };
  messages.push(item);
  if (duration > 0) {
    setTimeout(() => removeMessage(id), duration);
  }
  return { destroy: () => removeMessage(id) };
}

function createDialog(options: DialogOptions) {
  Object.assign(dialogState, { ...options, visible: true });
  return {
    destroy: () => {
      dialogState.visible = false;
    }
  };
}

function createNotification(options: NotificationOptions): NotificationReactive {
  const id = notificationIdCounter++;
  const duration = options.duration ?? 5000;
  const item: NotificationItem = { id, type: 'info', duration, ...options };
  notifications.push(item);
  if (duration > 0) {
    setTimeout(() => removeNotification(id), duration);
  }
  return { destroy: () => removeNotification(id) };
}

export const feedbackMessages = messages;
export const feedbackDialog = dialogState;
export const feedbackNotifications = notifications;
export const feedbackLoadingBar = loadingBarState;
export const feedbackMessageTypeColorMap = messageTypeColorMap;

export const messageApi = {
  create: createMessage,
  success: (content: string, options?: Partial<MessageItem>) => createMessage(content, { ...options, type: 'success' }),
  error: (content: string, options?: Partial<MessageItem>) => createMessage(content, { ...options, type: 'error' }),
  warning: (content: string, options?: Partial<MessageItem>) => createMessage(content, { ...options, type: 'warning' }),
  info: (content: string, options?: Partial<MessageItem>) => createMessage(content, { ...options, type: 'info' }),
  loading: (content: string, options?: Partial<MessageItem>) =>
    createMessage(content, { ...options, type: 'loading', duration: 0 })
};

export const dialogApi = {
  create: createDialog,
  info: (options: DialogOptions) => createDialog({ ...options, type: 'info' }),
  success: (options: DialogOptions) => createDialog({ ...options, type: 'success' }),
  warning: (options: DialogOptions) => createDialog({ ...options, type: 'warning' }),
  error: (options: DialogOptions) => createDialog({ ...options, type: 'error' })
};

export const notificationApi = {
  create: createNotification,
  info: (options: NotificationOptions) => createNotification({ ...options, type: 'info' }),
  success: (options: NotificationOptions) => createNotification({ ...options, type: 'success' }),
  warning: (options: NotificationOptions) => createNotification({ ...options, type: 'warning' }),
  error: (options: NotificationOptions) => createNotification({ ...options, type: 'error' })
};

export const loadingBarApi = {
  start: () => {
    loadingBarState.loading = true;
    loadingBarState.error = false;
  },
  finish: () => {
    loadingBarState.loading = false;
    loadingBarState.error = false;
  },
  error: () => {
    loadingBarState.loading = false;
    loadingBarState.error = true;
  }
};

export type { MessageReactive, DialogOptions, NotificationReactive, MessageType, MessageItem, NotificationItem };
