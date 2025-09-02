import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { Node, Editor } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { useCallback, useState } from "react";
import { getActiveLink, insertLink, isLinkActive } from "~/helper/link";

type LinkState = {
  text: string;
  url: string;
  openInNewTab: boolean;
}

export const RICH_TEXT_FIELD_LINK_MODAL_ID = 'rich-text-field-link-modal';
const INITIAL_LINK_STATE: LinkState = { text: '', url: '', openInNewTab: false };

export function LinkModal() {
  const shopify = useAppBridge();
  const editor = useSlate();
  const [link, setLink] = useState<LinkState>(INITIAL_LINK_STATE);
  const isActive = isLinkActive(editor);

  // When the modal is shown, we have to detect if we already have a link selected, and retrieve the attributes
  const onShowModal = useCallback(() => {
    const { selection } = editor;

    if (!selection) {
      return;
    }

    const activeLink = getActiveLink(editor);

    if (!activeLink) {
      setLink({ ...INITIAL_LINK_STATE, text: Editor.string(editor, selection) });
    } else {
      setLink({ url: activeLink.url, openInNewTab: activeLink.target === '_blank', text: Node.string(activeLink) });
    }
  }, [editor]);

  // When the modal is hidden, we reset the link state to its initial state
  const onHideModal = useCallback(() => {
    ReactEditor.focus(editor);
  }, [editor]);

  // Change the link state properties
  const onChange = useCallback(
    (field: keyof LinkState) => (value: string | boolean) =>
      setLink((prev) => ({ ...prev, [field]: value })),
    []
  );

  // On insert, we add the link and hide the modal
  const handleInsert = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const target = link.openInNewTab ? '_blank' : '_self';
    insertLink(editor, link.url, link.text, target);
    ReactEditor.focus(editor);
    
    shopify.modal.hide(RICH_TEXT_FIELD_LINK_MODAL_ID);
  }, [shopify, editor, link]);

  const handleOnClose = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    shopify.modal.hide(RICH_TEXT_FIELD_LINK_MODAL_ID);
  }, [shopify]);

  const canInsert = link.text.trim() !== '' && link.url.trim() !== '';

  return (
    <Modal id={RICH_TEXT_FIELD_LINK_MODAL_ID} onShow={onShowModal} onHide={onHideModal}>
      <TitleBar title={ isActive ? 'Edit link' : 'Insert link' }>
        <button variant="primary" onClick={handleInsert} disabled={!canInsert}>{ isActive ? 'Edit link' : 'Insert link' }</button>
        <button onClick={handleOnClose}>Cancel</button>
      </TitleBar>

      <s-section>
        <s-text-field 
          label="Text" 
          value={link.text} 
          onInput={(event) => onChange("text")(event.currentTarget.value)} 
          autocomplete="off"
        ></s-text-field>

        <s-url-field 
          label="Link" 
          details="https:// is required for external links"
          value={link.url}
          onInput={(event) => onChange("url")(event.currentTarget.value)} 
          autocomplete="off"
        ></s-url-field>
          
        <s-checkbox 
          label="Open this link in a new tab" 
          checked={link.openInNewTab} 
          onChange={(event) => onChange("openInNewTab")(event.currentTarget.checked)}
        ></s-checkbox>
      </s-section>
    </Modal>
  )
}