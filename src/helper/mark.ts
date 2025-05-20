import { Editor } from "slate";
import type { CustomEditor, CustomTextKey } from "~/types";

export function isMarkActive(editor: CustomEditor, format: CustomTextKey): boolean {
  const marks = Editor.marks(editor);

  return marks ? marks[format] === true : false
}

export function toggleMark(editor: CustomEditor, format: CustomTextKey) {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}