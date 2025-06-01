import React from "react";
import "./TopBar.css";

interface TopBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Use lowercase for keys, capitalized for labels
const tabs = [
  { key: "submission", label: "Submission" },
  { key: "reference", label: "Reference" },
  { key: "ai", label: "AI" },
  { key: "viewer", label: "Viewer" },
  { key: "timer", label: "Timer" },
];

const TopBar: React.FC<TopBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="app-bar">
      <div className="app-title">Code Runner</div>
      <div className="app-tabs">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            className={`tab-button ${activeTab === key ? "active" : ""}`}
            onClick={() => onTabChange(key)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopBar;

