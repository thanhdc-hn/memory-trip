# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
