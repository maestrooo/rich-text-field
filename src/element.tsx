import { Box, Button, Icon, InlineStack, Link, Popover } from "@shopify/polaris";
import { createElement, useCallback, useEffect, useState } from "react";
import { type RenderElementProps, useFocused, useSelected, useSlate } from "slate-react";
import { ExternalIcon } from "@shopify/polaris-icons";
import { removeLink } from "~/helper/link";

export function Element({ attributes, children, element }: RenderElementProps) {
  const selected = useSelected();
  const focused = useFocused();
  const editor = useSlate();
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
      const activator = (
        <a href={element.url} target={element.target} style={{ pointerEvents: 'none' }} {...attributes}>
          {children}
        </a>
      );
      
      const link = element.url.length > 30 ? element.url.slice(0, 30) + '...' : element.url;

      return (
        <Popover 
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
              <Button onClick={() => shopify.modal.show('link-modal' )} variant="plain">Edit</Button>
              <Button onClick={() => removeLink(editor)} variant="plain" tone="critical">Remove</Button>
            </InlineStack>
          </Box>
        </Popover>
      )
    
    case 'paragraph':
      return (
        <p {...attributes}>
          {children}
        </p>
      )
  }
}