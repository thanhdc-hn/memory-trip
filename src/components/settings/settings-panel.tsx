import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { getEffectById } from '@/components/effects/effect-utils';
import { usePrefersReducedMotion } from '@/components/effects/use-prefers-reduced-motion';
import { useResolvedEffect } from '@/components/effects/use-resolved-effect';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Language, SUPPORTED_LANGUAGES } from '@/i18n';
import { useEffectSelection } from '@/store/effect.store';

import { EffectWheelControl } from './wheel/effect-wheel-control';
import { ThemeWheelControl } from './wheel/theme-wheel-control';

const LANGUAGE_LABELS: Record<Language, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  ja: '日本語',
};

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
  const { selection } = useEffectSelection();
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
        <ThemeWheelControl />
      </section>

      <section>
        <SectionTitle id="setting-effects">
          {t('settings.effects')}
        </SectionTitle>
        <EffectWheelControl />

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
