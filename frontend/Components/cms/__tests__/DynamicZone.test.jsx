import { render, screen } from '@testing-library/react';
import DynamicZone from '../DynamicZone';
import { makeRow } from './fixtures';

jest.mock('../sections/RowCms', () =>
  function RowCms({ data, sectionVariant }) {
    return <div data-testid="row-cms" data-variant={sectionVariant}>{JSON.stringify(data)}</div>;
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

  it('passes sectionVariant="hero" to first RowCms', () => {
    render(<DynamicZone sections={[makeRow()]} />);
    expect(screen.getByTestId('row-cms')).toHaveAttribute('data-variant', 'hero');
  });

  it('passes sectionVariant="default" to non-first RowCms', () => {
    render(<DynamicZone sections={[makeRow({ id: 1 }), makeRow({ id: 2 })]} />);
    const sections = screen.getAllByTestId('row-cms');
    expect(sections[1]).toHaveAttribute('data-variant', 'default');
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

  it('renders known sections and omits unknown ones', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const sections = [makeRow({ id: 1 }), { __component: 'sections.unknown', id: 99 }, makeRow({ id: 2 })];

    render(<DynamicZone sections={sections} />);

    expect(screen.getAllByTestId('row-cms')).toHaveLength(2);
    expect(screen.queryByTestId('unknown-cms')).not.toBeInTheDocument();

    spy.mockRestore();
  });
});
