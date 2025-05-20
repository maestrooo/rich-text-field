import { Transforms, Element, Editor, Path, Node } from "slate";
import type { CustomEditor, ListElement } from "~/types";

export function isListActive(editor: CustomEditor, listType?: ListElement['listType']): boolean {
  const { selection } = editor;

  if (!selection) {
    return false;
  }

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => {
        if (!Editor.isEditor(n) && Element.isElement(n)) {
          if (n.type === 'list') {
            if (listType) {
              return n.listType === listType;
            }

            return true;
          }
        }

        return false;
      },
    })
  )

  return !!match;
}

export function toggleList(editor: CustomEditor, listType: ListElement['listType']) {
  const isActive = isListActive(editor, listType);

  // This aligns the behavior with the Shopify RTE, by merging adjacent lists
  Editor.withoutNormalizing(editor, () => {
    // 1) unwrap any existing lists
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        Element.isElement(n) && n.type === 'list',
      split: true,
    });

    // 2) relabel blocks to <paragraph> or <list-item>
    Transforms.setNodes(
      editor,
      { type: isActive ? 'paragraph' : 'list-item' },
      {
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
      }
    );

    // 3) if we’re activating, wrap and then merge with siblings
    if (!isActive) {
      // wrap the now-list-item(s) in a fresh <list>
      const wrapper: ListElement = {
        type: 'list',
        listType,
        children: [],
      };
      Transforms.wrapNodes(editor, wrapper, {
        match: (n) =>
          Element.isElement(n) && (n.type as string) === 'list-item',
      });

      // find the wrapper we just created (it’s the closest list above the selection)
      const [listEntry] = Editor.nodes(editor, {
        at: editor.selection ?? undefined,
        match: (n) =>
          Element.isElement(n) &&
          n.type === "list" &&
          n.listType === listType,
      });

      if (!listEntry) {
        return;
      }

      let [, listPath] = listEntry;

      // 4) merge with previous sibling list of the same type, if any
      if (Path.hasPrevious(listPath)) {
        const prevPath = Path.previous(listPath);
        const prevNode = Node.get(editor, prevPath);

        if (
          Element.isElement(prevNode) &&
          prevNode.type === 'list' &&
          prevNode.listType === listType
        ) {
          Transforms.mergeNodes(editor, { at: listPath });
          // after merge, our merged list lives at prevPath
          listPath = prevPath;
        }
      }

      // 5) merge with next sibling list of the same type, if any
      const nextPath = Path.next(listPath);

      if (Node.has(editor, nextPath)) {
        const nextNode = Node.get(editor, nextPath);

        if (
          Element.isElement(nextNode) &&
          nextNode.type === 'list' &&
          nextNode.listType === listType
        ) {
          Transforms.mergeNodes(editor, { at: nextPath });
        }
      }
    }
  });
}