# Polaris Rich Text Field

The `RichTextField` component provides a streamlined way to edit Shopify **rich text metafields** within your embedded app.

> ⚠️ This is **not** a general-purpose rich text editor. It is specifically designed for editing **Shopify metafields of type `rich_text_field`**, not for generating arbitrary HTML.

> 🚫 This component relies on the Shopify App Bridge modal and can **only** be used inside an embedded Shopify app that uses **App Bridge v4**.

<img width="604" alt="image" src="https://github.com/user-attachments/assets/e0ac6b15-61c9-4444-aef9-a7270d266199" />

---

## 📦 Installation

```bash
npm i @maestrooo/rich-text-field
```

This library uses [Slate](https://www.slatejs.org) under the hood (which is the same library that Shopify uses for their own rich text field editor, ensuring we get a consistent experience).

---

## 🛠️ Usage

Import the component and use it in your app:

```tsx
import { RichTextField } from "@maestrooo/rich-text-field";

export default function MyComponent() {
  return (
    <RichTextField 
      value={metafield.jsonValue} 
      onChange={(newValue) => doSomething(newValue)} 
    />
  );
}
```

---

## 🧾 Props

| Prop            | Type                                                                 | Required | Description                                                                 |
|-----------------|----------------------------------------------------------------------|----------|-----------------------------------------------------------------------------|
| `value`         | `object \| string \| null`                                           | ✅       | The current metafield value. Use `metafield.jsonValue`, **not** a stringified value. |
| `onChange`      | `(value: object \| string) => void`                                  | ✅       | Callback triggered whenever the content changes. Returns a JSON object or an empty string. |
| `toolbarOptions`| `Array<'formatting' \| 'bold' \| 'italic' \| 'link' \| 'ordered-list' \| 'unordered-list'>` | ❌       | Controls which tools are available in the toolbar.                         |
| `label`         | `string`                                                             | ❌       | Optional label for the field.                                              |
| `helpText`      | `string`                                                             | ❌       | Optional help text displayed below the field.                              |
| `placeholder`   | `string`                                                             | ❌       | Placeholder text shown when the field is empty.                            |
| `error`         | `string`                                                             | ❌       | Optional error message displayed below the field.                          |

---

## ⚠️ Notes

- Ensure you pass the **parsed JSON object** (or `""`/`null`), **not** the raw string value of the metafield.
- We recommend using `metafield.jsonValue` as the input.
- The `onChange` callback returns either the updated JSON structure or an empty string when the content is cleared.
