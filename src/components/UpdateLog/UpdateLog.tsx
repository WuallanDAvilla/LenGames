import React from "react";
import { updateLogEntries } from "../../constants/updateLogData";
import "./UpdateLog.css";

const UpdateLog: React.FC = () => {
  return (
    <div className="update-log-container">
      <h2 className="update-log-title">Logs de Update! 🔥</h2>
      <div className="update-log-list">
        {updateLogEntries.map((entry) => (
          <div key={entry.version} className="update-log-item">
            <span className="update-log-version">Versão {entry.version}</span>
            <p className="update-log-description">{entry.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpdateLog;
