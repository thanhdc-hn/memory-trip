import { describe, expect, it, vi } from 'vitest';

import { getPostImageUrl, getPostImageUrlDirect } from '../getPostImageUrl';

// Mock the storage service
vi.mock('@/services/storage.service', () => ({
  storageService: {
    getOptimizedUrl: vi.fn(async (path: string, width = 640, quality = 90) => {
      if (path === 'error-path') {
        throw new Error('Transformation failed');
      }
      return `https://example.com/transform/${width}/${quality}/${path}`;
    }),
    getNonTransformedUrl: vi.fn(async (path: string) => {
      if (path === 'critical-error-path') {
        throw new Error('Critical failure');
      }
      return `https://example.com/public/${path}`;
    }),
  },
}));

describe('getPostImageUrl', () => {
  const mockPost = {
    id: '123',
    team_id: 'team-1',
    author_name: 'test-user',
    caption: 'Test caption',
    image_path: 'teams/team-1/123.webp',
    created_at: '2024-01-01T00:00:00Z',
  };

  const mockPostWithoutImage = {
    ...mockPost,
    image_path: '',
  };

  const mockPostWithBlob = {
    ...mockPost,
    image_path: 'blob:http://localhost:3000/abc123',
  };

  it('returns null when post has no image path', async () => {
    expect(await getPostImageUrl(mockPostWithoutImage)).toBeNull();
  });

  it('returns blob URL unchanged for optimistic posts', async () => {
    expect(await getPostImageUrl(mockPostWithBlob)).toBe(
      mockPostWithBlob.image_path,
    );
  });

  it('returns transformed URL by default', async () => {
    const url = await getPostImageUrl(mockPost);
    expect(url).toBe(
      'https://example.com/transform/640/90/teams/team-1/123.webp',
    );
  });

  it('returns non-transformed URL when useTransformation is false', async () => {
    const url = await getPostImageUrl(mockPost, { useTransformation: false });
    expect(url).toBe('https://example.com/public/teams/team-1/123.webp');
  });

  it('falls back to non-transformed URL when transformation fails', async () => {
    const errorPost = { ...mockPost, image_path: 'error-path' };
    const url = await getPostImageUrl(errorPost);
    expect(url).toBe('https://example.com/public/error-path');
  });

  it('accepts custom width and quality options', async () => {
    const url = await getPostImageUrl(mockPost, { width: 800, quality: 70 });
    expect(url).toBe(
      'https://example.com/transform/800/70/teams/team-1/123.webp',
    );
  });
});

describe('getPostImageUrlDirect', () => {
  const mockPost = {
    id: '123',
    team_id: 'team-1',
    author_name: 'test-user',
    caption: 'Test caption',
    image_path: 'teams/team-1/123.webp',
    created_at: '2024-01-01T00:00:00Z',
  };

  it('returns null when post has no image path', async () => {
    expect(
      await getPostImageUrlDirect({ ...mockPost, image_path: '' }),
    ).toBeNull();
  });

  it('returns blob URL unchanged', async () => {
    expect(
      await getPostImageUrlDirect({ ...mockPost, image_path: 'blob:test' }),
    ).toBe('blob:test');
  });

  it('always returns non-transformed URL', async () => {
    const url = await getPostImageUrlDirect(mockPost);
    expect(url).toBe('https://example.com/public/teams/team-1/123.webp');
  });
});
