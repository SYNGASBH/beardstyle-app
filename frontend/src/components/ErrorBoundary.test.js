import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Suppress console.error from React error boundary internals
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

function BrokenComponent() {
  throw new Error('Test crash');
}

function WorkingComponent() {
  return <div>Working content</div>;
}

describe('ErrorBoundary', () => {
  test('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Working content')).toBeInTheDocument();
  });

  test('renders error UI when child throws', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText(/pošlo po krivu/i)).toBeInTheDocument();
    expect(screen.getByText(/Pokušaj ponovo/i)).toBeInTheDocument();
  });

  test('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom error</div>}>
        <BrokenComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom error')).toBeInTheDocument();
  });

  test('recovers when retry button is clicked', () => {
    let shouldThrow = true;

    function ConditionalBroken() {
      if (shouldThrow) throw new Error('Conditional crash');
      return <div>Recovered</div>;
    }

    render(
      <ErrorBoundary>
        <ConditionalBroken />
      </ErrorBoundary>
    );

    expect(screen.getByText(/pošlo po krivu/i)).toBeInTheDocument();

    // Fix the error condition and retry
    shouldThrow = false;
    fireEvent.click(screen.getByText(/Pokušaj ponovo/i));

    expect(screen.getByText('Recovered')).toBeInTheDocument();
  });
});
