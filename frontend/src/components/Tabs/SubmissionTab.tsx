// src/components/tabs/SubmissionTab.tsx
import React from "react";
import "../../App.css";

interface SubmissionTabProps {
  language: string;
  setLanguage: (lang: string) => void;
  stdin: string;
  setStdin: (input: string) => void;
  stdout: string;
  stderr: string;
  execTime: number;
  isRunning: boolean;
  runCode: () => void;
  code: string;
}

const SubmissionTab: React.FC<SubmissionTabProps> = ({
  language,
  setLanguage,
  stdin,
  setStdin,
  stdout,
  stderr,
  execTime,
  isRunning,
  runCode,
  code,
}) => {
  return (
    <>
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
    </>
  );
};

export default SubmissionTab;

