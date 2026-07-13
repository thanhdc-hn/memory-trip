import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import {
  DEFAULT_SELECTION,
  isEffectSelection,
} from '@/components/effects/effect-utils';
import { type EffectSelection } from '@/components/effects/effects';
import { STORAGE_KEY } from '@/utils/constants';

interface EffectState {
  /** The persisted user selection (`auto` | `off` | an effect id). */
  selection: EffectSelection;
  /**
   * Transient, non-persisted preview override (`null` when not previewing).
   * Lets the wheel picker show a live preview while the user rotates, without
   * committing the value until they confirm.
   */
  previewSelection: EffectSelection | null;
  /** Update + persist the selection (and clear any active preview). */
  setSelection: (selection: EffectSelection) => void;
  /** Set a transient preview override (not persisted). */
  setPreview: (selection: EffectSelection) => void;
  /** Discard the preview override and fall back to the persisted selection. */
  clearPreview: () => void;
}

/**
 * Ambient-effect client state, persisted to localStorage via Zustand `persist`.
 *
 * Only the raw `selection` is persisted — the *resolved* effect (which depends
 * on the current date, tab visibility and reduced-motion) is derived in the
 * `useResolvedEffect` hook, not stored here. Keeping the store to plain state
 * lets non-React consumers (e.g. the canvas engine, a future "surprise me"
 * action) read/set it without any provider plumbing.
 */
export const useEffectStore = create<EffectState>()(
  persist(
    (set) => ({
      selection: DEFAULT_SELECTION,
      previewSelection: null,
      setSelection: (selection) => set({ selection, previewSelection: null }),
      setPreview: (previewSelection) => set({ previewSelection }),
      clearPreview: () => set({ previewSelection: null }),
    }),
    {
      name: STORAGE_KEY.EFFECT,
      // Persist only the value, never the action.
      partialize: (state) => ({ selection: state.selection }),
      // Validate on rehydrate so a corrupt stored value falls back to default.
      merge: (persisted, current) => {
        const candidate = (persisted as Partial<EffectState> | undefined)
          ?.selection;
        return {
          ...current,
          selection: isEffectSelection(candidate)
            ? candidate
            : DEFAULT_SELECTION,
        };
      },
    },
  ),
);

/** The persisted selection paired with its setter. */
export function useEffectSelection() {
  return useEffectStore(
    useShallow((state) => ({
      selection: state.selection,
      setSelection: state.setSelection,
    })),
  );
}

/** Transient preview actions (non-persisted), used by the wheel picker. */
export function useEffectPreview() {
  return useEffectStore(
    useShallow((state) => ({
      setPreview: state.setPreview,
      clearPreview: state.clearPreview,
    })),
  );
}
