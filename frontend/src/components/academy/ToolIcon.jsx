import React from 'react';

const TOOL_ASSETS = {
  Trimer: 'trimmer', 'Precizni trimer': 'trimmer', Makaze: 'scissors',
  Češalj: 'comb', Četka: 'brush', 'Ulje za bradu': 'oil',
  Brijač: 'razor', Pjena: 'foam', 'Pjena za brijanje': 'foam',
};

export default function ToolIcon({ tool }) {
  const asset = TOOL_ASSETS[tool];
  return asset ? <img className="ag-tool-icon" src={`/assets/tools/${asset}.svg`}
    alt="" aria-hidden="true" width="28" height="28" /> : null;
}
