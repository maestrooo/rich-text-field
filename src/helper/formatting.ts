import { Transforms, Element, Editor } from "slate";
import type { CustomEditor, CustomElementType, HeadingElement } from "~/types";
import { isListActive } from "~/helper/list";

export function isFormattingActive(editor: CustomEditor, format: CustomElementType, headingLevel?: number): boolean {
  const { selection } = editor;

  if (!selection) {
    return false;
  }

  const [match] = Editor.nodes(editor, {
    at: Editor.unhangRange(editor, selection),
    match: n => {
      if (!Editor.isEditor(n) && Element.isElement(n)) {
        if (n.type === 'heading') {
          return n.level === headingLevel;
        }

        return n.type === format;
      }

      return false;
    },
  });

  return !!match;
}

export function getActiveFormatting(editor: CustomEditor): { type: string, level?: number } | undefined {
  const { selection } = editor;

  if (!selection) {
    return;
  }

  const match = Editor.above(editor, {
    at: selection,
    match: node =>
      Element.isElement(node) &&
      (node.type === 'paragraph' || node.type === 'heading'),
  });

  if (match) {
    const [node] = match;

    if (node.type === 'heading') {
      return { type: node.type, level: node.level };
    }

    return { type: node.type };
  }
}

export function toggleFormatting(editor: CustomEditor, format: CustomElementType, headingLevel?: HeadingElement['level']) {
  if (isListActive(editor) && format === 'paragraph') {
    // If we're in a list we don't do any change when toggling a paragraph
    return;
  }

  // 1) change the block (paragraph ↔ heading)
  let newProps: Partial<Element> =
    format === 'heading' && headingLevel
      ? { type: 'heading', level: headingLevel }
      : { type: 'paragraph' }

  Transforms.setNodes<Element>(editor, { level: undefined, ...newProps });

  // 2) if we just made a heading and it got lifted out of <li>, wrap it back in
  if (format === 'heading' && isListActive(editor)) {
    const [headingEntry] = Editor.nodes(editor, {
      at: editor.selection!,
      match: n =>
        Element.isElement(n) && n.type === 'heading',
      mode: 'highest',
    });

    const [, headingPath] = headingEntry

    // check if that heading is already inside an <li>
    const listItemAbove = Editor.above(editor, {
      at: headingPath,
      match: n =>
        Element.isElement(n) && n.type === 'list-item',
    })

    if (headingEntry && !listItemAbove) {
      const [, headingPath] = headingEntry

      // wrap that heading into a new <li>
      Transforms.wrapNodes(
        editor,
        { type: 'list-item', children: [] },
        { at: headingPath }
      )
    }
  }
}