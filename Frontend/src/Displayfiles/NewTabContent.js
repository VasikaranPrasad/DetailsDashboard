import React, { useEffect, useRef } from 'react';

const NewTabContent = ({ cellValue }) => {
    const highlightedRef = useRef();
  
    useEffect(() => {
      // Scroll to the highlighted element when it mounts
      if (highlightedRef.current) {
        highlightedRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, []);

  return (
    <div>
      <pre ref={highlightedRef}>
        {/* Highlighted cell value */}
        <span style={{ backgroundColor: 'yellow' }}>{cellValue}</span>
        {/* Other content here */}
      </pre>
    </div>
  );
};

export default NewTabContent;
