import { Box, FormLayout, TextField, Checkbox } from "@shopify/polaris";
import { Modal, TitleBar } from "@shopify/app-bridge-react";
import { Node, Editor } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { useCallback, useState } from "react";
import { getActiveLink, insertLink, isLinkActive } from "~/helper/link";

export const RICH_TEXT_FIELD_LINK_MODAL_ID = 'link-modal';

type LinkState = {
  text: string;
  url: string;
  openInNewTab: boolean;
}

const INITIAL_LINK_STATE: LinkState = { text: '', url: '', openInNewTab: false };

export function LinkModal() {
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
  const handleInsert = useCallback(() => {
    const target = link.openInNewTab ? '_blank' : '_self';
    insertLink(editor, link.url, link.text, target);
    ReactEditor.focus(editor);
    
    shopify.modal.hide(RICH_TEXT_FIELD_LINK_MODAL_ID);
  }, [editor, link]);

  const canInsert = link.text.trim() !== '' && link.url.trim() !== '';

  return (
    <Modal id={RICH_TEXT_FIELD_LINK_MODAL_ID} onShow={onShowModal} onHide={onHideModal}>
      <TitleBar title={ isActive ? 'Edit link' : 'Insert link' }>
        <button variant="primary" onClick={handleInsert} disabled={!canInsert}>{ isActive ? 'Edit link' : 'Insert link' }</button>
        <button onClick={() => shopify.modal.hide(RICH_TEXT_FIELD_LINK_MODAL_ID)}>Cancel</button>
      </TitleBar>

      <Box padding="300">
        <FormLayout>
          <TextField
            label='Text'
            value={link.text}
            onChange={onChange("text")}
            autoComplete="off"
          />

          <TextField
            label='Link'
            type='url'
            helpText='https:// is required for external links'
            value={link.url}
            onChange={onChange('url')}
            autoComplete='off'
          />

          <Checkbox
            label='Open this link in a new tab'
            checked={link.openInNewTab}
            onChange={onChange('openInNewTab')}
          />
        </FormLayout>
      </Box>
    </Modal>
  )
}