import React from 'react';
import { createRoot } from 'react-dom/client'; // Use createRoot for React 18 and beyond
import App from './App';
import 'antd/dist/reset.css'; // Ensure correct import for Ant Design CSS

// Get the root element from the DOM
const rootElement = document.getElementById('root');

// Create a root using React 18's createRoot
const root = createRoot(rootElement);

// Render the App component
root.render(<App />);
