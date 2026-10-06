import React, { type ReactNode } from 'react';

const Topic: React.FC<{ children: ReactNode }> = ({ children }) => (
  <h1 className="topic">
    <span className="topic-label">Temat:</span> {children}
  </h1>
);

export default Topic;
