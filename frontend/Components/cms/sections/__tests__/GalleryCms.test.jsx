import { render, screen } from "@testing-library/react";
import GalleryCms from "../GalleryCms";
import { makeGallery } from "../../__tests__/fixtures";

jest.mock("../../../../lib/strapi-cms/strapiApi", () => ({
  getStrapiMediaUrl: (url) => (url ? `http://test:123${url}` : null),
  buildStrapiSrcSet: () => null,
}));

describe("GalleryCms", () => {
  it("renders the gallery title", () => {
    render(<GalleryCms data={makeGallery({ title: "Archive 2023" })} />);
    expect(screen.getByText("Archive 2023")).toBeInTheDocument();
  });

  it("renders an image for each gallery item", () => {
    const { container } = render(<GalleryCms data={makeGallery()} />);
    expect(container.querySelectorAll("img")).toHaveLength(2);
  });

  it("renders alt text on images", () => {
    render(<GalleryCms data={makeGallery()} />);
    expect(screen.getByAltText("Image one")).toBeInTheDocument();
  });

  it("shows empty state message when Images array is empty", () => {
    render(<GalleryCms data={makeGallery({ Images: [] })} />);
    expect(screen.getByText(/no images/i)).toBeInTheDocument();
  });

  it("renders the section wrapper", () => {
    const { container } = render(<GalleryCms data={makeGallery()} />);
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("does not crash when image has no alternativeText", () => {
    const gallery = makeGallery({
      Images: [
        {
          id: 5,
          url: "/uploads/test.jpg",
          alternativeText: null,
          width: 400,
          height: 300,
          formats: null,
        },
      ],
    });
    expect(() => render(<GalleryCms data={gallery} />)).not.toThrow();
  });

  it("renders a button tile (lightbox) for each image", () => {
    render(<GalleryCms data={makeGallery()} />);
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });
});
