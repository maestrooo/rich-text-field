import type { KeyboardEvent } from "react";
import { Editor, Element, Node, Transforms, Path, Point, Range } from "slate";
import isHotkey from "is-hotkey";
import type { CustomEditor, CustomTextKey } from "~/types";
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

  // 1) If we're in a heading, split + turn into paragraph
  const heading = Editor.above(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      n.type === 'heading',
  });

  if (!heading) {
    return false;
  }

  const [, headingPath] = heading

  // Is the cursor at the very end of that heading?
  const endOfHeading = Editor.end(editor, headingPath);

  if (!Point.equals(selection.anchor, endOfHeading)) {
    return false;
  }

  // Are we inside a list-item?
  const [, liPath] = Editor.above(editor, {
    match: n => Element.isElement(n) && n.type === 'list-item',
  })!;

  if (liPath) {
    // 1) Split the list item
    Transforms.splitNodes(editor, {
      match: n => Element.isElement(n) && n.type === 'list-item',
      always: true,
    });

    // 2) Compute the path of the *new* list-item
    const newLiPath = Path.next(liPath);

    // 3) Remove the auto-inserted heading child
    Transforms.removeNodes(editor, { at: [...newLiPath, 0] });

    // 4) Insert a bare text node
    Transforms.insertNodes(editor, { text: '' }, { at: [...newLiPath, 0] });

    // 5) Move the cursor into that new text node
    Transforms.select(editor, Editor.start(editor, [...newLiPath, 0]));

    return true;
  }

  // Fallback: not in a list, so do the normal heading→paragraph split
  Transforms.splitNodes(editor, { always: true });
  Transforms.unsetNodes(editor, 'level');
  Transforms.setNodes(editor, { type: 'paragraph' });

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
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      n.type === 'link',
  });

  if (linkEntry) {
    const [, linkPath] = linkEntry;
    const end = Editor.end(editor, linkPath);

    if (Point.equals(selection.anchor, end)) {
      // split out a new block
      Transforms.splitNodes(editor, { always: true });

      // unwrap that link wrapper
      Transforms.unwrapNodes(editor, {
        match: n =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === 'link',
        split: true,
      });

      // and force the new block to be a paragraph
      Transforms.setNodes(editor, { type: 'paragraph' });

      return true;
    }
  }

  return false;
}