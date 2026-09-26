import React, { type ReactNode } from 'react';

// Page titles are written the way a lesson starts in a Polish school notebook.
const Topic: React.FC<{ children: ReactNode }> = ({ children }) => (
  <h1 className="topic">
    <span className="topic-label">Temat:</span> {children}
  </h1>
);

export default Topic;
