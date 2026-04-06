import CodeMirror from "codemirror5";
import "codemirror5/mode/markdown/markdown";

const MD_TAG_LINE = /^<\/?(md-[\w-]+)[^>]*\s*\/?>$/;

CodeMirror.defineMode("markdown-wysiwyg", (config) => {
  const mdMode = CodeMirror.getMode(config, "markdown");

  return {
    startState() {
      return { md: CodeMirror.startState(mdMode) };
    },
    copyState(state) {
      return { md: CodeMirror.copyState(mdMode, state.md) };
    },
    token(stream, state) {
      if (stream.sol() && MD_TAG_LINE.test(stream.string)) {
        stream.skipToEnd();
        return "md-tag";
      }
      return mdMode.token(stream, state.md);
    },
    blankLine(state) {
      if (mdMode.blankLine) mdMode.blankLine(state.md);
    },
    innerMode(state) {
      return { state: state.md, mode: mdMode };
    },
  };
});
