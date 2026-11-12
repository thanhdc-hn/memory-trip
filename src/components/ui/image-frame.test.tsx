import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ImageFrame } from './image-frame';

describe('ImageFrame', () => {
  it('renders the themed polaroid frame with tape by default', () => {
    const { container } = render(
      <ImageFrame src="/photo.jpg" caption="Beach day" rotation={2} />,
    );
    const frame = container.firstElementChild as HTMLElement;

    expect(frame).toHaveClass('polaroid-frame');
    expect(frame).toHaveAttribute('data-deco', 'tape');
    expect(frame.style.transform).toBe('rotate(2deg)');
    expect(screen.getByText('Beach day')).toBeInTheDocument();
  });

  it('supports the emoji sticker and no decoration', () => {
    const { container, rerender } = render(
      <ImageFrame src="/photo.jpg" decoration="sticker" />,
    );
    expect(container.firstElementChild).toHaveAttribute('data-deco', 'sticker');

    rerender(<ImageFrame src="/photo.jpg" decoration="none" />);
    expect(container.firstElementChild).toHaveAttribute('data-deco', 'none');
  });

  it('does not hard-code the frame colors in utility classes', () => {
    const { container } = render(<ImageFrame src="/photo.jpg" />);
    const frame = container.firstElementChild as HTMLElement;

    expect(frame).not.toHaveClass('bg-paper');
    expect(frame).not.toHaveClass('shadow-polaroid');
  });
});
