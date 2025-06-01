import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { githubDarkTheme } from "./monacoTheme";
import TopBar from "./components/TopBar";
import SubmissionTab from "./components/tabs/SubmissionTab";
import "./App.css";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Submission");

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

  const handleEditorMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monacoInstance: typeof monaco
  ) => {
    monacoInstance.editor.defineTheme("github-dark", githubDarkTheme);
    monacoInstance.editor.setTheme("github-dark");

    document.fonts.ready.then(() => {
      editor.remeasureFonts();
    });
  };

  const runCode = async () => {
    setIsRunning(true);
    setStdout("");
    setStderr("");
    setExecTime(0);

    try {
      const response = await fetch("http://localhost:8000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code, input: stdin }),
      });

      const data = await response.json();
      setStdout(data.stdout || "");
      setStderr(data.stderr || data.error || "");
      setExecTime(data.exec_time_ms || 0);
    } catch (e: any) {
      setStderr("Failed to run code: " + e.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="app-container">
        <div className="editor-panel">
          <Editor
            height="100%"
            defaultLanguage={language}
            language={language === "python38" ? "python" : "cpp"}
            value={code}
            onChange={(val) => setCode(val || "")}
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
            }}
          />
        </div>

        <div className="right-panel">
          {activeTab === "submission" && (
            <SubmissionTab
              language={language}
              setLanguage={setLanguage}
              stdin={stdin}
              setStdin={setStdin}
              stdout={stdout}
              stderr={stderr}
              execTime={execTime}
              runCode={runCode}
              isRunning={isRunning}
            />
          )}
          {activeTab !== "submission" && (
            <div className="placeholder">
              <p>{activeTab} tab is under construction.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;

