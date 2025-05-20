import { Button } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useFocused, useSlate } from "slate-react";
import { LinkIcon } from "@shopify/polaris-icons";
import { isLinkActive } from "~/helper/link";
import { LinkModal, RICH_TEXT_FIELD_LINK_MODAL_ID } from "~/toolbar/link-modal";

export function LinkButton() {
  const shopify = useAppBridge();
  const editor  = useSlate();
  const focused = useFocused();
  const isActive = isLinkActive(editor) && focused;

  return (
    <>
      <Button variant="plain" pressed={isActive} onClick={() => shopify.modal.show(RICH_TEXT_FIELD_LINK_MODAL_ID)} icon={LinkIcon} />
      <LinkModal />
    </>
  );
}
