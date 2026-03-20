import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock heavy pages to avoid loading Three.js, MediaPipe etc. in tests
jest.mock('./pages/ARTryOnPage', () => () => <div>AR TryOn</div>);
jest.mock('./pages/AcademyPage', () => () => <div>Academy</div>);
jest.mock('./pages/AIResultsPage', () => () => <div>AI Results</div>);
jest.mock('./pages/UploadPage', () => () => <div>Upload</div>);
jest.mock('./pages/TestOverlayPage', () => () => <div>Test Overlay</div>);

describe('App', () => {
  test('renders without crashing', () => {
    render(<App />);
  });

  test('renders the navbar', () => {
    render(<App />);
    // Navbar should always be present
    const nav = document.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });

  test('renders the home page by default', () => {
    render(<App />);
    // HomePage should render some content on /
    const main = document.querySelector('main');
    expect(main).toBeInTheDocument();
  });
});
