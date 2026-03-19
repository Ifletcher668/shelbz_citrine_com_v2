import { render, screen } from '@testing-library/react';
import DynamicZone from '../DynamicZone';
import { makeHero, makeTextBlock, makeGallery, makeFaq, makeCta } from './fixtures';

jest.mock('../sections/HeroCms', () =>
  function HeroCms({ data }) {
    return <div data-testid="hero-cms">{JSON.stringify(data)}</div>;
  }
);
jest.mock('../sections/TextBlockCms', () =>
  function TextBlockCms({ data }) {
    return <div data-testid="text-block-cms">{JSON.stringify(data)}</div>;
  }
);
jest.mock('../sections/GalleryCms', () =>
  function GalleryCms({ data }) {
    return <div data-testid="gallery-cms">{JSON.stringify(data)}</div>;
  }
);
jest.mock('../sections/FaqCms', () =>
  function FaqCms({ data }) {
    return <div data-testid="faq-cms">{JSON.stringify(data)}</div>;
  }
);
jest.mock('../sections/CtaCms', () =>
  function CtaCms({ data }) {
    return <div data-testid="cta-cms">{JSON.stringify(data)}</div>;
  }
);

describe('DynamicZone', () => {
  it('returns null when sections is null', () => {
    const { container } = render(<DynamicZone sections={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when sections is undefined', () => {
    const { container } = render(<DynamicZone sections={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when sections is an empty array', () => {
    const { container } = render(<DynamicZone sections={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders HeroCms for sections.hero', () => {
    render(<DynamicZone sections={[makeHero()]} />);
    expect(screen.getByTestId('hero-cms')).toBeInTheDocument();
  });

  it('renders TextBlockCms for sections.text-block', () => {
    render(<DynamicZone sections={[makeTextBlock()]} />);
    expect(screen.getByTestId('text-block-cms')).toBeInTheDocument();
  });

  it('renders GalleryCms for sections.gallery', () => {
    render(<DynamicZone sections={[makeGallery()]} />);
    expect(screen.getByTestId('gallery-cms')).toBeInTheDocument();
  });

  it('renders FaqCms for sections.faq', () => {
    render(<DynamicZone sections={[makeFaq()]} />);
    expect(screen.getByTestId('faq-cms')).toBeInTheDocument();
  });

  it('renders CtaCms for sections.cta', () => {
    render(<DynamicZone sections={[makeCta()]} />);
    expect(screen.getByTestId('cta-cms')).toBeInTheDocument();
  });

  it('renders multiple sections in correct DOM order', () => {
    const sections = [makeHero(), makeTextBlock(), makeGallery(), makeFaq(), makeCta()];
    const { container } = render(<DynamicZone sections={sections} />);
    const rendered = container.querySelectorAll('[data-testid]');

    expect(rendered).toHaveLength(5);
    expect(rendered[0]).toHaveAttribute('data-testid', 'hero-cms');
    expect(rendered[1]).toHaveAttribute('data-testid', 'text-block-cms');
    expect(rendered[2]).toHaveAttribute('data-testid', 'gallery-cms');
    expect(rendered[3]).toHaveAttribute('data-testid', 'faq-cms');
    expect(rendered[4]).toHaveAttribute('data-testid', 'cta-cms');
  });

  it('warns in development when __component is unknown', () => {
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', configurable: true });
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    render(<DynamicZone sections={[{ __component: 'sections.unknown' }]} />);

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('sections.unknown')
    );

    spy.mockRestore();
    Object.defineProperty(process.env, 'NODE_ENV', { value: originalEnv, configurable: true });
  });

  it('does not warn in production when __component is unknown', () => {
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', configurable: true });
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    render(<DynamicZone sections={[{ __component: 'sections.unknown' }]} />);

    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
    Object.defineProperty(process.env, 'NODE_ENV', { value: originalEnv, configurable: true });
  });

  it('renders known sections and omits unknown ones', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const sections = [makeHero(), { __component: 'sections.unknown' }, makeCta()];

    render(<DynamicZone sections={sections} />);

    expect(screen.getByTestId('hero-cms')).toBeInTheDocument();
    expect(screen.getByTestId('cta-cms')).toBeInTheDocument();
    expect(screen.queryByTestId('unknown-cms')).not.toBeInTheDocument();

    spy.mockRestore();
  });
});
