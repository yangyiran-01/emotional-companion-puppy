import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countProse } from './readme-count.mjs';
test('README prose count excludes setup, URLs and inline code, retaining link labels', () => {
  const input='# Project status\n\nA working [Demo app](https://example.com/x). Run `npm ci`.\n\n```sh\nnpm ci\nnpm run dev\n```\n\n<!-- hidden text -->\nhttps://example.com\n';
  assert.equal(countProse(input),8);
});
test('README prose count includes table text without counting table separators', () => {
  assert.equal(countProse('| Mode | Status |\n| --- | --- |\n| Demo | Working locally |'),5);
});
