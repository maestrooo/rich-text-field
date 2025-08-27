import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ReactEditor, useFocused, useSlate } from "slate-react";
import type { CustomElementType, HeadingElement } from "~/types";
import { getActiveFormatting, isFormattingActive, toggleFormatting } from "~/helper/formatting";

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
      <s-button
        variant="tertiary"
        accessibilityLabel="Change formatting"
        interestFor={tooltipId}
        commandFor="rich-text-field-formatting-menu"
        command="--toggle"
      >
        <s-text>{ LABEL_MAP[currentStyle] }</s-text>
        <s-icon type="chevron-down" size="small"></s-icon>
      </s-button>

      <s-popover ref={popoverRef} id="rich-text-field-formatting-menu">
        <s-clickable borderRadius="large large none none" minBlockSize="40px" minInlineSize="100%" paddingInline="large" onClick={() => handleOnSelect('paragraph')} background={isFormattingActive(editor, 'paragraph') ? 'subdued' : 'base'}>
          <s-stack direction="inline" columnGap="small-200" alignItems="center">
            { isFormattingActive(editor, 'paragraph') && <s-icon type="check" size="small"></s-icon> }
            <s-paragraph>Paragraph</s-paragraph>
          </s-stack>
        </s-clickable>

        <s-divider></s-divider>

        <s-clickable minBlockSize="40px" minInlineSize="100%" paddingInline="large" onClick={() => handleOnSelect('heading-1')} background={isFormattingActive(editor, 'heading', 1) ? 'subdued' : 'base'}>
          <s-stack direction="inline" columnGap="small-200" alignItems="center">
            { isFormattingActive(editor, 'heading', 1) && <s-icon type="check" size="small"></s-icon> }
            <s-heading><span style={{ fontSize: '1.875rem', lineHeight: 1 }}>Heading 1</span></s-heading>
          </s-stack>
        </s-clickable>
        
        <s-divider></s-divider>

        <s-clickable minBlockSize="40px" minInlineSize="100%" paddingInline="large" onClick={() => handleOnSelect('heading-2')} background={isFormattingActive(editor, 'heading', 2) ? 'subdued' : 'base'}>
          <s-stack direction="inline" columnGap="small-200" alignItems="center">
            { isFormattingActive(editor, 'heading', 2) && <s-icon type="check" size="small"></s-icon> }
            <s-heading><span style={{ fontSize: '1.5rem', lineHeight: 1 }}>Heading 2</span></s-heading>
          </s-stack>
        </s-clickable>
        
        <s-divider></s-divider>
        
        <s-clickable minBlockSize="40px" minInlineSize="100%" paddingInline="large" onClick={() => handleOnSelect('heading-3')} background={isFormattingActive(editor, 'heading', 3) ? 'subdued' : 'base'}>
          <s-stack direction="inline" columnGap="small-200" alignItems="center">
            { isFormattingActive(editor, 'heading', 3) && <s-icon type="check" size="small"></s-icon> }
            <s-heading><span style={{ fontSize: '1.25rem', lineHeight: 1 }}>Heading 3</span></s-heading>
          </s-stack>
        </s-clickable>
        
        <s-divider></s-divider>
        
        <s-clickable minBlockSize="40px" minInlineSize="100%" paddingInline="large" onClick={() => handleOnSelect('heading-4')} background={isFormattingActive(editor, 'heading', 4) ? 'subdued' : 'base'}>
          <s-stack direction="inline" columnGap="small-200" alignItems="center">
            { isFormattingActive(editor, 'heading', 4) && <s-icon type="check" size="small"></s-icon> }
            <s-heading><span style={{ fontSize: '0.875rem', lineHeight: 1 }}>Heading 4</span></s-heading>
          </s-stack>
        </s-clickable>
        
        <s-divider></s-divider>
        
        <s-clickable minBlockSize="40px" minInlineSize="100%" paddingInline="large" onClick={() => handleOnSelect('heading-5')} background={isFormattingActive(editor, 'heading', 5) ? 'subdued' : 'base'}>
          <s-stack direction="inline" columnGap="small-200" alignItems="center">
            { isFormattingActive(editor, 'heading', 5) && <s-icon type="check" size="small"></s-icon> }
            <s-heading><span style={{ fontSize: '0.8125rem', lineHeight: 1 }}>Heading 5</span></s-heading>
          </s-stack>
        </s-clickable>
        
        <s-divider></s-divider>
        
        <s-clickable borderRadius="none none large large" minBlockSize="40px" minInlineSize="100%" paddingInline="large" onClick={() => handleOnSelect('heading-6')} background={isFormattingActive(editor, 'heading', 6) ? 'subdued' : 'base'}>
          <s-stack direction="inline" columnGap="small-200" alignItems="center">
            { isFormattingActive(editor, 'heading', 6) && <s-icon type="check" size="small"></s-icon> }
            <s-heading><span style={{ fontSize: '0.75rem', lineHeight: 1 }}>Heading 6</span></s-heading>
          </s-stack>
        </s-clickable>
      </s-popover>

      <s-tooltip id={tooltipId}>
        <s-text>Formatting</s-text>
      </s-tooltip>
    </>
  );
}