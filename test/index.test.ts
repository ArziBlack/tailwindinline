import { describe, expect, test, beforeEach } from '@jest/globals';
import TailwindToInline from '../src/index';

describe('TailwindToInline', () => {
    let converter: TailwindToInline;

    beforeEach(() => {
        converter = new TailwindToInline();
    });

    test('works with various plain tailwind classes', async () => {
        const tailwindClassesToTest = 'bg-center bg-gray-500 border-blue-500 border-4 hidden flex-1 justify-items-auto h-56 w-2 mb-10 text-blue-300';
        const result = await converter.convert(`<div class="${tailwindClassesToTest}">Dont change this</div>`);
        expect(result).toMatch('<div class="bg-center bg-gray-500 border-blue-500 border-4 hidden flex-1 justify-items-auto h-56 w-2 mb-10 text-blue-300" style="background-position: center; background-color: #a0aec0; border-color: #4299e1; border-width: 4px; display: none; flex: 1  1  0%;  height: 14rem; width: 0.5rem; margin-bottom: 2.5rem; color: #90cdf4; box-sizing: border-box;">Dont change this</div>');
    });

    test('works with custom colors and sizes', async () => {
        const tailwindClassesToTest = 'bg-[#ff00ee] text-[2px] mb-[400px]';
        const result = await converter.convert(`<div class="${tailwindClassesToTest}">Dont change this</div>`);
        expect(result).toMatch('<div class="bg-[#ff00ee] text-[2px] mb-[400px]" style="background-color: #ff00ee;  margin-bottom: 400px; box-sizing: border-box;">Dont change this</div>');
    });

    test('works with custom heights and widths', async () => {
        const tailwindClassesToTest = 'w-48 h-60 bg-[#F6F6F6] rounded-xl overflow-hidden relative';
        const result = await converter.convert(`<div class="${tailwindClassesToTest}">Dont change this</div>`);
        expect(result).toMatch('<div class="w-48 h-60 bg-[#F6F6F6] rounded-xl overflow-hidden relative" style="width: 12rem; height: 15rem; background-color: #F6F6F6; border-radius: 0.75rem; overflow: hidden; position: relative; box-sizing: border-box;">Dont change this</div>');
    });
}); 