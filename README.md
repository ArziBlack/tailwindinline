# Tailwindinline

A utility library that converts Tailwind CSS classes in HTML to inline styles. This is particularly useful when you need to generate PDFs from HTML content or when you need to ensure styling consistency across different platforms that may not support external stylesheets.

## Features

- Converts Tailwind CSS classes to inline styles
- Supports custom Tailwind configuration
- Handles arbitrary values (e.g., `bg-[#ff00ee]`, `text-[2px]`)
- Preserves existing inline styles
- Supports custom CSS
- Handles default styles per HTML tag

## Installation

```bash
npm install tailwindinline
```

## Usage

### Basic Usage

```javascript
import TailwindToInline from 'tailwindinline'

// Initialize converter
const twi = new TailwindToInline()

// Convert HTML string with Tailwind classes
const html = '<div class="pt-2 pb-4 bg-blue-500">Hello World</div>'
const htmlWithInlineStyles = await twi.convert(html)

// Result:
// <div class="pt-2 pb-4 bg-blue-500" 
//      style="padding-top: 0.5rem; padding-bottom: 1rem; background-color: #3b82f6; box-sizing: border-box;">
//   Hello World
// </div>
```

### With Custom Tailwind Configuration

```javascript
import TailwindToInline from 'tailwindinline'

// Initialize with custom Tailwind config
const twi = new TailwindToInline({
  config: './path/to/tailwind.config.js'
})

// Use converter
const html = '<div class="custom-color custom-spacing">Hello World</div>'
const result = await twi.convert(html)
```

### With Custom CSS

```javascript
import TailwindToInline from 'tailwindinline'

// Initialize with custom CSS
const twi = new TailwindToInline({
  custom: `
    .custom-button {
      background-color: red;
      padding: 10px;
    }
  `
})

// Use converter
const html = '<button class="custom-button">Click me</button>'
const result = await twi.convert(html)
```

## API Reference

### `TailwindToInline`

#### Constructor Options

```typescript
interface TailwindOptions {
  config?: string;    // Path to custom tailwind.config.js (relative path)
  custom?: string;    // Custom CSS string
}
```

#### Methods

##### `convert(html: string): Promise<string | undefined>`

Converts HTML string with Tailwind classes to HTML with inline styles.

- **Parameters:**
  - `html`: HTML string containing Tailwind classes
- **Returns:** Promise resolving to the converted HTML string with inline styles

## Common Use Cases

### PDF Generation

```javascript
import TailwindToInline from 'tailwindinline'
import ReactDOMServer from 'react-dom/server'

// Initialize converter
const twi = new TailwindToInline()

// Your React component
const MyComponent = () => (
  <div class="p-4 bg-white">
    <h1 class="text-2xl font-bold">PDF Title</h1>
    <p class="mt-2 text-gray-600">Content goes here</p>
  </div>
)

// Convert React component to HTML string
const htmlString = ReactDOMServer.renderToString(<MyComponent />)

// Convert Tailwind classes to inline styles
const inlineStyledHtml = await twi.convert(htmlString)

// Send to PDF generation service
// Example with api2pdf:
// await api2pdf.chromeHtmlToPdf(inlineStyledHtml)
```

### Email Template Generation

```javascript
import TailwindToInline from 'tailwindinline'

const twi = new TailwindToInline()

const emailTemplate = `
  <div class="max-w-lg mx-auto p-6 bg-white">
    <h1 class="text-xl font-bold text-gray-800">Welcome!</h1>
    <p class="mt-4 text-gray-600">Thank you for signing up.</p>
  </div>
`

const emailHtml = await twi.convert(emailTemplate)
// Ready to be sent via email service
```

## Notes

- The library processes HTML strings, so it works with any frontend framework that can render to HTML strings
- Custom Tailwind configurations must be in ES6 module format
- The library automatically handles box-sizing and other default styles
- Existing inline styles are preserved and merged with converted Tailwind styles

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
