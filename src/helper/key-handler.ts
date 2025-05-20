import type { KeyboardEvent } from "react";
import { Editor, Element, Node, Transforms, Path, Point, Range } from "slate";
import { isHotkey } from "is-hotkey-esm";
import type { CustomEditor, CustomTextKey, ListItemElement, ParagraphElement } from "~/types";
import { toggleMark } from "~/helper/mark";

const HOTKEYS: Record<string, CustomTextKey> = {
  'mod+b': 'bold',
  'mod+i': 'italic'
}

export function handleHotKey(editor: CustomEditor, event: KeyboardEvent<HTMLDivElement>) {
  for (const hotkey in HOTKEYS) {
    if (isHotkey(hotkey, event as any)) {
      event.preventDefault();
      const mark = HOTKEYS[hotkey];
      toggleMark(editor, mark);
    }
  }
}

/**
 * Match the Shopify RTE behavior by creating a new paragraph when hitting enter on an empty list item that is the last one
 */
export function handleEnterOrBackspaceOnEmptyListItem(editor: CustomEditor): boolean {
  // Are we in a list right now?
  const [liEntry] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      n.type === 'list-item',
  });

  if (liEntry) {
    const [liNode, liPath] = liEntry;

    if (Node.string(liNode) === '') {
      // 1) Turn the list-item into a paragraph at the same path
      Transforms.setNodes(editor, { type: "paragraph" }, { at: liPath });

      // 2) Unwrap that paragraph out of its parent <list>
      Transforms.unwrapNodes(editor, {
        at: liPath,
        match: (n) =>
          Element.isElement(n) &&
          n.type === "list",
        split: true,
      });

      return true;
    }
  }

  return false;
}

/**
 * Match the Shopify RTE behavior by creating a new paragraph when hitting enter in a heading, instead of a new heading
 */
export function handleHeadingBreakline(editor: CustomEditor): boolean {
  const { selection } = editor;

  if (!selection || !Range.isCollapsed(selection)) {
    return false;
  }

  const match = Editor.above(editor, {
    at: editor.selection!,
    match: n => Element.isElement(n) && (n.type === 'heading' || n.type === 'list-item'),
    mode: 'highest'
  });

  if (!match) {
    return false;
  }

  const [, matchingPath] = match;

  // 2) Only fire if the caret is exactly at the end of that heading
  const endOfHeading = Editor.end(editor, matchingPath);

  if (!Point.equals(selection.anchor, endOfHeading)) {
    return false;
  }

  // 3) If the element we are matching is a list item, we have to create a new list item with an empty paragraph
  if (match[0].type === 'list-item') {
    Transforms.insertNodes(editor, { type: 'list-item', children: [{ text: '' }] }, { at: Path.next(matchingPath) });
    Transforms.select(editor, Editor.start(editor, Path.next(matchingPath).concat(0)));

    return true;
  }

  // 4) Insert a brand-new empty paragraph AFTER
  const newParagraph = { type: 'paragraph', children: [{ text: '' }] } as ParagraphElement;
  Transforms.insertNodes(editor, newParagraph, {
    at: Path.next(matchingPath),
  });

  // 6) Move the cursor into the new paragraph’s text node
  const newPath = Path.next(matchingPath).concat(0);
  Transforms.select(editor, Editor.start(editor, newPath));

  return true;
}

/**
 * Match the Shopify RTE behavior by creating a new paragraph when hitting enter in a link when being at the end of the link itself
 */
export function handleLinkBreakline(editor: CustomEditor): boolean {
  const { selection } = editor;

  if (!selection || !Range.isCollapsed(selection)) {
    return false;
  }

  const linkEntry = Editor.above(editor, {
    at: selection,
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      n.type === 'link',
  });

  if (!linkEntry) {
    return false;
  }

  const [, linkPath] = linkEntry;

  // only fire if the cursor is at the very end of that link
  const endOfLink = Editor.end(editor, linkPath);

  if (!Point.equals(selection.anchor, endOfLink)) {
    return false;
  }

  const entry = Editor.above(editor, {
    at: linkPath,
    match: n => Element.isElement(n) && (n.type === 'paragraph' || n.type === 'list-item'),
  });

  if (!entry) {
    return false;
  }

  const [, entryPath] = entry;

  // 4) Insert a brand-new empty paragraph _after_ it
  const newParagraph = { type: entry[0].type, children: [{ text: '' }] } as (ParagraphElement | ListItemElement);
  Transforms.insertNodes(editor, newParagraph, {
    at: Path.next(entryPath),
  });

  // 5) Move the cursor into that empty paragraph
  const newPath = Path.next(entryPath).concat(0);
  Transforms.select(editor, Editor.start(editor, newPath));

  return true;
}