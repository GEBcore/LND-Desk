import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

interface INIEditorProps {
  config: string;
  onChange: (value: string) => void;
}


function INIEditor({ config, onChange }: INIEditorProps) {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const initializeEditor = () => {
    if (!editorContainerRef.current || editorRef.current) return;

    editorRef.current = monaco.editor.create(document.getElementById('editor')!, {
      value: config,
      language: 'ini',
      theme: 'vs-dark',
      minimap: { enabled: false },
      fontFamily: 'monospace',
      fontSize: 13,
    });

    editorRef.current.onDidChangeModelContent(() => {
      const currentValue = editorRef.current?.getValue() || '';
      onChange(currentValue);
    });
  };

  if (editorRef.current && editorRef.current.getValue() !== config) {
    editorRef.current.setValue(config);
  }

  return <div ref={(container) => {
    editorContainerRef.current = container;
    initializeEditor(); 
  }} id="editor" style={{ height: '500px', width: '100%' }} />;
};

export default INIEditor;