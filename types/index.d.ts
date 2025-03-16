declare global {
    interface String {
        insert(index: number, string: string): string;
    }
}
interface TailwindOptions {
    config?: string;
    custom?: string;
}
export default class TailwindToInline {
    private defaultClasses;
    private convertToString;
    private cssClassStringFromArray;
    private escapeAll;
    private convertCss;
    private main;
    private clearOutputFolder;
    private cssFromHtml;
    private mapFromCss;
    constructor(options?: TailwindOptions);
    convert(html: string): Promise<string | undefined>;
}
export {};

export declare const TAILWIND_DEFAULTS: string;
export declare const CLASSES_IN_TAG: RegExp;
export declare const MATCH_TAG: RegExp;
export declare const TAG_NAME: RegExp;
export declare const CLASS_ATTRIBUTE: RegExp;
export declare const CUSTOM_VALUE: RegExp;
export declare const DEFAULTS_PER_TAG: Map<string, string>;
