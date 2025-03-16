export const TAILWIND_DEFAULTS: string = 
'box-sizing: border-box;' +
'border-width: 0; border-style: solid;'

export const CLASSES_IN_TAG: RegExp = /(?:(?:class|className)=(?<CLASS>(?:["'].+?["']))).*?/g;
export const MATCH_TAG: RegExp = new RegExp(String.raw`<(?!\/).+?>`, 'g');
export const TAG_NAME: RegExp = /<(\w+)/g;
export const CLASS_ATTRIBUTE: RegExp = /\w[a-zA-Z0-9-]+(?<VALUE>\[.+?\])/g;
export const CUSTOM_VALUE: RegExp = /\[.+?\]/g;
export const DEFAULTS_PER_TAG: Map<string, string> = new Map([
    ['blockquote', 'margin: 0;'],
    ['dl', 'margin: 0;'],
    ['dd', 'margin: 0;'],
    ['h1', 'margin: 0; font-size: inherit; font-weight: inherit;'],
    ['h2', 'margin: 0; font-size: inherit; font-weight: inherit;'],
    ['h3', 'margin: 0; font-size: inherit; font-weight: inherit;'],
    ['h4', 'margin: 0; font-size: inherit; font-weight: inherit;'],
    ['h5', 'margin: 0; font-size: inherit; font-weight: inherit;'],
    ['h6', 'margin: 0; font-size: inherit; font-weight: inherit;'],
    ['hr', 'margin: 0;'],
    ['figure', 'margin: 0;'],
    ['p', 'margin: 0;'],
    ['pre', 'margin: 0;'],
    ['ol', 'list-style: none; margin: 0; padding: 0;'],
    ['ul', 'list-style: none; margin: 0; padding: 0;'],
    ['img', 'display: block; vertical-align: middle; max-width: 100%; height: auto;'],
    ['svg', 'display: block; vertical-align: middle;'],
    ['video', 'display: block; vertical-align: middle; max-width: 100%; height: auto;'],
    ['canvas', 'display: block; vertical-align: middle;'],
    ['audio', 'display: block; vertical-align: middle;'],
    ['iframe', 'display: block; vertical-align: middle;'],
    ['embed', 'display: block; vertical-align: middle;'],
    ['object', 'display: block; vertical-align: middle;'],
]); 