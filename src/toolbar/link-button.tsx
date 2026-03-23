import { useId } from "react";
import { useFocused, useSlate } from "slate-react";
import { isLinkActive } from "~/helper/link";
import { LinkModal, RICH_TEXT_FIELD_LINK_MODAL_ID } from "~/toolbar/link-modal";

export function LinkButton() {
  const editor  = useSlate();
  const focused = useFocused();
  const isActive = isLinkActive(editor) && focused;
  const tooltipId = useId();

  return (
    <div>
      <s-button
        interestFor={tooltipId}
        variant="tertiary"
        commandFor={RICH_TEXT_FIELD_LINK_MODAL_ID}
        accessibilityLabel="Open link modal"
        icon="link"
      ></s-button>

      <s-tooltip id={tooltipId}>
        <s-text>Link</s-text>
      </s-tooltip>

      <LinkModal />
    </div>
  );
}
