import { render, screen } from '@testing-library/react';
import HeroCms from '../HeroCms';
import { makeHero } from '../../__tests__/fixtures';

// framer-motion is auto-mocked via jest.config.js moduleNameMapper
// next/link is handled by next/jest's SWC transform

describe('HeroCms', () => {
  it('renders headline, subheadline, and CTA with full data', () => {
    render(<HeroCms data={makeHero()} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Headline');
    expect(screen.getByText('Test subheadline text.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Learn More' })).toBeInTheDocument();
  });

  it('renders headline when provided', () => {
    render(<HeroCms data={makeHero({ headline: 'My Title' })} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('My Title');
  });

  it('omits h1 when headline is absent', () => {
    render(<HeroCms data={makeHero({ headline: null })} />);
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('renders subheadline when provided', () => {
    render(<HeroCms data={makeHero({ subheadline: 'Sub text' })} />);
    expect(screen.getByText('Sub text')).toBeInTheDocument();
  });

  it('omits subheadline when absent', () => {
    render(<HeroCms data={makeHero({ subheadline: null })} />);
    // headline h1 is present but no sibling <p> for subheadline
    expect(screen.queryByText('Test subheadline text.')).not.toBeInTheDocument();
  });

  it('renders CTA link only when both cta_text and cta_link are provided', () => {
    render(<HeroCms data={makeHero({ cta_text: 'Click', cta_link: '/go' })} />);
    expect(screen.getByRole('link', { name: 'Click' })).toBeInTheDocument();
  });

  it('omits CTA link when only cta_text is provided', () => {
    render(<HeroCms data={makeHero({ cta_text: 'Click', cta_link: null })} />);
    expect(screen.queryByRole('link', { name: 'Click' })).not.toBeInTheDocument();
  });

  it('omits CTA link when only cta_link is provided', () => {
    render(<HeroCms data={makeHero({ cta_text: null, cta_link: '/go' })} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders the section shell even with all optional fields empty', () => {
    const { container } = render(
      <HeroCms data={makeHero({ headline: null, subheadline: null, cta_text: null, cta_link: null })} />
    );
    // Section element should still be in the DOM
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('does not crash when data is undefined', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<HeroCms data={undefined} />)).not.toThrow();
    consoleError.mockRestore();
  });
});
