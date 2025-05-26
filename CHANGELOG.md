## 1.1.3

- Fixed an issue when converting from heading to paragraph.

## 1.1.1

- Fixed a bug where heading were incorrectly wrapped in a paragraph.
- Better detect when a node is empty to serialize it as an empty string instead of a root with empty paragraph.

## 1.1.0

- Add a new `name` optional parameter. When specified, it will set the value as a string in a hidden input. This is useful if you are using Remix `Form`.

## 1.0.8

- Fix an issue where the heading would not be converted to a paragraph after hitting enter.

## 1.0.7

- Fix an issue with lists and heading

## 1.0.6

- Fix an issue where a heading could be nested inside a paragraph, which is not allowed.
- Fix an issue when removing lists.

## 1.0.5

- Try to fix isHotKey ESM issue

## 1.0.3 / 1.0.4

- Try to fix bundling issues

## 1.0.2

- Fix the package.json

## 1.0.1

- Make `value` accepts a null, to make it easier to use with metafields.

## 1.0.0

- Initial release.