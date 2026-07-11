import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RadialWheelPicker } from './radial-wheel-picker';

const mockItems = [
  { id: '1', label: 'Item 1' },
  { id: '2', label: 'Item 2' },
  { id: '3', label: 'Item 3' },
];

describe('RadialWheelPicker', () => {
  it('renders correctly and shows active item label', () => {
    render(
      <RadialWheelPicker
        items={mockItems}
        value="1"
        onChange={() => {}}
        onConfirm={() => {}}
      />,
    );
    expect(screen.getByText('Item 1')).toBeDefined();
  });

  it('calls onChange when keyboard navigating', () => {
    const onChange = vi.fn();
    render(
      <RadialWheelPicker
        items={mockItems}
        value="1"
        onChange={onChange}
        onConfirm={() => {}}
      />,
    );

    const wheel = screen.getByRole('listbox');
    fireEvent.keyDown(wheel, { key: 'ArrowRight' });

    // index 0 -> 1
    expect(onChange).toHaveBeenCalledWith('2');
  });

  it('calls onConfirm when Enter is pressed', () => {
    const onConfirm = vi.fn();
    render(
      <RadialWheelPicker
        items={mockItems}
        value="1"
        onChange={() => {}}
        onConfirm={onConfirm}
      />,
    );

    const wheel = screen.getByRole('listbox');
    fireEvent.keyDown(wheel, { key: 'Enter' });

    expect(onConfirm).toHaveBeenCalledWith('1');
  });
});
