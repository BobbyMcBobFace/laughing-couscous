import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

interface EditorPanelProps {
  language: string;
  code: string;
  onCodeChange: (value: string | undefined) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ language, code, onCodeChange }) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      value={code}
      onChange={onCodeChange}
      onMount={handleEditorDidMount}
      theme="vs-dark"
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', monospace",
        minimap: { enabled: false },
        scrollbar: {
          vertical: 'hidden',
          horizontal: 'hidden',
          handleMouseWheel: true,
        },
        overviewRulerLanes: 0,
      }}
    />
  );
};

export default EditorPanel;

