import React from 'react';

const NodeRedEmbed: React.FC = () => {
  return (
    <iframe 
      src="http://localhost:1880" 
      width="100%" 
      height="800" 
      title="Node-RED"
      frameBorder="0"
    ></iframe>
  );
};

export default NodeRedEmbed;
