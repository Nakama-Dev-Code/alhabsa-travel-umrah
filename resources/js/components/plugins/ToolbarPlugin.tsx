import { useCallback, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $createParagraphNode,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical";
import {
  $isParentElementRTL,
  $wrapNodes,
  $isAtNodeEnd,
} from "@lexical/selection";
import { $createNodeSelection, $getRoot, $getSelection, $isRangeSelection, $setSelection } from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from "@lexical/rich-text";
import { $createCodeNode } from "@lexical/code";
import { createPortal } from "react-dom";
import { INSERT_TABLE_COMMAND } from "@lexical/table";

const LowPriority = 1;

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [blockType, setBlockType] = useState<string>("paragraph");
  const [isLink, setIsLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
      
      // Update block type
      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === "root"
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();
      
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      
      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $isListNode(element.getParent())
            ? element.getParent()
            : null;
          const type = element.getListType();
          setBlockType(type === "bullet" ? "bullet" : "number");
        } else {
          const type = element.getType();
          if (type.startsWith("heading")) {
            setBlockType(type);
          } else {
            setBlockType(type);
          }
        }
      }
    }
  }, [editor]);

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach(node => {
          const parent = node.getParent();
          if (parent) {
            const paragraphNode = $createParagraphNode();
            parent.insertAfter(paragraphNode);
            node.remove();
            paragraphNode.select();
          }
        });
      }
    });
  };

  const formatHeading = (headingLevel: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach(node => {
          const parent = node.getParent();
          if (parent) {
            const headingNode = $createHeadingNode(headingLevel);
            parent.insertAfter(headingNode);
            node.remove();
            headingNode.select();
          }
        });
      }
    });
  };

  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const formatNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach(node => {
          const parent = node.getParent();
          if (parent) {
            const quoteNode = $createQuoteNode();
            parent.insertAfter(quoteNode);
            node.remove();
            quoteNode.select();
          }
        });
      }
    });
  };

  const formatCode = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach(node => {
          const parent = node.getParent();
          if (parent) {
            const codeNode = $createCodeNode();
            parent.insertAfter(codeNode);
            node.remove();
            codeNode.select();
          }
        });
      }
    });
  };

  const insertTable = () => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      rows: 3,
      columns: 3,
    });
  };

  const insertLink = () => {
    if (linkUrl) {
      // Apply link formatting
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "link");
      setShowLinkModal(false);
      setLinkUrl("");
    }
  };

  // Subscribe to changes
  editor.registerUpdateListener(({ editorState }) => {
    editorState.read(() => {
      updateToolbar();
    });
  });

  return (
    <div className="toolbar">
      <button
        type="button"
        className={`toolbar-item ${isBold ? "active" : ""}`}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        aria-label="Format Bold"
      >
        <i className="format bold">B</i>
      </button>
      <button
        type="button"
        className={`toolbar-item ${isItalic ? "active" : ""}`}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        aria-label="Format Italics"
      >
        <i className="format italic">I</i>
      </button>
      <button
        type="button"
        className={`toolbar-item ${isUnderline ? "active" : ""}`}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        aria-label="Format Underline"
      >
        <i className="format underline">U</i>
      </button>
      <button
        type="button"
        className={`toolbar-item ${isStrikethrough ? "active" : ""}`}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}
        aria-label="Format Strikethrough"
      >
        <i className="format strikethrough">S</i>
      </button>
      <button
        type="button"
        className={`toolbar-item ${isCode ? "active" : ""}`}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
        aria-label="Format Code"
      >
        <i className="format code">{"</>"}</i>
      </button>
      <div className="toolbar-divider"></div>
      <button
        type="button"
        className={`toolbar-item ${blockType === "paragraph" ? "active" : ""}`}
        onClick={formatParagraph}
        aria-label="Paragraph"
      >
        <i className="format paragraph">P</i>
      </button>
      <button
        type="button"
        className={`toolbar-item ${blockType === "h1" ? "active" : ""}`}
        onClick={() => formatHeading("h1")}
        aria-label="Heading 1"
      >
        <i className="format h1">H1</i>
      </button>
      <button
        type="button"
        className={`toolbar-item ${blockType === "h2" ? "active" : ""}`}
        onClick={() => formatHeading("h2")}
        aria-label="Heading 2"
      >
        <i className="format h2">H2</i>
      </button>
      <button
        type="button"
        className={`toolbar-item ${blockType === "h3" ? "active" : ""}`}
        onClick={() => formatHeading("h3")}
        aria-label="Heading 3"
      >
        <i className="format h3">H3</i>
      </button>
      <div className="toolbar-divider"></div>
      <button
        type="button"
        className={`toolbar-item ${blockType === "bullet" ? "active" : ""}`}
        onClick={formatBulletList}
        aria-label="Bullet List"
      >
        <i className="format bullet-list">• List</i>
      </button>
      <button
        type="button"
        className={`toolbar-item ${blockType === "number" ? "active" : ""}`}
        onClick={formatNumberedList}
        aria-label="Numbered List"
      >
        <i className="format numbered-list">1. List</i>
      </button>
      <button
        type="button"
        className={`toolbar-item ${blockType === "quote" ? "active" : ""}`}
        onClick={formatQuote}
        aria-label="Quote"
      >
        <i className="format quote">"</i>
      </button>
      <button
        type="button"
        className="toolbar-item"
        onClick={insertTable}
        aria-label="Insert Table"
      >
        <i className="format table">Table</i>
      </button>
      <button
        type="button"
        className={`toolbar-item ${isLink ? "active" : ""}`}
        onClick={() => setShowLinkModal(true)}
        aria-label="Insert Link"
      >
        <i className="format link">🔗</i>
      </button>
      <div className="toolbar-divider"></div>
      <button
        type="button"
        className="toolbar-item"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        aria-label="Undo"
      >
        <i className="format undo">↩</i>
      </button>
      <button
        type="button"
        className="toolbar-item"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        aria-label="Redo"
      >
        <i className="format redo">↪</i>
      </button>

      {showLinkModal && (
        <div className="link-modal">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Masukkan URL"
          />
          <button onClick={insertLink}>Simpan</button>
          <button onClick={() => setShowLinkModal(false)}>Batal</button>
        </div>
      )}
    </div>
  );
}