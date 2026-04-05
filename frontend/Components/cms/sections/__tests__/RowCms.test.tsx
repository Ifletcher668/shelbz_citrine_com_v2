import { render, screen } from '@testing-library/react';
import RowCms from '../RowCms';
import { makeRow } from '../../__tests__/fixtures';

describe('RowCms', () => {
  it('renders content from each column body', () => {
    render(<RowCms data={makeRow()} />);
    expect(screen.getByText('First column content.')).toBeInTheDocument();
    expect(screen.getByText('Second column content.')).toBeInTheDocument();
  });

  it('renders one grid child per column', () => {
    const { container } = render(<RowCms data={makeRow()} />);
    const grid = container.querySelector('.grid');
    expect(grid!.children).toHaveLength(2);
  });

  it('returns null when columns array is empty', () => {
    const { container } = render(<RowCms data={makeRow({ columns: [] })} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when data has no columns', () => {
    const { container } = render(<RowCms data={makeRow({ columns: undefined })} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a section element as the shell', () => {
    const { container } = render(<RowCms data={makeRow()} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('applies grid-cols class based on column count', () => {
    const { container } = render(<RowCms data={makeRow()} />);
    const grid = container.querySelector('.grid');
    expect(grid?.className).toContain('md:grid-cols-2');
  });
});
