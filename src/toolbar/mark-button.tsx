import { type PointerEvent, useCallback, useId } from "react";
import { useFocused, useSlate } from "slate-react";
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

  const handleOnClick = useCallback((event: PointerEvent<HTMLSpanElement>) => {
    event.preventDefault();
    toggleMark(editor, format);
  }, [editor, format]);

  return (
    <>
      <s-button 
        onClick={handleOnClick}
        variant="tertiary"
        interestFor={tooltipId}
        icon={ format === 'bold' ? 'text-bold' : 'text-italic' }
        accessibilityLabel={isActive ? 'Remove formatting' : 'Add formatting'}
      >
      </s-button>

      <s-tooltip id={tooltipId}>
        <s-text>{ format === 'bold' ? 'Bold' : 'Italic' }</s-text>
      </s-tooltip>
    </>
  )
}