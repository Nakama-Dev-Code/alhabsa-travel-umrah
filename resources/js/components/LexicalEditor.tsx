import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { HashtagNode } from "@lexical/hashtag";
import { ToolbarPlugin } from "./plugins/ToolbarPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";
import { editorConfig } from "./editorConfig";
import "../../css/LexicalEditor.css";

interface LexicalEditorProps {
  value: string;
  onChange: (value: string) => void;
  errors?: string | string[];
}

export default function LexicalEditor({ value, onChange, errors }: LexicalEditorProps) {
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Plugin untuk mengambil HTML dari editor dan mengirimkan ke parent component
  function UpdatePlugin({ onChange }: { onChange: (value: string) => void }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
      if (!isEditorReady && value && editor) {
        try {
          editor.update(() => {
            // Parse HTML to Lexical nodes
            const parser = new DOMParser();
            const dom = parser.parseFromString(value, "text/html");
            
            // Import nodes to editor
            const nodes = $generateNodesFromDOM(editor, dom);
            const root = $getRoot();
            root.clear();
            $insertNodes(nodes);
          });
        } catch (error) {
          console.error("Error parsing HTML:", error);
        }
        setIsEditorReady(true);
      }
    }, [editor, value, isEditorReady]);

    useEffect(() => {
      return editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const htmlString = $generateHtmlFromNodes(editor);
          onChange(htmlString);
        });
      });
    }, [editor, onChange]);

    return null;
  }

  return (
    <div className="lexical-editor-container">
      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-container">
          <ToolbarPlugin />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<div className="editor-placeholder">Tuliskan sesuatu...</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <LinkPlugin />
            <TablePlugin />
            <UpdatePlugin onChange={onChange} />
          </div>
        </div>
      </LexicalComposer>
      {errors && (
        <p className="text-sm text-red-600 mt-1">
          {Array.isArray(errors) ? errors[0] : errors}
        </p>
      )}
    </div>
  );
}