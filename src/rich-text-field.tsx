import { type KeyboardEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { type Descendant, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, ReactEditor, type RenderElementProps, type RenderLeafProps, Slate, withReact } from 'slate-react';
import { Toolbar } from '~/toolbar';
import { Element } from '~/element';
import { Leaf } from '~/leaf';
import type { CustomEditor, CustomElement, RootElement, ToolbarOptions } from '~/types';
import { serialize, deserialize } from '~/helper/convert';
import { handleEnterOrBackspaceOnEmptyListItem, handleHeadingBreakline, handleHotKey, handleLinkBreakline } from '~/helper/key-handler';
import './styles.css';

type RichTextFieldProps = {
  value: RootElement | '' | null;
  toolbarOptions?: ToolbarOptions[];
  label?: string;
  error?: string | string[];
  name?: string;
  details?: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLDivElement>) => void;
  onInput?: (event: React.ChangeEvent<HTMLDivElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
}

const withInlines = (editor: CustomEditor) => {
  const { isInline } = editor

  editor.isInline = (element: CustomElement) =>
    element.type === 'link' ? true : isInline(element);

  return editor;
}

export function RichTextField({ value, toolbarOptions, label, error, name, details, placeholder, onChange, onInput, onBlur, onFocus }: RichTextFieldProps) {
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );

  const [editor] = useState(() => withInlines(withHistory(withReact(createEditor()))) as CustomEditor);
  const hiddenFieldRef = useRef<HTMLInputElement>(null!);
  const fieldId = useId();
  const initialValue = useMemo<Descendant[]>(() => deserialize(value), []);

  const options = toolbarOptions || ['formatting', 'bold', 'italic', 'link', 'ordered-list', 'unordered-list'];

  useEffect(() => {
    if (hiddenFieldRef.current) {
      hiddenFieldRef.current.addEventListener('change', (event: Event) => {
        onChange?.(event as unknown as React.ChangeEvent<HTMLInputElement>);
        onInput?.(event as unknown as React.ChangeEvent<HTMLInputElement>);
      });
    }
  }, [hiddenFieldRef.current]);

  /**
   * Slate input is not controlled, so if the value changes (for instance when we hit reset), we have to change
   * back the editor value to the new one to keep it in sync.
   */
  useEffect(() => {
    const deserializedValue = deserialize(value);
    const newValueStringified = JSON.stringify(deserializedValue);

    if (newValueStringified === JSON.stringify(initialValue)) {
      if (JSON.stringify(editor.children) !== newValueStringified) {
        const point = { path: [0, 0], offset: 0 }
        editor.selection = { anchor: point, focus: point };
        editor.history = { redos: [], undos: [] };
        editor.children = deserializedValue;
        editor.onChange();
      }
    }
  }, [value]);

  /**
   * Provide all the customizations on Enter/Backspace to match Shopify RTE behavior
   */
  const handleOnKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    const { key, shiftKey } = event;

    handleHotKey(editor, event);

    if (key !== 'Enter' && key !== 'Backspace') {
      return;
    }

    if (key === 'Backspace') {
      if (handleEnterOrBackspaceOnEmptyListItem(editor)) {
        event.preventDefault();
      }

      return;
    }

    // Prevent the native insertBreak
    event.preventDefault();

    if (handleEnterOrBackspaceOnEmptyListItem(editor)) {
      return;
    }

    // Insert a new line if Shift + Enter is pressed
    if (shiftKey) {
      editor.insertText('\n');
      return;
    }

    // Convert next line to paragraph if Enter is pressed in a heading or empty line item
    if (handleHeadingBreakline(editor) || handleLinkBreakline(editor)) {
      return;
    }

    editor.insertBreak();
  }, [editor]);

  const handleOnChange = (newValue: Descendant[]) => {
    // We are only interested in the AST changes, not the selection changes
    const isAstChange = editor.operations.some(
      op => 'set_selection' !== op.type
    );
    
    if (isAstChange) {
      const serializeValue = serialize(newValue);
      hiddenFieldRef.current.value = serializeValue ? JSON.stringify(serializeValue) : '';
      hiddenFieldRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  return (
    <s-box paddingBlockEnd="small-100">
      <Slate editor={editor} initialValue={initialValue} onChange={handleOnChange}>
        <s-stack gap="small-400">
          {
            label && (
              <s-text color="subdued">
                <label htmlFor={fieldId} onClick={() => ReactEditor.focus(editor)}>{ label }</label>
              </s-text>
            )
          }

          <input type="hidden" ref={hiddenFieldRef} name={name} value={typeof value === 'string' ? value : JSON.stringify(value)} />

          <s-stack>
            <Toolbar options={options} />

            <Editable
              id={fieldId}
              className={`RichTextField ${error ? 'RichTextField--error' : ''}`}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              disableDefaultStyles
              placeholder={placeholder}
              spellCheck
              autoFocus={false}
              onKeyDown={handleOnKeyDown}
              onBlur={onBlur}
              onFocus={onFocus}
            />
          </s-stack>

          {
            (details && !error) && (
              <s-paragraph color="subdued">{ details }</s-paragraph>
            )
          }
    
          {
            error && (
              <s-paragraph tone="critical">
                <s-stack direction="inline" gap="small-400" alignItems="center" aria-live="polite">
                  <s-icon size="small" type="alert-circle"></s-icon>
                  <s-text>{ error }</s-text>
                </s-stack>
              </s-paragraph>
            )
          }
        </s-stack>
      </Slate>
    </s-box>
  )
}