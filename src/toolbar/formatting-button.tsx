import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ReactEditor, useFocused, useSlate } from "slate-react";
import type { CustomElementType, HeadingElement } from "~/types";
import { getActiveFormatting, isFormattingActive, toggleFormatting } from "~/helper/formatting";

const ICON_MAP: Record<string, any> = {
  'paragraph': 'text-font',
  'heading-1': 'text-title',
  'heading-2': 'text-title',
  'heading-3': 'text-title',
  'heading-4': 'text-title',
  'heading-5': 'text-title',
  'heading-6': 'text-title',
};

const LABEL_MAP: Record<string, any> = {
  'paragraph': 'Paragraph',
  'heading-1': 'Heading 1',
  'heading-2': 'Heading 2',
  'heading-3': 'Heading 3',
  'heading-4': 'Heading 4',
  'heading-5': 'Heading 5',
  'heading-6': 'Heading 6',
};

export function FormattingButton() {
  const editor = useSlate();
  const focused = useFocused();
  const tooltipId = useId();
  const popoverRef = useRef<HTMLElement>(null);

  const [currentStyle, setCurrentStyle] = useState('paragraph');

  useEffect(() => {
    const activeFormatting = getActiveFormatting(editor);

    if (!activeFormatting) {
      setCurrentStyle('paragraph');
    } else {
      const { type, level } = activeFormatting;
      setCurrentStyle(type === 'heading' ? `heading-${level}` : type);
    }
  }, [editor.selection, focused]);

  const handleOnSelect = useCallback((value: string) => {
    const format = value.split('-')[0] as CustomElementType;
    const headingLevel = value.split('-')[1] ? parseInt(value.split('-')[1], 10) as HeadingElement['level'] : undefined;

    toggleFormatting(editor, format, headingLevel);
    
    ReactEditor.focus(editor);
  }, [editor]);

  return (
    <>
      <s-clickable
        background="subdued"
        borderRadius="base"
        accessibilityLabel="Change formatting"
        interestFor={tooltipId}
        commandFor="rich-text-field-formatting-menu"
        command="--toggle"
        type="button"
      >
        <s-stack direction="inline">
          <s-icon type={ICON_MAP[currentStyle]}></s-icon>
          <s-icon type="chevron-down"></s-icon>
        </s-stack>
      </s-clickable>

      <s-popover ref={popoverRef} id="rich-text-field-formatting-menu">
        <s-box padding="small-200">
          <s-stack gap="small-400">
            <s-button variant="tertiary" onClick={() => handleOnSelect('paragraph')} selected={isFormattingActive(editor, 'paragraph')}>Paragraph</s-button>
            <s-button variant="tertiary" onClick={() => handleOnSelect('heading-1')} selected={isFormattingActive(editor, 'heading-1')}>Heading 1</s-button>
            <s-button variant="tertiary" onClick={() => handleOnSelect('heading-2')} selected={isFormattingActive(editor, 'heading-2')}>Heading 2</s-button>
            <s-button variant="tertiary" onClick={() => handleOnSelect('heading-3')} selected={isFormattingActive(editor, 'heading-3')}>Heading 3</s-button>
            <s-button variant="tertiary" onClick={() => handleOnSelect('heading-4')} selected={isFormattingActive(editor, 'heading-4')}>Heading 4</s-button>
            <s-button variant="tertiary" onClick={() => handleOnSelect('heading-5')} selected={isFormattingActive(editor, 'heading-5')}>Heading 5</s-button>
            <s-button variant="tertiary" onClick={() => handleOnSelect('heading-6')} selected={isFormattingActive(editor, 'heading-6')}>Heading 6</s-button>
          </s-stack>
        </s-box>
      </s-popover>

      <s-tooltip id={tooltipId}>
        <s-text>{LABEL_MAP[currentStyle]}</s-text>
      </s-tooltip>
    </>
  );
}