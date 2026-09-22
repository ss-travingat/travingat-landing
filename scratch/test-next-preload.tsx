import React from 'react';
import { preload } from 'react-dom';

export default function TestPreload() {
  preload('https://example.com/image.jpg', { as: 'image', fetchPriority: 'high' });
  return <div>Test</div>;
}
