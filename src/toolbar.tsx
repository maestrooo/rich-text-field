import { InlineStack } from "@shopify/polaris";
import { ListBulletedIcon, ListNumberedIcon, TextBoldIcon, TextItalicIcon } from "@shopify/polaris-icons";
import { MarkButton } from "~/toolbar/mark-button";
import { type ToolbarOptions } from "~/types";
import { FormattingButton } from "~/toolbar/formatting-button";
import { ListButton } from "~/toolbar/list-button";
import { LinkButton } from "~/toolbar/link-button";

type ToolbarProps = {
  options: ToolbarOptions[];
}

export function Toolbar({ options }:  ToolbarProps) {
  return (
    <div className="RichTextField__Toolbar">
      <InlineStack gap="100" blockAlign="center">
        {
          options.includes('formatting') && (
            <FormattingButton />
          )
        }

        {
          options.includes('bold') && (
            <MarkButton format="bold" icon={ TextBoldIcon } />
          )
        }

        {
          options.includes('italic') && (
            <MarkButton format="italic" icon={ TextItalicIcon } />
          )
        }

        {
          options.includes('link') && (
            <LinkButton />
          )
        }

        {
          options.includes('unordered-list') && (
            <ListButton listType="unordered" icon={ ListBulletedIcon } />
          )
        }

        {
          options.includes('ordered-list') && (
            <ListButton listType="ordered" icon={ ListNumberedIcon } />
          )
        }
      </InlineStack>
    </div>
  )
}