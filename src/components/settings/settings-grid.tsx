import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { getEffectById } from '@/components/effects/effect-utils';
import { EFFECTS, type EffectSelection } from '@/components/effects/effects';
import { usePrefersReducedMotion } from '@/components/effects/use-prefers-reduced-motion';
import { useResolvedEffect } from '@/components/effects/use-resolved-effect';
import { useTheme } from '@/components/theme/theme-provider';
import { THEMES } from '@/components/theme/themes';
import { type Language, SUPPORTED_LANGUAGES } from '@/i18n';
import { cn } from '@/lib/utils';
import { useEffectSelection } from '@/store/effect.store';

const LANGUAGE_LABELS: Record<Language, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  ja: '日本語',
};

const EFFECT_OPTIONS: {
  id: EffectSelection;
  labelKey: string;
  icon: string;
}[] = [
  { id: 'auto', labelKey: 'effect.auto', icon: '🪄' },
  { id: 'off', labelKey: 'effect.off', icon: '🚫' },
  ...EFFECTS.map((e) => ({ id: e.id, labelKey: e.labelKey, icon: e.icon })),
];

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <span className="text-text/60 mb-2 block text-xs font-bold tracking-wide uppercase">
      {children}
    </span>
  );
}

interface OptionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function OptionButton({ active, className, ...props }: OptionButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all active:scale-95',
        active
          ? 'border-primary bg-primary/10 text-text-h'
          : 'border-border hover:bg-sand/20 text-text bg-card',
        className,
      )}
      {...props}
    />
  );
}

export function SettingsGrid() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { selection, setSelection } = useEffectSelection();
  const resolved = useResolvedEffect();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="flex flex-col gap-6">
      <section>
        <SectionTitle>{t('settings.language')}</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          {SUPPORTED_LANGUAGES.map((lng) => (
            <OptionButton
              key={lng}
              active={i18n.language === lng}
              onClick={() => i18n.changeLanguage(lng)}
            >
              {LANGUAGE_LABELS[lng]}
            </OptionButton>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>{t('settings.theme')}</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((th) => (
            <OptionButton
              key={th.id}
              active={theme === th.id}
              onClick={() => setTheme(th.id)}
            >
              <span
                className="h-4 w-4 rounded-full ring-1 ring-black/10"
                style={{ backgroundColor: th.swatch }}
                aria-hidden="true"
              />
              {t(th.labelKey)}
            </OptionButton>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>{t('settings.effects')}</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {EFFECT_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.id}
              active={selection === opt.id}
              onClick={() => setSelection(opt.id)}
            >
              <span aria-hidden="true">{opt.icon}</span>
              {t(opt.labelKey)}
            </OptionButton>
          ))}
        </div>

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
