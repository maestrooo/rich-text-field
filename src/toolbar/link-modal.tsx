import type { CallbackEvent } from "@shopify/app-bridge-ui-types";
import { Node, Editor } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { useCallback, useRef, useState } from "react";
import { getActiveLink, insertLink, isLinkActive } from "~/helper/link";

type LinkState = {
  text: string;
  url: string;
  openInNewTab: boolean;
}

export const RICH_TEXT_FIELD_LINK_MODAL_ID = 'rich-text-field-link-modal';
const INITIAL_LINK_STATE: LinkState = { text: '', url: '', openInNewTab: false };

export function LinkModal() {
  const editor = useSlate();
  const [link, setLink] = useState<LinkState>(INITIAL_LINK_STATE);
  const modalRef = useRef<'s-modal' | null>(null);
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
  const handleInsert = useCallback((event: CallbackEvent<'s-button'>) => {
    event.preventDefault();

    const target = link.openInNewTab ? '_blank' : '_self';
    insertLink(editor, link.url, link.text, target);
    ReactEditor.focus(editor);
    
    modalRef.current?.hideOverlay();
  }, [editor, link]);

  const canInsert = link.text.trim() !== '' && link.url.trim() !== '';

  return (
    <s-modal ref={modalRef} id={RICH_TEXT_FIELD_LINK_MODAL_ID} onShow={onShowModal} onHide={onHideModal} heading={ isActive ? 'Edit link' : 'Insert link' }>
      <s-button slot="primary-action" variant="primary" onClick={handleInsert} disabled={!canInsert}>{ isActive ? 'Edit link' : 'Insert link' }</s-button>
      <s-button slot="secondary-actions" commandFor={RICH_TEXT_FIELD_LINK_MODAL_ID} command="--hide">Cancel</s-button>

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
    </s-modal>
  )
}