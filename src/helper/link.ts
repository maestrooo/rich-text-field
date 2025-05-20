import { Transforms, Range, Element, Editor } from "slate";
import type { CustomEditor, LinkElement } from "~/types";

export function isLinkActive(editor: CustomEditor): boolean {
  return !!getActiveLink(editor);
}

export function getActiveLink(editor: CustomEditor): LinkElement | null {
  const [link] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
  })
  
  if (!link) {
    return null;
  }

  return link[0] as LinkElement;
}

function unwrapLink(editor: CustomEditor) {
  const { selection } = editor;

  if (!selection) {
    return;
  }

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
    at: selection,
    split: true,
    mode: 'lowest'
  });
}

function wrapLink(editor: CustomEditor, url: string, linkText: string, target: string) {
  const link: LinkElement = {
    type: 'link',
    url,
    target,
    children: [{ text: linkText }],
  }

  // If the link is already active, we first remove it, and then re-add it
  if (isLinkActive(editor)) {
    // 1) Find the link element and its path…
    const [linkEntry] = Editor.nodes(editor, {
      match: n =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link'
    })

    if (!linkEntry) {
      return;
    }

    const [, path] = linkEntry;

    // 1) Remove the old link
    Transforms.removeNodes(editor, { at: path });

    // 2) insert a brand-new one in its place
    Transforms.insertNodes(editor, link, { at: path });

    // 3) put the cursor after it
    Transforms.collapse(editor, { edge: 'end' });

    return;
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
}

export function removeLink(editor: CustomEditor) {
  unwrapLink(editor);
}

export function insertLink(editor: CustomEditor, url: string, text: string, target: string) {
  wrapLink(editor, url, text, target);
}