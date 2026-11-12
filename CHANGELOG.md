# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Themed polaroid frames**: every memory photo and polaroid-style card now follows the active mood
  - Each theme tints the frame paper, ink, hairline edge, shadow and washi tape, with optional margin textures (stars, blossom dots, aged vignette) and corner radius
  - Frames alternate between washi tape and a sticker of the theme's accent emoji (`--theme-emoji`, published by `applyTheme`)
  - New `.polaroid-frame` class and `--frame-*` tokens in `src/style.css`; `ImageFrame` gets a `decoration` prop
  - `Tape` on the join card now uses the theme's tape colour
  - Tests: `theme-frames.test.ts` (every theme defines frame tokens with AA-readable text), `image-frame.test.tsx`, `polaroid.test.ts`
- **Themed polaroid frames in the PDF album**: the exported album now draws its memory cards in the frame of the active mood instead of a fixed white polaroid
  - New `src/services/album-frame.ts` reads the `--frame-*` tokens (and `--theme-emoji`) from the document and paints paper, shadows, margin texture (dots, vignette, sheen), hairline edge, washi tape or emoji sticker on the canvas, so a new theme needs no PDF code
  - Captions and the author / date line use the frame ink; tape / sticker alternate by post id exactly like the timeline; text-only cards and the wide long-caption cards are themed too
  - `generateAlbumPdf` takes an optional `frame` argument (defaults to the active theme)
  - Tests: `album-frame.test.ts` (parsers, painting, every registry theme resolves to a drawable frame), `album-pdf.test.ts` (cards use the theme paper / ink / decoration); shared helpers `src/test/canvas-mock.ts` and `src/test/frame-css.ts`

### Fixed

- `bg-paper`, `text-paper-text` and `text-paper-text-muted` were never registered with Tailwind, so polaroid frames rendered without a paper background; they are now defined in `@theme inline`
- Moved the `--paper*` defaults before the theme blocks so they no longer override per-theme values

## [1.0.1] - 2026-07-09

### Fixed

- **Image Transformation Fallback System**: Fixed issue where timeline images were broken due to Supabase image transformation being disabled
  - Enhanced error handling in storage service with automatic fallback to non-transformed URLs
  - Created backup function `getPostImageUrlDirect()` for emergency use
  - Added comprehensive test suite covering all scenarios
  - Detailed documentation available in `changelogs/2026-07-09/`

### Added

- Changelogs folder structure organized by date
- Detailed documentation of image function changes
- Summary of all changes made

### Technical Details

- Modified: `src/services/storage.service.ts`
- Modified: `src/features/posts/utils/getPostImageUrl.ts`
- Added: `src/features/posts/utils/__tests__/getPostImageUrl.test.ts`

### Documentation

- See `changelogs/2026-07-09/IMAGE_FUNCTION_CHANGES.md` for detailed technical documentation
- See `changelogs/2026-07-09/SUMMARY_OF_CHANGES.md` for project summary

## [1.0.0] - Initial Release

### Features

- Memory Trip PWA application
- Team-based memory sharing with timeline
- Mobile-first responsive design
- Supabase backend with RLS security
- Netlify Functions for admin operations
- Image upload and compression
- PWA installation support
- Internationalization support
- Theme system with multiple moods
- Export functionality (PDF, ZIP)
- Admin dashboard with team management
