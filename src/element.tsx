import { createElement, useCallback, useEffect, useId, useState } from "react";
import { type RenderElementProps, useFocused, useSelected, useSlate } from "slate-react";
import { removeLink } from "~/helper/link";
import { RICH_TEXT_FIELD_LINK_MODAL_ID } from "./toolbar/link-modal";

export function Element({ attributes, children, element }: RenderElementProps) {
  const selected = useSelected();
  const focused = useFocused();
  const editor = useSlate();
  const linkPopoverId = useId();
  const [isLinkPopoverActive, setIsLinkPopoverActive] = useState(false);

  useEffect(() => {
    setIsLinkPopoverActive(selected);
  }, [selected, focused]);

  const handleOnLinkPopoverClose = useCallback(() => {
    if (!focused) {
      setIsLinkPopoverActive(false);
    }
  }, [selected, focused]);
  
  switch (element.type) {
    case 'heading': {
      const tagName = `h${element.level}`;
      return createElement(tagName, { ...attributes }, children);
    }

    case 'list': {
      const tagName = element.listType === 'unordered' ? 'ul' : 'ol';
      return createElement(tagName, { ...attributes }, children);
    }

    case 'list-item':
      return (
        <li {...attributes}>
          {children}
        </li>
      )

    case 'link':
      const link = element.url.length > 30 ? element.url.slice(0, 30) + '...' : element.url;

      return (
        <>
          <s-link command="--toggle" commandFor={linkPopoverId} {...attributes}>
            {children}
          </s-link>

          <s-popover id={linkPopoverId}>
            <s-box padding="small-200">
              <s-stack direction="inline" alignItems="center" gap="base">
                <s-stack direction="inline" gap="small-400">
                  <s-icon type="external" tone="info"></s-icon>
                  <s-link href={element.url} target="_blank">{ link }</s-link>
                </s-stack>

                <s-stack direction="inline" alignItems="center" gap="small-400">
                  <s-button onClick={() => shopify.modal.show(RICH_TEXT_FIELD_LINK_MODAL_ID)} variant="secondary" icon="edit">Edit</s-button>
                  <s-button onClick={() => removeLink(editor)} variant="secondary" tone="critical" icon="delete">Delete</s-button>
                </s-stack>
              </s-stack>
            </s-box>
          </s-popover>
        </>
      )
    
    case 'paragraph':
      return (
        <p {...attributes}>
          {children}
        </p>
      )
  }
}

/**
 * <Popover 
          autofocusTarget="none" 
          activator={activator} 
          preferredPosition="below" 
          activatorWrapper="span" 
          active={isLinkPopoverActive} 
          onClose={handleOnLinkPopoverClose}
        >
          <Box padding="200">
            <InlineStack gap="300">
              <Link url={element.url} removeUnderline target="_blank">
                <InlineStack gap="100" align="center">
                  <Icon source={ExternalIcon} />{ link }
                </InlineStack>
              </Link>
              <Button onClick={() => shopify.modal.show(RICH_TEXT_FIELD_LINK_MODAL_ID)} variant="plain">Edit</Button>
              <Button onClick={() => removeLink(editor)} variant="plain" tone="critical">Remove</Button>
            </InlineStack>
          </Box>
        </Popover>
 */