import { type PointerEvent, useCallback, useId } from "react";
import { useFocused, useSlate } from "slate-react";
import { type ListElement } from "~/types";
import { isListActive, toggleList } from "~/helper/list";

type ListButtonProps = {
  listType: ListElement['listType'];
}

export function ListButton({ listType }: ListButtonProps) {
  const editor = useSlate();
  const focused = useFocused();
  const isActive = isListActive(editor, listType) && focused;
  const tooltipId = useId();

  const handleOnClick = useCallback((event: PointerEvent<HTMLSpanElement>) => {
    event.preventDefault();
    toggleList(editor, listType);
  }, [editor, listType]);

  return (
    <>
      <s-button 
        onClick={handleOnClick}
        variant="tertiary"
        interestFor={tooltipId}
        icon={ listType === 'unordered' ? 'list-bulleted' : 'list-numbered' }
        accessibilityLabel={isActive ? 'Remove list' : 'Add list'}
      >
      </s-button>

      <s-tooltip id={tooltipId}>
        <s-text>{ listType === 'unordered' ? 'Bullet list' : 'Numbered list' }</s-text>
      </s-tooltip>
    </>
  )
}