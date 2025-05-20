import { Text, InlineError, BlockStack } from '@shopify/polaris';
import { type KeyboardEvent, useCallback, useEffect, useId, useMemo } from 'react';
import { type Descendant, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, type RenderElementProps, type RenderLeafProps, Slate, withReact } from 'slate-react';
import { Toolbar } from '~/toolbar';
import { Element } from '~/element';
import { Leaf } from '~/leaf';
import type { CustomEditor, CustomElement, RootElement, ToolbarOptions } from '~/types';
import { serialize, deserialize } from '~/helper/convert';
import { handleEnterOrBackspaceOnEmptyListItem, handleHeadingBreakline, handleHotKey, handleLinkBreakline } from '~/helper/key-handler';
import '~/styles.css';

type RichTextFieldProps = {
  value: RootElement | '';
  toolbarOptions?: ToolbarOptions[];
  label?: string;
  error?: string | string[];
  helpText?: string;
  placeholder?: string;
  onChange: (value: RootElement | '') => void;
}

const withInlines = (editor: CustomEditor) => {
  const { isInline } = editor

  editor.isInline = (element: CustomElement) =>
    element.type === 'link' ? true : isInline(element);

  return editor;
}

export function RichTextField({ value, toolbarOptions, label, error, helpText, placeholder, onChange }: RichTextFieldProps) {
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );

  const editor = useMemo(() => withInlines(withHistory(withReact(createEditor()))) as CustomEditor, []);
  const fieldId = useId();
  const initialValue = useMemo<Descendant[]>(() => deserialize(value), []);

  const options = toolbarOptions || ['formatting', 'bold', 'italic', 'link', 'ordered-list', 'unordered-list'];

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
      onChange(serialize(newValue));
    }
  }

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={handleOnChange}>
      <div className="RichTextField">
        <BlockStack gap="100">
          {
            label && (
              <label htmlFor={fieldId} className="RichTextField__Label">{ label }</label>
            )
          }

          <div>
            <Toolbar options={options} />

            <Editable
              id={fieldId}
              className={`RichTextField__Textbox ${error ? 'RichTextField__Textbox--error' : ''}`}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              disableDefaultStyles
              placeholder={placeholder}
              spellCheck
              autoFocus={false}
              onKeyDown={handleOnKeyDown}
            />
          </div>

          {
            helpText && (
              <Text variant="bodyMd" tone="subdued" as="p">{ helpText }</Text>
            )
          }
    
          {
            error && (
              <InlineError message={error} fieldID={fieldId} />
            )
          }
        </BlockStack>
      </div>
    </Slate>
  )
}