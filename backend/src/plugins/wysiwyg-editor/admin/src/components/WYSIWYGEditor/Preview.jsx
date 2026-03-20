import React, { useState, useEffect, useRef } from "react";
import { styled } from "styled-components";
import { wysiwygMarked } from "../../utils/marked-extensions";

const PreviewContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => `${theme.spaces[6]} ${theme.spaces[8]}`};
  background: ${({ theme }) => theme.colors.neutral0};
  color: ${({ theme }) => theme.colors.neutral800};
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 1.4rem;
  line-height: 1.65;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${({ theme }) => theme.colors.neutral900};
    font-weight: 600;
    margin: ${({ theme }) => `${theme.spaces[4]} 0 ${theme.spaces[2]}`};
  }
  h1 {
    font-size: 2.4rem;
  }
  h2 {
    font-size: 2rem;
  }
  h3 {
    font-size: 1.7rem;
  }
  h4 {
    font-size: 1.5rem;
  }

  p {
    margin-bottom: ${({ theme }) => theme.spaces[3]};
  }

  a {
    color: ${({ theme }) => theme.colors.primary600};
    text-decoration: underline;
  }

  strong {
    color: ${({ theme }) => theme.colors.neutral900};
    font-weight: 600;
  }

  em {
    font-style: italic;
  }

  ul,
  ol {
    padding-left: ${({ theme }) => theme.spaces[6]};
    margin-bottom: ${({ theme }) => theme.spaces[3]};
  }
  li {
    margin-bottom: ${({ theme }) => theme.spaces[1]};
  }

  blockquote {
    border-left: 2px solid ${({ theme }) => theme.colors.neutral200};
    margin: 0;
    padding-left: ${({ theme }) => theme.spaces[4]};
    color: ${({ theme }) => theme.colors.neutral600};
    font-style: italic;
    margin-bottom: ${({ theme }) => theme.spaces[3]};
  }

  code {
    font-family: "IBM Plex Mono", "Courier New", monospace;
    background: ${({ theme }) => theme.colors.neutral100};
    color: ${({ theme }) => theme.colors.neutral700};
    padding: ${({ theme }) => `${theme.spaces[1]} ${theme.spaces[2]}`};
    border-radius: ${({ theme }) => theme.borderRadius};
    font-size: 0.875em;
  }

  pre {
    background: ${({ theme }) => theme.colors.neutral900};
    color: ${({ theme }) => theme.colors.neutral0};
    padding: ${({ theme }) => theme.spaces[4]};
    border-radius: ${({ theme }) => theme.borderRadius};
    overflow-x: auto;
    margin-bottom: ${({ theme }) => theme.spaces[3]};

    code {
      background: transparent;
      color: inherit;
      padding: 0;
      border-radius: 0;
      font-size: inherit;
    }
  }

  hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.neutral200};
    margin: ${({ theme }) => `${theme.spaces[4]} 0`};
  }

  img {
    max-width: 100%;
    display: block;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: ${({ theme }) => theme.spaces[3]};
    font-size: 1.4rem;
  }
  th,
  td {
    border: 1px solid ${({ theme }) => theme.colors.neutral200};
    padding: ${({ theme }) => `${theme.spaces[2]} ${theme.spaces[3]}`};
    text-align: left;
  }
  th {
    background: ${({ theme }) => theme.colors.neutral100};
    color: ${({ theme }) => theme.colors.neutral700};
    font-weight: 600;
  }
`;

export default function Preview({ value }) {
  const [html, setHtml] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!value) {
        setHtml("");
        return;
      }
      try {
        setHtml(wysiwygMarked.parse(value));
      } catch (e) {
        setHtml(
          `<p style="color:#ee5e52;font-family:monospace">Parse error: ${e.message}</p>`,
        );
      }
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [value]);

  return <PreviewContainer dangerouslySetInnerHTML={{ __html: html }} />;
}
