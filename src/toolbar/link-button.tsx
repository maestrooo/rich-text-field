import { useAppBridge } from "@shopify/app-bridge-react";
import { useId } from "react";
import { useFocused, useSlate } from "slate-react";
import { isLinkActive } from "~/helper/link";
import { LinkModal, RICH_TEXT_FIELD_LINK_MODAL_ID } from "~/toolbar/link-modal";

export function LinkButton() {
  const shopify = useAppBridge();
  const editor  = useSlate();
  const focused = useFocused();
  const isActive = isLinkActive(editor) && focused;
  const tooltipId = useId();

  return (
    <>
      <s-button 
        variant="tertiary"
        icon="link"
        accessibilityLabel="Open link modal"
        interestFor={tooltipId}
        onClick={() => shopify.modal.show(RICH_TEXT_FIELD_LINK_MODAL_ID)}
      ></s-button>

      <s-tooltip id={tooltipId}>
        <s-text>Link</s-text>
      </s-tooltip>

      <LinkModal />
    </>
  );
}
