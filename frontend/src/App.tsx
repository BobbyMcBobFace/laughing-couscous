// src/App.tsx
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { githubDarkTheme } from "./monacoTheme";
import "./App.css";

function App() {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    cout << n;
    return 0;
}`);
  const [stdin, setStdin] = useState("");
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [execTime, setExecTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleEditorMount = (editor, monacoInstance) => {
    monacoInstance.editor.defineTheme("github-dark", githubDarkTheme);
    monacoInstance.editor.setTheme("github-dark");

    document.fonts.ready.then(() => {
      editor.remeasureFonts();
    });
  };

  async function runCode() {
    setIsRunning(true);
    setStdout("");
    setStderr("");
    setExecTime(0);

    try {
      const resp = await fetch("http://localhost:8000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code, input: stdin }),
      });

      const data = await resp.json();
      setStdout(data.stdout || "");
      setStderr(data.stderr || data.error || "");
      setExecTime(data.exec_time_ms || 0);
    } catch (e) {
      setStderr("Failed to run code: " + e.message);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="app-container">
      <div className="editor-panel">
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language === "python38" ? "python" : "cpp"}
          value={code}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorMount}
          theme="github-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            fontLigatures: false,
            minimap: { enabled: false },
            scrollbar: {
              vertical: "hidden",
              horizontal: "hidden",
              handleMouseWheel: true,
            },
            overviewRulerLanes: 0,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
          }}
        />
      </div>

      <div className="right-panel">
        <div className="top-controls">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isRunning}
          >
            <option value="cpp">C++</option>
            <option value="python38">Python 3.8</option>
          </select>
          <button onClick={runCode} disabled={isRunning}>
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>

        <div className="stdin-container">
          <label>STDIN</label>
          <textarea
            className="stdin-textarea"
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            disabled={isRunning}
          />
        </div>

        <div className="output-container">
          <label>STDOUT</label>
          <pre className="output">{stdout}</pre>
        </div>

        <div className="stderr-container">
          <label>STDERR</label>
          <pre className="stderr">{stderr}</pre>
        </div>

        <div className="exec-time">Execution time: {execTime} ms</div>
      </div>
    </div>
  );
}

export default App;

