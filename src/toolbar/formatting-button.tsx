import { Tooltip, Popover, Button, Text, Listbox } from "@shopify/polaris";
import { TextFontIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import { ReactEditor, useFocused, useSlate } from "slate-react";
import type { CustomElementType, HeadingElement } from "~/types";
import { getActiveFormatting, isFormattingActive, toggleFormatting } from "~/helper/formatting";

const ICON_MAP: Record<string, any> = {
  'paragraph': TextFontIcon,
  'heading-1': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" focusable="false"><path fill="rgb(74,74,74)" d="M15.17 5.415a.747.747 0 0 1 .07.46.75.75 0 0 1 .01.125v7.502h1a.75.75 0 1 1 0 1.5l-4-.002a.75.75 0 1 1 0-1.5h1.5V6.964l-1.415.708a.75.75 0 0 1-.67-1.342l2.5-1.25a.75.75 0 0 1 1.006.336ZM4.5 6A.75.75 0 0 0 3 6v8.25a.75.75 0 0 0 1.5 0v-3.5h3.25v3.5a.75.75 0 0 0 1.5 0V6a.75.75 0 0 0-1.5 0v3.25H4.5V6Z"></path></svg>',
  'heading-2': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" focusable="false"><path fill="rgb(74,74,74)" d="M4.5 5.75a.75.75 0 0 0-1.5 0v8.5a.75.75 0 0 0 1.5 0V11h3.25v3.25a.75.75 0 0 0 1.5 0v-8.5a.75.75 0 0 0-1.5 0V9.5H4.5V5.75ZM12.25 5C11.56 5 11 5.56 11 6.25V7.5a.75.75 0 0 0 1.5 0v-1h2.232a.75.75 0 0 1 .598 1.203l-4.124 5.443a1 1 0 0 0 .797 1.604h4.247a.75.75 0 0 0 0-1.5h-3.24l3.515-4.641C17.648 7.127 16.591 5 14.732 5H12.25Z"></path></svg>',
  'heading-3': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" focusable="false"><path fill="rgb(74,74,74)" d="M4.5 5.75a.75.75 0 0 0-1.5 0v8.5a.75.75 0 0 0 1.5 0V11h3.25v3.25a.75.75 0 0 0 1.5 0v-8.5a.75.75 0 0 0-1.5 0V9.5H4.5V5.75ZM11.25 5a.75.75 0 0 0 0 1.5h3.412l-.585.712a785.257 785.257 0 0 1-1.902 2.307.75.75 0 0 0 .575 1.231c1.831 0 2.395.378 2.574.599.18.22.178.473.176.981v.17c0 .292-.102.453-.274.584-.21.159-.554.287-1.035.365-.774.127-1.65.095-2.389.068-.189-.007-.37-.013-.536-.017a.75.75 0 1 0-.032 1.5c.126.002.274.008.44.014.736.028 1.819.07 2.76-.084.581-.095 1.206-.277 1.7-.652.53-.403.866-1 .866-1.778l.003-.143c.01-.439.033-1.28-.515-1.953-.446-.55-1.168-.898-2.227-1.056a2207.51 2207.51 0 0 0 2.08-2.528l.488-.593A.752.752 0 0 0 16.25 5h-5Z"></path></svg>',
  'heading-4': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" focusable="false"><path fill="rgb(74,74,74)" d="M13.73 5.922a.75.75 0 0 0-1.46-.344l-1 4.25a.75.75 0 0 0-.01.297A.753.753 0 0 0 12 11h3.5v3.25a.75.75 0 0 0 1.5 0v-8.5a.75.75 0 0 0-1.5 0V9.5h-2.612l.842-3.578ZM3.75 5a.75.75 0 0 1 .75.75V9.5h3.25V5.75a.75.75 0 0 1 1.5 0v8.5a.75.75 0 0 1-1.5 0V11H4.5v3.25a.75.75 0 0 1-1.5 0v-8.5A.75.75 0 0 1 3.75 5Z"></path></svg>',
  'heading-5': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" focusable="false"><path fill="rgb(74,74,74)" d="M4.5 5.75a.75.75 0 0 0-1.5 0v8.5a.75.75 0 0 0 1.5 0V11h3.25v3.25a.75.75 0 0 0 1.5 0v-8.5a.75.75 0 0 0-1.5 0V9.5H4.5V5.75ZM12 5a.75.75 0 0 0-.75.75v4c0 .414.336.75.75.75h2.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75H12a.75.75 0 0 0 0 1.5h2.75A2.25 2.25 0 0 0 17 12.75v-1.5A2.25 2.25 0 0 0 14.75 9h-2V6.5h2.511a.75.75 0 1 0 0-1.5H12Z"></path></svg>',
  'heading-6': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" focusable="false"><path fill="rgb(74,74,74)" d="M4.5 5.75a.75.75 0 0 0-1.5 0v8.5a.75.75 0 0 0 1.5 0V11h3.25v3.25a.75.75 0 0 0 1.5 0v-8.5a.75.75 0 0 0-1.5 0V9.5H4.5V5.75Z"></path><path fill-rule="evenodd" d="M14 5a2.75 2.75 0 0 0-2.75 2.75v5A2.25 2.25 0 0 0 13.5 15h1.25A2.25 2.25 0 0 0 17 12.75v-1A2.75 2.75 0 0 0 14.25 9H14c-.45 0-.875.108-1.25.3V7.75c0-.69.56-1.25 1.25-1.25h1.261a.75.75 0 1 0 0-1.5H14Zm-1.25 7.75v-1c0-.69.56-1.25 1.25-1.25h.25c.69 0 1.25.56 1.25 1.25v1a.75.75 0 0 1-.75.75H13.5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd"></path></svg>',
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

  const [currentStyle, setCurrentStyle] = useState('paragraph');
  const [isActivatorOpen, setIsActivatorOpen] = useState(false);

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
    setIsActivatorOpen(false);

    ReactEditor.focus(editor);
  }, [editor]);

  const activator = (
    <div className="RichTextField__ToolbarFormattingActivator">
      <Button
        variant="plain" 
        disclosure="down"
        pressed={isActivatorOpen} 
        onClick={() => setIsActivatorOpen(!isActivatorOpen)} 
        icon={ICON_MAP[currentStyle]} 
      />
    </div>
  );

  return (
    <Tooltip content={LABEL_MAP[currentStyle]} active={isActivatorOpen ? false : undefined}>
      <Popover activator={activator} active={isActivatorOpen} onClose={() => setIsActivatorOpen(false)}>
        <div className="RichTextField__ToolbarFormattingPopover">
          <Listbox enableKeyboardControl onSelect={handleOnSelect} accessibilityLabel="Choose a format">
            <Listbox.Option selected={isFormattingActive(editor, 'paragraph')} value="paragraph" divider>
              <Text variant="bodyMd" as="span">{ LABEL_MAP['paragraph'] }</Text>
            </Listbox.Option>

            <Listbox.Option selected={isFormattingActive(editor, 'heading', 1)} value="heading-1" divider>
              <Text variant="heading2xl" as="span">{ LABEL_MAP['heading-1'] }</Text>
            </Listbox.Option>
            
            <Listbox.Option selected={isFormattingActive(editor, 'heading', 2)} value="heading-2" divider>
              <Text variant="headingXl" as="span">{ LABEL_MAP['heading-2'] }</Text>
            </Listbox.Option>

            <Listbox.Option selected={isFormattingActive(editor, 'heading', 3)} value="heading-3" divider>
              <Text variant="headingLg" as="span">{ LABEL_MAP['heading-3'] }</Text>
            </Listbox.Option>

            <Listbox.Option selected={isFormattingActive(editor, 'heading', 4)} value="heading-4" divider>
              <Text variant="headingMd" as="span">{ LABEL_MAP['heading-4'] }</Text>
            </Listbox.Option>

            <Listbox.Option selected={isFormattingActive(editor, 'heading', 5)} value="heading-5" divider>
              <Text variant="headingSm" as="span">{ LABEL_MAP['heading-5'] }</Text>
            </Listbox.Option>

            <Listbox.Option selected={isFormattingActive(editor, 'heading', 6)} value="heading-6" divider>
              <Text variant="headingXs" as="span">{ LABEL_MAP['heading-6'] }</Text>
            </Listbox.Option>
          </Listbox>
        </div>
      </Popover>
    </Tooltip>
  );
}