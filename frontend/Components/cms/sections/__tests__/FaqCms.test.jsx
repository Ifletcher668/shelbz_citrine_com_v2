import { render, screen, fireEvent } from '@testing-library/react';
import FaqCms from '../FaqCms';
import { makeFaq } from '../../__tests__/fixtures';

// framer-motion auto-mocked via jest.config.js moduleNameMapper
// Radix accordion renders real DOM (no mock)

describe('FaqCms', () => {
  it('returns null when items is undefined', () => {
    const { container } = render(<FaqCms data={makeFaq({ items: undefined })} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when items is an empty array', () => {
    const { container } = render(<FaqCms data={makeFaq({ items: [] })} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders one accordion trigger per FAQ item', () => {
    render(<FaqCms data={makeFaq()} />);
    const triggers = screen.getAllByRole('button');
    expect(triggers).toHaveLength(2);
  });

  it('shows the question text in accordion triggers', () => {
    render(<FaqCms data={makeFaq()} />);
    expect(screen.getByText('What is your return policy?')).toBeInTheDocument();
    expect(screen.getByText('Do you ship internationally?')).toBeInTheDocument();
  });

  it('shows answer text after opening an accordion item', () => {
    render(<FaqCms data={makeFaq()} />);
    // Radix accordion content is unmounted when closed — click the trigger to mount it
    const trigger = screen.getByText('What is your return policy?');
    fireEvent.click(trigger);
    expect(screen.getByText('We offer a 30-day return policy.')).toBeInTheDocument();
  });

  it('does not crash when data is undefined', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<FaqCms data={undefined} />)).not.toThrow();
    consoleError.mockRestore();
  });
});
