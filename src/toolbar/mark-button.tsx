import { type FunctionComponent, type PointerEvent, useCallback } from "react";
import { Button, Tooltip } from "@shopify/polaris";
import { useFocused, useSlate } from "slate-react";
import { type CustomTextKey } from "~/types";
import { isMarkActive, toggleMark } from "~/helper/mark";

type MarkButtonProps = {
  format: CustomTextKey;
  icon: FunctionComponent;
}

export function MarkButton({ format, icon }: MarkButtonProps) {
  const editor = useSlate();
  const focused = useFocused();
  const isActive = isMarkActive(editor, format) && focused;

  const handlePointerDown = useCallback((event: PointerEvent<HTMLSpanElement>) => {
    event.preventDefault();
    toggleMark(editor, format);
  }, [editor, format]);

  const tooltipMap = {
    bold: 'Bold',
    italic: 'Italic'
  }

  return (
    <Tooltip content={tooltipMap[format]}>
      <Button
        variant="plain"
        accessibilityLabel={isActive ? `Remove ${format}` : `Add ${format}`}
        pressed={isActive}
        onPointerDown={handlePointerDown}
        icon={icon}
      />
    </Tooltip>
  )
}