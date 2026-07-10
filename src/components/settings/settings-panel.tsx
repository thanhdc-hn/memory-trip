import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { getEffectById } from '@/components/effects/effect-utils';
import { EFFECTS, type EffectSelection } from '@/components/effects/effects';
import { usePrefersReducedMotion } from '@/components/effects/use-prefers-reduced-motion';
import { useResolvedEffect } from '@/components/effects/use-resolved-effect';
import { useTheme } from '@/components/theme/theme-provider';
import { THEMES } from '@/components/theme/themes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Language, SUPPORTED_LANGUAGES } from '@/i18n';
import { useEffectSelection } from '@/store/effect.store';

const LANGUAGE_LABELS: Record<Language, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  ja: '日本語',
};

/** Effect picker options: Auto + Off pseudo-options, then the registry. */
const EFFECT_OPTIONS: {
  id: EffectSelection;
  labelKey: string;
  icon: string;
}[] = [
  { id: 'auto', labelKey: 'effect.auto', icon: '🪄' },
  { id: 'off', labelKey: 'effect.off', icon: '🚫' },
  ...EFFECTS.map((e) => ({ id: e.id, labelKey: e.labelKey, icon: e.icon })),
];

function SectionTitle({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <span
      id={id}
      className="text-text/60 mb-2 block text-xs font-bold tracking-wide uppercase"
    >
      {children}
    </span>
  );
}

/**
 * Standalone settings body — language, theme/mood and ambient effect pickers.
 * Hosted in the Settings modal (Task 7); kept presentation-only and
 * provider-free so it can be promoted to a `/settings` route later unchanged.
 */
export function SettingsPanel() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { selection, setSelection } = useEffectSelection();
  const resolved = useResolvedEffect();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="flex flex-col gap-6">
      <section>
        <SectionTitle id="setting-language">
          {t('settings.language')}
        </SectionTitle>
        <Select
          value={i18n.language}
          onValueChange={(val) => i18n.changeLanguage(val as Language)}
        >
          <SelectTrigger aria-labelledby="setting-language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((lng) => (
              <SelectItem key={lng} value={lng}>
                {LANGUAGE_LABELS[lng]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section>
        <SectionTitle id="setting-theme">{t('settings.theme')}</SectionTitle>
        <Select value={theme} onValueChange={(val) => setTheme(val as any)}>
          <SelectTrigger aria-labelledby="setting-theme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {THEMES.map((th) => (
              <SelectItem key={th.id} value={th.id}>
                <div className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 shrink-0 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: th.swatch }}
                    aria-hidden="true"
                  />
                  <span>{t(th.labelKey)}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section>
        <SectionTitle id="setting-effects">
          {t('settings.effects')}
        </SectionTitle>
        <Select
          value={selection}
          onValueChange={(val) => setSelection(val as EffectSelection)}
        >
          <SelectTrigger aria-labelledby="setting-effects">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EFFECT_OPTIONS.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                <div className="flex items-center gap-2">
                  <span aria-hidden="true">{opt.icon}</span>
                  <span>{t(opt.labelKey)}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selection === 'auto' && resolved && (
          <p className="text-text/60 mt-2 text-xs">
            {t('settings.autoCurrent', {
              effect: t(getEffectById(resolved).labelKey),
            })}
          </p>
        )}

        {reducedMotion && (
          <p className="text-text/60 mt-2 text-xs">
            {t('settings.reducedMotion')}
          </p>
        )}
      </section>
    </div>
  );
}
