import React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import GuideIllustration, { VISUALS } from './GuideIllustration';
import AnimatedGuide from './AnimatedGuide';
import fs from 'fs';
import path from 'path';
import { createGuideGeometry } from './guideGeometry';

test.each(Object.keys(VISUALS))('%s exported plate and annotations share geometry', style => {
  const geometry = createGuideGeometry(style);
  const base = path.join(process.cwd(), 'public/assets/academy/parametric', style);
  expect(JSON.parse(fs.readFileSync(`${base}.zones.json`, 'utf8'))).toEqual(geometry);
  const svg = fs.readFileSync(`${base}.svg`, 'utf8');
  expect(svg).toContain(geometry.beard);
  expect(svg).toContain(`viewBox="${geometry.viewBox}"`);
  expect(geometry.zones.shave).toContain('Q');
  expect(geometry.neckShave).toContain(geometry.zones.neck);
  expect(geometry.mustache === null).toBe(style === 'goatee');
});

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open',''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
});
test.each(Object.keys(VISUALS))('%s uses a real detailed illustration', guideId => {
  render(<GuideIllustration guideId={guideId} stepIndex={0} />);
  expect(screen.getByAltText(VISUALS[guideId].alt)).toHaveAttribute('src', VISUALS[guideId].image);
  expect(fs.existsSync(path.join(process.cwd(), 'public', VISUALS[guideId].image.replace(/^\//,'')))).toBe(true);
});
test('annotations can be hidden and remain hidden when advancing the guide', () => {
  const view = render(<GuideIllustration guideId="full-beard" stepIndex={0} />);
  expect(view.container.querySelector('.ag-annotation')).toBeTruthy();
  fireEvent.click(screen.getByLabelText('Prikaži oznake'));
  expect(view.container.querySelector('.ag-annotation')).toBeNull();
  view.rerender(<GuideIllustration guideId="full-beard" stepIndex={1} />);
  expect(view.container.querySelector('.ag-annotation')).toBeNull();
  expect(screen.getByText('Linije obraza')).toBeInTheDocument();
});
test('large view opens and closes with the same image and step', () => {
  render(<GuideIllustration guideId="van-dyke" stepIndex={1} />);
  fireEvent.click(screen.getByText('Povećaj sliku ↗'));
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getByAltText(VISUALS['van-dyke'].alt)).toBeInTheDocument();
  expect(within(dialog).getByText('Odvojeni brkovi')).toBeInTheDocument();
  fireEvent.click(within(dialog).getByText('Zatvori ×'));
  expect(screen.queryByRole('dialog')).toBeNull();
});
test('opening the large image pauses automatic step changes', () => {
  jest.useFakeTimers();
  const view = render(<AnimatedGuide guideId="full-beard" isPremium />);
  fireEvent.click(screen.getByLabelText('Pusti automatski'));
  act(() => jest.advanceTimersByTime(8000));
  expect(screen.getByText('Korak 2/4')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Povećaj sliku ↗'));
  act(() => jest.advanceTimersByTime(16000));
  expect(screen.getByText('Korak 2/4')).toBeInTheDocument();
  view.unmount(); jest.useRealTimers();
});

describe('step animations and detailed how-to', () => {
  const { DETAILS } = require('./GuideIllustration');
  test.each(Object.keys(VISUALS))('%s: every step has sub-steps, a common mistake and a check', guideId => {
    VISUALS[guideId].steps.forEach((_, i) => {
      const d = DETAILS[guideId][i];
      expect(d.how.length).toBeGreaterThanOrEqual(3);
      expect(d.mistake).toBeTruthy();
      expect(d.check).toBeTruthy();
    });
  });

  test('animated tool follows the step line and can be switched off', () => {
    const { container } = render(<GuideIllustration guideId="full-beard" stepIndex={0} />);
    const anim = container.querySelector('.ag-step-animation');
    expect(anim).toHaveAttribute('data-kind', 'neck');
    expect(anim.querySelector('[data-tool="trimmer"]')).toBeTruthy();
    expect(anim.querySelector('animateMotion').getAttribute('path')).toBe(createGuideGeometry('full-beard').zones.neck);
    expect(screen.getByText('2 prsta')).toBeInTheDocument();
    expect(screen.getByText('Česta greška:')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Animacija'));
    expect(container.querySelector('.ag-step-animation')).toBeNull();
  });

  test('reduced motion shows the tool at rest instead of animating', () => {
    window.matchMedia = jest.fn().mockReturnValue({ matches: true });
    const { container } = render(<GuideIllustration guideId="goatee" stepIndex={1} />);
    expect(container.querySelector('animateMotion')).toBeNull();
    expect(container.querySelector('[data-tool="razor"]')).toBeTruthy();
    delete window.matchMedia;
  });
});
