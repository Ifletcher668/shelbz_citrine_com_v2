import { render, screen } from '@testing-library/react';
import CtaCms from '../CtaCms';
import { makeCta } from '../../__tests__/fixtures';

// framer-motion auto-mocked via jest.config.js moduleNameMapper
// next/link handled by next/jest SWC transform

jest.mock('lucide-react', () => ({
  Sparkles: () => <span data-testid="sparkles-icon" />,
}));

describe('CtaCms', () => {
  it('renders headline, body, and button with full data', () => {
    render(<CtaCms data={makeCta()} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Book a Consultation');
    expect(screen.getByText('Ready to create something unique?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get Started' })).toBeInTheDocument();
  });

  it('renders the Sparkles icon', () => {
    render(<CtaCms data={makeCta()} />);
    expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
  });

  it('renders headline when provided', () => {
    render(<CtaCms data={makeCta({ headline: 'My CTA' })} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('My CTA');
  });

  it('omits h2 when headline is absent', () => {
    render(<CtaCms data={makeCta({ headline: null })} />);
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('renders body text when provided', () => {
    render(<CtaCms data={makeCta({ body: 'Some body text' })} />);
    expect(screen.getByText('Some body text')).toBeInTheDocument();
  });

  it('omits body text when absent', () => {
    render(<CtaCms data={makeCta({ body: null })} />);
    expect(screen.queryByText('Ready to create something unique?')).not.toBeInTheDocument();
  });

  it('renders button link only when both button_text and button_link are provided', () => {
    render(<CtaCms data={makeCta({ button_text: 'Go', button_link: '/go' })} />);
    expect(screen.getByRole('link', { name: 'Go' })).toBeInTheDocument();
  });

  it('omits button when only button_text is provided', () => {
    render(<CtaCms data={makeCta({ button_text: 'Go', button_link: null })} />);
    expect(screen.queryByRole('link', { name: 'Go' })).not.toBeInTheDocument();
  });

  it('omits button when only button_link is provided', () => {
    render(<CtaCms data={makeCta({ button_text: null, button_link: '/go' })} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders the section shell even with all optional fields empty', () => {
    const { container } = render(
      <CtaCms data={makeCta({ headline: null, body: null, button_text: null, button_link: null })} />
    );
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  // Bug exposure: CtaCms destructures data directly without a data ?? {} guard.
  // This test FAILS until the guard is added — that's intentional.
  it('BUG: should not crash when data is undefined (missing null guard)', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<CtaCms data={undefined} />)).not.toThrow();
    consoleError.mockRestore();
  });
});
