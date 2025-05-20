import { Transforms, Element, Editor, Text } from "slate";
import type { CustomEditor, CustomElementType, HeadingElement } from "~/types";

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

export function toggleFormatting(editor: CustomEditor, format: CustomElementType, headingLevel?: HeadingElement["level"]) {
  const match = Editor.above(editor, {
    at: editor.selection!,
    match: n => Element.isElement(n) && (n.type === 'heading' || n.type === 'paragraph' || n.type === 'list-item'),
    mode: 'lowest'
  });

  if (!match) {
    return;
  }

  // If we have a have a paragraph and we are already a paragraph, we do nothing
  const [node, path] = match;

  if (node.type === 'paragraph' && format === 'paragraph') {
    return;
  }

  // If we transform to a heading, as per Shopify rules, it must be inside a paragraph, so we insert a new node
  if (format === 'heading' && headingLevel != null) {
    // If currently a paragraph, then we wrap it in the paragraph
    if (node.type === 'paragraph' || node.type === 'list-item') {
      Transforms.wrapNodes(
        editor, 
        { type: 'heading', level: headingLevel, children: [] },
        { at: path, match: n => Text.isText(n), split: true }
      )
    } else {
      // If we are already a heading, we just update the level
      Transforms.setNodes(editor, { level: headingLevel }, { at: path });
    }
  }

  // If we are a heading and that we transform back to a paragraph, we have to unwrap the heading to just keep the paragraph
  if (format === 'paragraph') {
    Transforms.unwrapNodes(editor, {
      at: path,
      match: n => Element.isElement(n) && n.type === 'heading',
      split: true,
    });
  }
}