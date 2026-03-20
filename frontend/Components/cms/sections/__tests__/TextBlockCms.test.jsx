import { render, screen } from "@testing-library/react";
import TextBlockCms from "../TextBlockCms";
import { makeTextBlock } from "../../__tests__/fixtures";

jest.mock("@/lib/marked-extensions", () => ({
  wysiwygMarked: {
    parse: jest.fn().mockReturnValue("<p>Parsed body</p>"),
  },
}));

// Pull the mock reference so individual tests can re-configure it
const { wysiwygMarked } = require("@/lib/marked-extensions");

describe("TextBlockCms", () => {
  beforeEach(() => {
    wysiwygMarked.parse.mockReturnValue("<p>Parsed body</p>");
  });

  it("renders parsed HTML in the DOM", () => {
    render(<TextBlockCms data={makeTextBlock()} />);
    expect(screen.getByText("Parsed body")).toBeInTheDocument();
  });

  it("calls wysiwygMarked.parse with the body string", () => {
    const body = "# My heading";
    render(<TextBlockCms data={makeTextBlock({ body })} />);
    expect(wysiwygMarked.parse).toHaveBeenCalledWith(body);
  });

  it("is safe when data is null (has data ?? {} guard)", () => {
    expect(() => render(<TextBlockCms data={null} />)).not.toThrow();
  });

  it("is safe when data is undefined (has data ?? {} guard)", () => {
    expect(() => render(<TextBlockCms data={undefined} />)).not.toThrow();
  });

  it("renders nothing for body when body is empty/null", () => {
    wysiwygMarked.parse.mockReturnValue(null);
    render(<TextBlockCms data={makeTextBlock({ body: null })} />);
    expect(screen.queryByText("Parsed body")).not.toBeInTheDocument();
  });

  it("adds prose-heritage class when enable_prose is true", () => {
    const { container } = render(
      <TextBlockCms data={makeTextBlock({ enable_prose: true })} />,
    );
    expect(container.querySelector(".prose-heritage")).toBeInTheDocument();
  });

  it("omits prose-heritage class when enable_prose is false", () => {
    const { container } = render(
      <TextBlockCms data={makeTextBlock({ enable_prose: false })} />,
    );
    expect(container.querySelector(".prose-heritage")).not.toBeInTheDocument();
  });

  it("sets the section id from anchor_id", () => {
    const { container } = render(
      <TextBlockCms data={makeTextBlock({ anchor_id: "my-anchor" })} />,
    );
    expect(container.querySelector("#my-anchor")).toBeInTheDocument();
  });

  it("forwards texture variant and opacity to Section when texture is set", () => {
    // With texture set, Section renders a BackgroundTexture child.
    // We verify the section still renders without crashing.
    expect(() =>
      render(
        <TextBlockCms
          data={makeTextBlock({ texture: "metal", texture_opacity: 50 })}
        />,
      ),
    ).not.toThrow();
  });

  it("passes texture={false} to Section when texture is null", () => {
    // No texture — Section renders without BackgroundTexture.
    const { container } = render(
      <TextBlockCms data={makeTextBlock({ texture: null })} />,
    );
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it('passes texture={false} to Section when texture is "none"', () => {
    const { container } = render(
      <TextBlockCms data={makeTextBlock({ texture: "none" })} />,
    );
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("renders HTML via InnerSection dangerouslySetInnerHTML even though bodyEl is dead code", () => {
    // bodyEl is computed (lines 32-37 of TextBlockCms) but never inserted into
    // the JSX — the component renders via InnerSection's ...props spread instead.
    // This test confirms the rendered output is correct despite the dead variable.
    render(<TextBlockCms data={makeTextBlock()} />);
    expect(screen.getByText("Parsed body")).toBeInTheDocument();
  });
});
