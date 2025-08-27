import { useCallback, useId } from "react";
import type { CallbackEvent } from "@shopify/app-bridge-ui-types";
import { ReactEditor, useFocused, useSlate } from "slate-react";
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

  const handleOnClick = useCallback((event: CallbackEvent<'s-button'>) => {
    event.preventDefault();
    toggleList(editor, listType);
    ReactEditor.focus(editor);
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