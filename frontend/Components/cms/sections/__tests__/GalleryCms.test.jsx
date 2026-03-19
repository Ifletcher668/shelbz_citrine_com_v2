import { render, screen } from '@testing-library/react';
import GalleryCms from '../GalleryCms';
import { makeGallery } from '../../__tests__/fixtures';

jest.mock('@/lib/strapi', () => ({
  getStrapiMediaUrl: jest.fn((url) => `http://mock-strapi${url}`),
}));

const { getStrapiMediaUrl } = require('@/lib/strapi');

beforeEach(() => {
  getStrapiMediaUrl.mockClear();
});

describe('GalleryCms', () => {
  it('returns null when images is undefined', () => {
    const { container } = render(<GalleryCms data={makeGallery({ images: undefined })} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when images is an empty array', () => {
    const { container } = render(<GalleryCms data={makeGallery({ images: [] })} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders all images', () => {
    render(<GalleryCms data={makeGallery()} />);
    const imgs = screen.getAllByRole('img');
    expect(imgs).toHaveLength(2);
  });

  it('calls getStrapiMediaUrl for each image URL', () => {
    const gallery = makeGallery();
    render(<GalleryCms data={gallery} />);

    expect(getStrapiMediaUrl).toHaveBeenCalledWith('/uploads/image1.jpg');
    expect(getStrapiMediaUrl).toHaveBeenCalledWith('/uploads/image2.jpg');
  });

  it('uses alternativeText as the img alt attribute', () => {
    render(<GalleryCms data={makeGallery()} />);
    expect(screen.getByAltText('Image one')).toBeInTheDocument();
  });

  it('falls back to image name when alternativeText is null', () => {
    render(<GalleryCms data={makeGallery()} />);
    expect(screen.getByAltText('image2.jpg')).toBeInTheDocument();
  });

  it('falls back to empty string when both alternativeText and name are null', () => {
    const gallery = makeGallery({
      images: [{ documentId: 'doc3', id: 3, url: '/uploads/img.jpg', alternativeText: null, name: null }],
    });
    const { container } = render(<GalleryCms data={gallery} />);
    // alt="" gives role="presentation", so query by attribute instead of role
    const img = container.querySelector('img[alt=""]');
    expect(img).toBeInTheDocument();
  });

  it('renders the title when provided', () => {
    render(<GalleryCms data={makeGallery({ title: 'Portfolio' })} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Portfolio');
  });

  it('omits the title when absent', () => {
    render(<GalleryCms data={makeGallery({ title: null })} />);
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  // Bug exposure: GalleryCms destructures data directly without a data ?? {} guard.
  // This test FAILS until the guard is added — that's intentional.
  it('BUG: should not crash when data is undefined (missing null guard)', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<GalleryCms data={undefined} />)).not.toThrow();
    consoleError.mockRestore();
  });
});
