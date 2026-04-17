import { render, screen } from '@testing-library/react';
import DynamicZone from '../DynamicZone';
import { makeRow, makeGallery } from './fixtures';

jest.mock('../sections/RowCms', () =>
  function RowCms({ data, className }) {
    return <div data-testid="row-cms" data-class={className}>{JSON.stringify(data)}</div>;
  }
);

jest.mock('../sections/GalleryCms', () =>
  function GalleryCms({ data, galleries, className }) {
    return (
      <div
        data-testid="gallery-cms"
        data-class={className}
        data-mode={galleries ? 'tabs' : 'single'}
      >
        {galleries ? `galleries:${galleries.length}` : JSON.stringify(data)}
      </div>
    );
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

  it('renders RowCms for sections.row', () => {
    render(<DynamicZone sections={[makeRow()]} />);
    expect(screen.getByTestId('row-cms')).toBeInTheDocument();
  });

  it('passes section-hero class to first section', () => {
    render(<DynamicZone sections={[makeRow({ id: 1 }), makeRow({ id: 2 })]} />);
    expect(screen.getAllByTestId('row-cms')[0]).toHaveAttribute('data-class', 'section-hero');
  });

  it('passes section-last class to last section', () => {
    render(<DynamicZone sections={[makeRow({ id: 1 }), makeRow({ id: 2 })]} />);
    expect(screen.getAllByTestId('row-cms')[1]).toHaveAttribute('data-class', 'section-last');
  });

  it('passes no position class to middle sections', () => {
    render(<DynamicZone sections={[makeRow({ id: 1 }), makeRow({ id: 2 }), makeRow({ id: 3 })]} />);
    expect(screen.getAllByTestId('row-cms')[1]).not.toHaveAttribute('data-class');
  });

  it('passes both section-hero and section-last to single section', () => {
    render(<DynamicZone sections={[makeRow()]} />);
    expect(screen.getByTestId('row-cms')).toHaveAttribute('data-class', 'section-hero section-last');
  });

  it('renders multiple sections in correct DOM order', () => {
    const sections = [makeRow({ id: 1 }), makeRow({ id: 2 }), makeRow({ id: 3 })];
    const { container } = render(<DynamicZone sections={sections} />);
    const rendered = container.querySelectorAll('[data-testid]');

    expect(rendered).toHaveLength(3);
    rendered.forEach(el => expect(el).toHaveAttribute('data-testid', 'row-cms'));
  });

  it('warns in development when __component is unknown', () => {
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', configurable: true });
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    render(<DynamicZone sections={[{ __component: 'sections.unknown', id: 99 }]} />);

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

    render(<DynamicZone sections={[{ __component: 'sections.unknown', id: 99 }]} />);

    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
    Object.defineProperty(process.env, 'NODE_ENV', { value: originalEnv, configurable: true });
  });

  it('renders GalleryCms in single mode for sections.media-gallery with use_new_page_pagination=true', () => {
    const section = makeGallery({ id: 5, use_new_page_pagination: true, pagination_id: '2023' });
    render(<DynamicZone sections={[section]} />);
    const el = screen.getByTestId('gallery-cms');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('data-mode', 'single');
  });

  it('renders multiple galleries as separate elements', () => {
    const sections = [
      makeGallery({ id: 10, pagination_id: '2023' }),
      makeGallery({ id: 11, pagination_id: '2024' }),
    ];
    render(<DynamicZone sections={sections} />);
    expect(screen.getAllByTestId('gallery-cms')).toHaveLength(2);
  });

  it('does not group route-paginated gallery with client-paginated gallery', () => {
    const sections = [
      makeGallery({ id: 10, pagination_id: '2023', use_new_page_pagination: false }),
      makeGallery({ id: 11, pagination_id: '2024', use_new_page_pagination: true }),
    ];
    render(<DynamicZone sections={sections} />);
    expect(screen.getAllByTestId('gallery-cms')).toHaveLength(2);
  });

  it('renders known sections and omits unknown ones', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const sections = [makeRow({ id: 1 }), { __component: 'sections.unknown', id: 99 }, makeRow({ id: 2 })];

    render(<DynamicZone sections={sections} />);

    expect(screen.getAllByTestId('row-cms')).toHaveLength(2);
    expect(screen.queryByTestId('unknown-cms')).not.toBeInTheDocument();

    spy.mockRestore();
  });
});
