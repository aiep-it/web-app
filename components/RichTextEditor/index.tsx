"use client";
import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import type { Editor } from "@ckeditor/ckeditor5-core";

export interface RichTextEditorProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
  disabled?: boolean;
  config?: any;
  height?: string | number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Content...",
  disabled = false,
  config = {},
  height = "300px",
}) => {
  const mergedConfig = {
    placeholder,
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "underline",
      "link",
      "|",
      "bulletedList",
      "numberedList",
      "|",
      "blockQuote",
      "insertTable",
      "undo",
      "redo",
    ],
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },

    ...config,
  };
  return (
    <div className="ck-wrapper  h-full" style={{ height: "100%" }}>
      <CKEditor
        editor={ClassicEditor as any}
        data={value}
        config={mergedConfig}
        disabled={disabled}
        onChange={(_, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
};

export default RichTextEditor;
