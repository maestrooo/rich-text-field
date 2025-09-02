import { useCallback, useId } from "react";
import type { CallbackEvent } from "@shopify/app-bridge-ui-types";
import { ReactEditor, useFocused, useSlate } from "slate-react";
import { type CustomTextKey } from "~/types";
import { isMarkActive, toggleMark } from "~/helper/mark";

type MarkButtonProps = {
  format: CustomTextKey;
}

export function MarkButton({ format }: MarkButtonProps) {
  const editor = useSlate();
  const focused = useFocused();
  const isActive = isMarkActive(editor, format) && focused;
  const tooltipId = useId();

  const handleOnClick = useCallback((event: CallbackEvent<'s-button'>) => {
    event.preventDefault();
    toggleMark(editor, format);
    ReactEditor.focus(editor);
  }, [editor, format]);

  return (
    <>
      <s-clickable 
        padding="small-300 small-400" borderRadius="base"
        background={ isActive ? 'strong' : 'subdued' }
        onClick={handleOnClick}
        interestFor={tooltipId}
        accessibilityLabel={isActive ? 'Remove formatting' : 'Add formatting'}
      >
        <s-icon type={format === 'bold' ? 'text-bold' : 'text-italic'}></s-icon>
      </s-clickable>

      <s-tooltip id={tooltipId}>
        <s-text>{ format === 'bold' ? 'Bold' : 'Italic' }</s-text>
      </s-tooltip>
    </>
  )
}