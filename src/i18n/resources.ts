import enCommon from './locales/en/common.json';
import enExport from './locales/en/export.json';
import enHome from './locales/en/home.json';
import enJoin from './locales/en/join.json';
import enMisc from './locales/en/misc.json';
import enPosts from './locales/en/posts.json';
import enShare from './locales/en/share.json';
import enTimeline from './locales/en/timeline.json';
import jaCommon from './locales/ja/common.json';
import jaExport from './locales/ja/export.json';
import jaHome from './locales/ja/home.json';
import jaJoin from './locales/ja/join.json';
import jaMisc from './locales/ja/misc.json';
import jaPosts from './locales/ja/posts.json';
import jaShare from './locales/ja/share.json';
import jaTimeline from './locales/ja/timeline.json';
import viCommon from './locales/vi/common.json';
import viExport from './locales/vi/export.json';
import viHome from './locales/vi/home.json';
import viJoin from './locales/vi/join.json';
import viMisc from './locales/vi/misc.json';
import viPosts from './locales/vi/posts.json';
import viShare from './locales/vi/share.json';
import viTimeline from './locales/vi/timeline.json';

export const defaultNS = 'common';

export const resources = {
  en: {
    common: enCommon,
    home: enHome,
    join: enJoin,
    timeline: enTimeline,
    posts: enPosts,
    share: enShare,
    export: enExport,
    misc: enMisc,
  },
  vi: {
    common: viCommon,
    home: viHome,
    join: viJoin,
    timeline: viTimeline,
    posts: viPosts,
    share: viShare,
    export: viExport,
    misc: viMisc,
  },
  ja: {
    common: jaCommon,
    home: jaHome,
    join: jaJoin,
    timeline: jaTimeline,
    posts: jaPosts,
    share: jaShare,
    export: jaExport,
    misc: jaMisc,
  },
} as const;
