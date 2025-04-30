// SkeletonLoader.jsx
import React from 'react';

export default function SkeletonLoader({height=80}){
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image" style={{ height: `${height}px` }} />
    </div>
  );
};

