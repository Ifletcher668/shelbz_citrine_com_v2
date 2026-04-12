import { render, screen, fireEvent } from '@testing-library/react';
import GalleryCms from '../GalleryCms';
import { makeGallery, makeGalleryItem, makeGalleryGroup } from '../../__tests__/fixtures';

jest.mock('../../../../lib/strapi', () => ({
  getStrapiMediaUrl: (url) => (url ? `http://localhost:1337${url}` : null),
  buildStrapiSrcSet: () => null,
}));

describe('GalleryCms', () => {
  it('returns null when neither data nor galleries provided', () => {
    const { container } = render(<GalleryCms />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when data is undefined', () => {
    const { container } = render(<GalleryCms data={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the gallery title', () => {
    render(<GalleryCms data={makeGallery({ title: 'Archive 2023' })} />);
    expect(screen.getByText('Archive 2023')).toBeInTheDocument();
  });

  it('renders an image for each gallery item', () => {
    const { container } = render(<GalleryCms data={makeGallery()} />);
    expect(container.querySelectorAll('img')).toHaveLength(2);
  });

  it('renders alt text on images', () => {
    render(<GalleryCms data={makeGallery()} />);
    expect(screen.getByAltText('Image one')).toBeInTheDocument();
  });

  it('uses full URL from getStrapiMediaUrl', () => {
    render(<GalleryCms data={makeGallery()} />);
    const img = screen.getByAltText('Image one');
    expect(img).toHaveAttribute('src', 'http://localhost:1337/uploads/image1.jpg');
  });

  it('does not render tab bar for a single gallery', () => {
    render(<GalleryCms data={makeGallery({ pagination_id: '2023' })} />);
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('renders tab bar when multiple galleries provided', () => {
    render(<GalleryCms galleries={makeGalleryGroup()} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('renders a tab for each gallery in the group', () => {
    render(<GalleryCms galleries={makeGalleryGroup()} />);
    expect(screen.getAllByRole('tab')).toHaveLength(2);
  });

  it('shows the first gallery images by default', () => {
    const galleries = makeGalleryGroup();
    const { container } = render(<GalleryCms galleries={galleries} />);
    expect(container.querySelectorAll('img')).toHaveLength(2);
  });

  it('shows empty state message when Images array is empty', () => {
    render(<GalleryCms data={makeGallery({ Images: [] })} />);
    expect(screen.getByText(/no images/i)).toBeInTheDocument();
  });

  it('renders the section wrapper', () => {
    const { container } = render(<GalleryCms data={makeGallery()} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('does not crash when image has no alternativeText', () => {
    const gallery = makeGallery({
      Images: [{ id: 5, url: '/uploads/test.jpg', alternativeText: null, width: 400, height: 300, formats: null }],
    });
    expect(() => render(<GalleryCms data={gallery} />)).not.toThrow();
  });

  it('renders a button tile (lightbox) for flat Images entries', () => {
    render(<GalleryCms data={makeGallery()} />);
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });
});
