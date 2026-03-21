import { render, screen } from '@testing-library/react';
import DynamicZone from '../DynamicZone';
import { makeColumnGroup, makeStepGroup, makeGallery, makeFaq, makeImage, makeButton } from './fixtures';

jest.mock('../sections/ColumnGroupCms', () =>
  function ColumnGroupCms({ data, sectionVariant }) {
    return <div data-testid="column-group-cms" data-variant={sectionVariant}>{JSON.stringify(data)}</div>;
  }
);
jest.mock('../sections/StepGroupCms', () =>
  function StepGroupCms({ data }) {
    return <div data-testid="step-group-cms">{JSON.stringify(data)}</div>;
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
jest.mock('../sections/ImageCms', () =>
  function ImageCms({ data }) {
    return <div data-testid="image-cms">{JSON.stringify(data)}</div>;
  }
);
jest.mock('../sections/ButtonCms', () =>
  function ButtonCms({ data }) {
    return <div data-testid="button-cms">{JSON.stringify(data)}</div>;
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

  it('renders ColumnGroupCms for sections.column-group', () => {
    render(<DynamicZone sections={[makeColumnGroup()]} />);
    expect(screen.getByTestId('column-group-cms')).toBeInTheDocument();
  });

  it('passes sectionVariant="hero" to first ColumnGroupCms', () => {
    render(<DynamicZone sections={[makeColumnGroup()]} />);
    expect(screen.getByTestId('column-group-cms')).toHaveAttribute('data-variant', 'hero');
  });

  it('passes sectionVariant="default" to non-first ColumnGroupCms', () => {
    render(<DynamicZone sections={[makeGallery(), makeColumnGroup()]} />);
    expect(screen.getByTestId('column-group-cms')).toHaveAttribute('data-variant', 'default');
  });

  it('renders StepGroupCms for sections.step-group', () => {
    render(<DynamicZone sections={[makeStepGroup()]} />);
    expect(screen.getByTestId('step-group-cms')).toBeInTheDocument();
  });

  it('renders GalleryCms for sections.gallery', () => {
    render(<DynamicZone sections={[makeGallery()]} />);
    expect(screen.getByTestId('gallery-cms')).toBeInTheDocument();
  });

  it('renders FaqCms for sections.faq', () => {
    render(<DynamicZone sections={[makeFaq()]} />);
    expect(screen.getByTestId('faq-cms')).toBeInTheDocument();
  });

  it('renders ImageCms for sections.image', () => {
    render(<DynamicZone sections={[makeImage()]} />);
    expect(screen.getByTestId('image-cms')).toBeInTheDocument();
  });

  it('renders ButtonCms for sections.button', () => {
    render(<DynamicZone sections={[makeButton()]} />);
    expect(screen.getByTestId('button-cms')).toBeInTheDocument();
  });

  it('renders multiple sections in correct DOM order', () => {
    const sections = [makeColumnGroup(), makeStepGroup(), makeGallery(), makeFaq(), makeImage(), makeButton()];
    const { container } = render(<DynamicZone sections={sections} />);
    const rendered = container.querySelectorAll('[data-testid]');

    expect(rendered).toHaveLength(6);
    expect(rendered[0]).toHaveAttribute('data-testid', 'column-group-cms');
    expect(rendered[1]).toHaveAttribute('data-testid', 'step-group-cms');
    expect(rendered[2]).toHaveAttribute('data-testid', 'gallery-cms');
    expect(rendered[3]).toHaveAttribute('data-testid', 'faq-cms');
    expect(rendered[4]).toHaveAttribute('data-testid', 'image-cms');
    expect(rendered[5]).toHaveAttribute('data-testid', 'button-cms');
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
    const sections = [makeGallery(), { __component: 'sections.unknown' }, makeFaq()];

    render(<DynamicZone sections={sections} />);

    expect(screen.getByTestId('gallery-cms')).toBeInTheDocument();
    expect(screen.getByTestId('faq-cms')).toBeInTheDocument();
    expect(screen.queryByTestId('unknown-cms')).not.toBeInTheDocument();

    spy.mockRestore();
  });
});
