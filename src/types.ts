import { type Descendant, type BaseEditor, type BaseRange, Range, Element } from 'slate';
import { ReactEditor, type RenderElementProps } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export type ToolbarOptions = 'formatting' | 'bold' | 'italic' | 'link' | 'ordered-list' | 'unordered-list';

export type RootElement = {
  type: 'root';
  children: Descendant[];
}

export type ParagraphElement = {
  type: 'paragraph';
  children: Descendant[];
}

export type HeadingElement = {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: Descendant[];
}

export type LinkElement = { 
  type: 'link'; 
  url: string; 
  target?: string;
  children: Descendant[];
}

export type ListElement = {
  type: 'list';
  listType: 'ordered' | 'unordered';
  children: Descendant[];
}

export type ListItemElement = { 
  type: 'list-item'; 
  children: Descendant[];
}

export type CustomElement =
  | ListElement
  | HeadingElement
  | LinkElement
  | ListItemElement
  | ParagraphElement;

export type CustomElementType = CustomElement['type'];

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

export type CustomTextKey = keyof Omit<CustomText, 'text'>;

export type RenderElementPropsFor<T> = RenderElementProps & {
  element: T
}

export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    nodeToDecorations?: Map<Element, Range[]>
  }

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
    Range: BaseRange & {
      [key: string]: unknown
    }
  }
}