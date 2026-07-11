import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { WheelPickerModal } from './wheel-picker-modal';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock the Modal component since it uses Radix Dialog which can be tricky in JSDOM
vi.mock('@/components/ui/modal', () => ({
  Modal: ({ children, open, title, onOpenChange }: any) =>
    open ? (
      <div role="dialog">
        <h1>{title}</h1>
        {children}
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null,
}));

const mockItems = [
  { id: '1', label: 'Item 1' },
  { id: '2', label: 'Item 2' },
  { id: '3', label: 'Item 3' },
];

describe('WheelPickerModal', () => {
  it('calls onConfirm with the locally selected value, not the initial value', async () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <WheelPickerModal
        items={mockItems}
        value="1"
        open={true}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
        title="Test Modal"
      />,
    );

    const wheel = screen.getByRole('listbox');

    // Simulate keyboard navigation to move from "1" to "2"
    fireEvent.keyDown(wheel, { key: 'ArrowRight' });

    // Verify "Item 2" is now shown (internal state changed)
    expect(screen.getByText('Item 2')).toBeDefined();

    // Click Confirm button (using lowercase because of mock t returning key)
    const confirmButton = screen.getByText('confirm');
    fireEvent.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledWith('2');
  });

  it('resets local value when re-opening with a different value', () => {
    render(
      <WheelPickerModal
        items={mockItems}
        value="1"
        open={true}
        onOpenChange={() => {}}
        onConfirm={() => {}}
        title="Test Modal"
      />,
    );

    expect(screen.getByText('Item 1')).toBeDefined();

    // Close and re-open with value "3"
    render(
      <WheelPickerModal
        items={mockItems}
        value="3"
        open={true}
        onOpenChange={() => {}}
        onConfirm={() => {}}
        title="Test Modal"
      />,
    );

    expect(screen.getByText('Item 3')).toBeDefined();
  });
});
