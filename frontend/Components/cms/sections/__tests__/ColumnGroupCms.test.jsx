import { render, screen } from '@testing-library/react';
import ColumnGroupCms from '../ColumnGroupCms';
import { makeColumnGroup } from '../../__tests__/fixtures';

describe('ColumnGroupCms', () => {
  it('renders content from each column body', () => {
    render(<ColumnGroupCms data={makeColumnGroup()} />);
    expect(screen.getByText('First column content.')).toBeInTheDocument();
    expect(screen.getByText('Second column content.')).toBeInTheDocument();
  });

  it('renders one grid child per column', () => {
    const { container } = render(<ColumnGroupCms data={makeColumnGroup()} />);
    const grid = container.querySelector('.grid');
    expect(grid.children).toHaveLength(2);
  });

  it('returns null when columns array is empty', () => {
    const { container } = render(<ColumnGroupCms data={makeColumnGroup({ columns: [] })} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when columns is absent', () => {
    const { container } = render(<ColumnGroupCms data={makeColumnGroup({ columns: undefined })} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies gridColumnStart style when col_start is set', () => {
    const { container } = render(
      <ColumnGroupCms
        data={makeColumnGroup({
          columns: [
            { column_name: 'A', body: 'Left gap.', col_start: 2 },
            { column_name: 'B', body: 'Right gap.', col_start: 3 },
          ],
        })}
      />
    );
    const [first, second] = container.querySelectorAll('.grid > div');
    expect(first).toHaveStyle({ gridColumnStart: 2 });
    expect(second).toHaveStyle({ gridColumnStart: 3 });
  });

  it('does not apply gridColumnStart style when col_start is absent', () => {
    const { container } = render(<ColumnGroupCms data={makeColumnGroup()} />);
    const [first, second] = container.querySelectorAll('.grid > div');
    expect(first).not.toHaveStyle('grid-column-start: 1');
    expect(second).not.toHaveStyle('grid-column-start: 2');
    expect(first.style.gridColumnStart).toBe('');
    expect(second.style.gridColumnStart).toBe('');
  });

  it('renders a section element as the shell', () => {
    const { container } = render(<ColumnGroupCms data={makeColumnGroup()} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('does not crash when data is undefined', () => {
    const { container } = render(<ColumnGroupCms data={undefined} />);
    expect(container.firstChild).toBeNull();
  });
});
