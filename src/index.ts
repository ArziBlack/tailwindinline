import fs from 'fs'
import { exec } from 'child_process'
import { CLASSES_IN_TAG, MATCH_TAG, TAG_NAME, DEFAULTS_PER_TAG } from './CONSTANTS.js'
import postcss from 'postcss'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

declare global {
    interface String {
        insert(index: number, string: string): string;
    }
}

String.prototype.insert = function(index: number, string: string): string {
    const ind = index < 0 ? this.length + index : index;
    return this.substring(0, ind) + string + this.substring(ind);
};

interface TailwindOptions {
    config?: string;
    custom?: string;
}

interface CssProperties {
    [key: string]: string;
}

export default class TailwindToInline {
    private defaultClasses: Map<string, CssProperties> = new Map();

    private convertToString = (gottenClass: CssProperties | undefined, customvalue?: string): string => 
        gottenClass ? Object.entries(gottenClass).map(([key, val]) => 
            customvalue ? `${key}: ${customvalue};` : `${key}: ${val};`).join('') : '';

    private cssClassStringFromArray = ([head, ...tail]: string[]): string => {
        let customValue: string | undefined;
        if(tail.length < 1) return this.convertToString(this.defaultClasses.get(`.${head}`), customValue ? customValue.replace(/\[|\]/g, '') : undefined)
        return this.convertToString(this.defaultClasses.get(`.${head}`), customValue ? customValue.replace(/\[|\]/g, '') : undefined) + this.cssClassStringFromArray(tail)
    }

    private escapeAll = (str: string): string => {
        return str.replace(/\./g, '\\.') 
            .replace(/\[/g, '\\[') 
            .replace(/\]/g, '\\]') 
            .replace(/\//g, '\\/')
            .replace(/\(/g, '\\(')
            .replace(/\)/g, '\\)')
            .replace(/\#/g, '\\#')
    }
    
    private convertCss = (classArr: string): string => {
        const classes = this.escapeAll(classArr).split(' ').flatMap(e => e.match(/,/g) ? e.split(',') : [e]);
        return this.convertToString(this.defaultClasses.get('*,:after,:before')) + this.cssClassStringFromArray(classes)
    }
    
    private main = async (html: string): Promise<string | undefined> => {
        if(!html) return

        const css = await this.cssFromHtml(html)
        this.defaultClasses = this.mapFromCss(css)
        return html.replace(MATCH_TAG, (match: string) => {
            let styles = ''
            match = match.replace(CLASSES_IN_TAG, (innerClassMatch: string, innerClasses: string) => {
                innerClasses = innerClasses.replace(/"|'/g, '')
                styles = this.convertCss(innerClasses)
                return innerClassMatch
            })
            TAG_NAME.lastIndex = 0
            const res = TAG_NAME.exec(match)
            const tagName = res?.[1]
            if(tagName && DEFAULTS_PER_TAG.has(tagName)) {
                const defaultStyle = DEFAULTS_PER_TAG.get(tagName)
                if (defaultStyle) {
                    styles = defaultStyle + styles
                }
            }
            if(!styles) return match
            const styleTag = ` style="${styles}"`
            if(match.match(/(?:style=".+?")/g)) return match.replace(/(?:style=".+?")/g, (e) => {
                const existing = e.match(/(?:style="(.+?)")/)?.[1] || ''
                return `style="${styles} ${existing}"`
            })
            else return match.insert(-1, styleTag)
        })
    }

    private clearOutputFolder = (): void => {
        fs.readdir(`${__dirname}/convert`, (err, files) => {
            if (err) throw err
            for (const file of files) {
                fs.unlink(`${__dirname}/convert/${file}`, err => {
                    if (err) throw err
                })
            }
        })
    }

    private cssFromHtml = async (html: string): Promise<string> => {
        if(!fs.existsSync(`${__dirname}/convert`)) fs.mkdirSync(`${__dirname}/convert`)
        fs.writeFileSync(`${__dirname}/convert/index.html`, html)

        return new Promise((resolve, reject) => {
            exec(`npx tailwindcss -c ${__dirname}/tailwind.config.js -i ${__dirname}/input.css -o ${__dirname}/convert/output.css --minify`, 
                (err, _, __) => {
                    if (err) {
                        console.error(err)
                        reject(err)
                        return
                    }
                    const output = fs.readFileSync(`${__dirname}/convert/output.css`, 'utf8')
                    resolve(output)
                })
        })
    }

    private mapFromCss = (css: string): Map<string, CssProperties> => {
        const root = postcss.parse(css)
        const result: [string, CssProperties][] = []
        root.walkRules(rule => {
            const propObject: CssProperties = {}
            rule.nodes.forEach(node => {
                if ('prop' in node && 'value' in node) {
                    propObject[node.prop] = node.value
                }
            })
            result.push([`${rule.selector}`, propObject])
        })
        return new Map(result)
    }

    constructor(options?: TailwindOptions) {
        if(options?.config && fs.existsSync(path.resolve(process.cwd(), options.config))) {
            import(path.resolve(process.cwd(), options.config)).then(userConfig => {
                const config = userConfig.default
                config.content = ["**/*.html"]
                fs.writeFileSync(`${__dirname}/tailwind.config.js`, 
                    `/** @type {import('tailwindcss').Config} */ \n export default ${JSON.stringify(config)}`, 'utf8')
                if(!options?.custom) return
                if(typeof options.custom !== 'string') throw new Error('Custom must be a string of css')
                this.defaultClasses = this.mapFromCss(options.custom)
            }).catch(err => {
                throw new Error('Error importing tailwind config. Please make sure the path is correct and the file is in es6 module format' + err)
            });
        } else {
            if(!options?.custom) return
            if(typeof options.custom !== 'string') throw new Error('Custom must be a string of css')
            this.defaultClasses = this.mapFromCss(options.custom)
        }
    }

    convert(html: string): Promise<string | undefined> {
        return this.main(html)
    }
}