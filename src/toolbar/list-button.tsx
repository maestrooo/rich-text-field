import { type FunctionComponent, type PointerEvent, useCallback } from "react";
import { Button, Tooltip } from "@shopify/polaris";
import { useFocused, useSlate } from "slate-react";
import { type ListElement } from "~/types";
import { isListActive, toggleList } from "~/helper/list";

type ListButtonProps = {
  listType: ListElement['listType'];
  icon: FunctionComponent;
}

export function ListButton({ listType, icon }: ListButtonProps) {
  const editor = useSlate();
  const focused = useFocused();
  const isActive = isListActive(editor, listType) && focused;

  const handlePointerDown = useCallback((event: PointerEvent<HTMLSpanElement>) => {
    event.preventDefault();
    toggleList(editor, listType);
  }, [editor, listType]);

  const tooltipMap = {
    'unordered': 'Bullet list',
    'ordered': 'Numbered list'
  }

  return (
    <Tooltip content={tooltipMap[listType]}>
      <Button
        variant="plain"
        accessibilityLabel={isActive ? 'Remove list' : 'Add list'}
        pressed={isActive}
        onPointerDown={handlePointerDown}
        icon={icon}
      />
    </Tooltip>
  )
}