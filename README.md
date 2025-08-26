# Polaris Rich Text Field

The `RichTextField` component provides a streamlined way to edit Shopify **rich text metafields** within your embedded app.

> ⚠️ This is **not** a general-purpose rich text editor. It is specifically designed for editing **Shopify metafields of type `rich_text_field`**, not for generating arbitrary HTML.

> Since version 2, this library uses [Polaris Web Components](https://shopify.dev/docs/api/app-home). Please note that Polaris Web Components are not yet officially released, so you may encounter breaking changes. If you are still using the older Polaris React, consider sticking with version 1.


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

## Known limitations

There are currently some styling inconsistencies caused by missing features in Polaris Web Components. Specifically:

- When certain formatting is active (e.g., bold or italic), the corresponding buttons do not appear as “pressed.” [Issue](https://community.shopify.dev/t/adding-a-pressed-prop-for-buttons/21786)  
- When a heading level (H1, H2, H3, etc.) is selected, a generic “title” icon is shown. Polaris Web Components currently lack dedicated icons for each heading level and do not support custom icons. [Issue](https://community.shopify.dev/t/adding-new-icons/21788)  
- Formatting icons appear darker than other icons. This happens because buttons do not support disclosure icons, so we are forced to use a different component, leading to inconsistency. [Issue](https://community.shopify.dev/t/add-support-for-disclosure-buttons/21789)  

Those issues will be fixed when Polaris Web Components will be improved.