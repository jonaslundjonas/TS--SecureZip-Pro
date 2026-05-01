import { test } from 'node:test';
import assert from 'node:assert';
import { formatBytes } from './utils.js';

test('formatBytes helper function', async (t) => {
    await t.test('returns "0 Bytes" for 0 input', () => {
        assert.strictEqual(formatBytes(0), '0 Bytes');
    });

    await t.test('formats bytes correctly', () => {
        assert.strictEqual(formatBytes(100), '100 Bytes');
    });

    await t.test('formats KB correctly', () => {
        assert.strictEqual(formatBytes(1024), '1 KB');
        assert.strictEqual(formatBytes(1536), '1.5 KB');
    });

    await t.test('formats MB correctly', () => {
        assert.strictEqual(formatBytes(1024 * 1024), '1 MB');
        assert.strictEqual(formatBytes(1024 * 1024 * 1.25), '1.25 MB');
    });

    await t.test('formats GB correctly', () => {
        assert.strictEqual(formatBytes(Math.pow(1024, 3)), '1 GB');
    });

    await t.test('formats TB correctly', () => {
        assert.strictEqual(formatBytes(Math.pow(1024, 4)), '1 TB');
    });

    await t.test('handles custom decimal places', () => {
        assert.strictEqual(formatBytes(1536, 0), '2 KB'); // 1.5 rounded to 0 decimals is 2
        assert.strictEqual(formatBytes(1536, 1), '1.5 KB');
        assert.strictEqual(formatBytes(1536, 3), '1.5 KB'); // toFixed(3) might result in 1.500 but parseFloat removes trailing zeros
    });

    await t.test('handles negative decimal places by treating them as 0', () => {
        assert.strictEqual(formatBytes(1536, -1), '2 KB');
    });

    await t.test('handles large numbers with multiple decimals', () => {
        const bytes = 1024 * 1024 * 1.23456;
        assert.strictEqual(formatBytes(bytes, 2), '1.23 MB');
        assert.strictEqual(formatBytes(bytes, 4), '1.2346 MB');
    });
});
