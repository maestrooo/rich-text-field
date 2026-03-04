import { useId } from "react";
import { useFocused, useSlate } from "slate-react";
import { isLinkActive } from "~/helper/link";
import { LinkModal, RICH_TEXT_FIELD_LINK_MODAL_ID } from "~/toolbar/link-modal";

export function LinkButton() {
  const editor = useSlate();
  const focused = useFocused();
  const isActive = isLinkActive(editor) && focused;
  const tooltipId = useId();

  return (
    <s-box>
      <s-clickable
        padding="small-300 small-400"
        borderRadius="base"
        background={isActive ? "strong" : "subdued"}
        accessibilityLabel="Open link modal"
        interestFor={tooltipId}
        commandFor={RICH_TEXT_FIELD_LINK_MODAL_ID}
      >
        <s-icon type="link" tone={isActive ? "info" : "auto"}></s-icon>
      </s-clickable>

      <s-tooltip id={tooltipId}>
        <s-text>Link</s-text>
      </s-tooltip>

      <LinkModal />
    </s-box>
  );
}
