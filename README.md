# Polaris Rich Text Field

The `RichTextField` component provides a streamlined way to edit Shopify **rich text metafields** within your embedded app.

> ⚠️ This is **not** a general-purpose rich text editor. It is specifically designed for editing **Shopify metafields of type `rich_text_field`**, not for generating arbitrary HTML.

> Since version 2, this libray uses [Polaris web components](https://shopify.dev/docs/api/app-home).

<img width="604" alt="image" src="https://github.com/user-attachments/assets/e0ac6b15-61c9-4444-aef9-a7270d266199" />

---

## 📦 Installation

```bash
npm i @maestrooo/rich-text-field
```

This library uses [Slate](https://www.slatejs.org) under the hood (which is the same library that Shopify uses for their own rich text field editor, ensuring we get a consistent experience).

This library relies on [Polaris Web Components](https://shopify.dev/docs/api/app-home) under the hood.  
To use it correctly, make sure you load Polaris Web Components [following the official instructions](https://shopify.dev/docs/api/app-home#getting-started).

---

## 🛠️ Usage

Import the component and use it in your app:

```tsx
import { RichTextField } from "@maestrooo/rich-text-field";

export default function MyComponent() {
  return (
    <RichTextField 
      name="description"
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
| `value`         | `object \| string \| null`                                           | ✅       | The current metafield value. Use `metafield.jsonValue` or a stringified value of the JSON. |
| `onChange`      | `(event: ChangeEvent) => void`                                  | ❌       | Callback triggered whenever the content changes. Returns a change event. You can retrieve the value using `event.currentTarget.value` |
| `onInput`      | `(event: ChangeEvent) => void`                                  | ❌       | Callback triggered whenever the content changes. Returns a change event. You can retrieve the value using `event.currentTarget.value` |
| `onBlur`      | `(event: FocusEvent) => void`                                  | ❌       | Callback triggered when the field is blurred |
| `onFocus`      | `(event: FocusEvent) => void`                                  | ❌       | Callback triggered when the field is focused |
| `toolbarOptions`| `Array<'formatting' \| 'bold' \| 'italic' \| 'link' \| 'ordered-list' \| 'unordered-list'>` | ❌       | Controls which tools are available in the toolbar.                         |
| `label`         | `string`                                                             | ❌       | Optional label for the field.                                              |
| `details`      | `string`                                                             | ❌       | Optional details text displayed below the field.                              |
| `placeholder`   | `string`                                                             | ❌       | Placeholder text shown when the field is empty.                            |
| `error`         | `string`                                                             | ❌       | Optional error message displayed below the field.                          |

> As of today, `onChange` and `onInput` behave the same way: the `onChange` event is triggered on every keystroke. This is a limitation of the Slate library, which does not distinguish between the two.

---

## ⚠️ Notes

- You can use `metafield.jsonValue` or `metafield.value` as the value.
- When the value is empty, the library will return an empty string (``) and not an empty object. This happens because Shopify expects an empty string to clear a rich text metafield.