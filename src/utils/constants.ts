export const ADMIN_EXPIRED_TIME = 30 * 1000 * 60;
export const POST_WAIT_TIME = 15 * 1000;

export const EXPORT_MAX_SELECTION = 40;
export const EXPORT_WARN_SELECTION = 30;

export const DATE_FORMAT = {
  VI: 'DD MMM, YYYY',
  DEFAULT: 'MMM DD, YYYY',
};

export const STORAGE_KEY = {
  TEAM_ID: 'team_id',
  NICKNAME: 'nickname',
  ADMIN_AUTH_TOKEN: 'admin_auth_token',
  ADMIN_EXPIRE_KEY: 'admin_expire_time',
  NICKNAME_TOOLTIP: 'nickname-tooltip-dismissed',
  LANGUAGE: 'language',
  // NOTE: the pre-mount no-flash script in index.html reads this same literal
  // ('theme'). Keep them in sync if this value ever changes.
  THEME: 'theme',
  // Ambient effect selection ('auto' | 'off' | an effect id).
  EFFECT: 'effect',
  // Whether the first-run "settings live here" hint has been dismissed.
  SETTINGS_HINT_SEEN: 'settings_hint_seen',
};

export const URL_PATH = {
  ADMIN: '/admin',
  TIMELINE: '/timeline',
  JOIN: '/join',
  EXPORT: '/export',
};
