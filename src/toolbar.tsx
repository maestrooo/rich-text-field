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
    <s-box padding="small-400" background="subdued" border="base" borderColor="strong" borderWidth="base base none base" borderRadius="base base none none">
      <s-stack direction="inline" gap="small-400">
        {
          options.includes('formatting') && (
            <FormattingButton />
          )
        }

        {
          options.includes('bold') && (
            <MarkButton format="bold" />
          )
        }

        {
          options.includes('italic') && (
            <MarkButton format="italic" />
          )
        }

        {
          options.includes('link') && (
            <LinkButton />
          )
        }

        {
          options.includes('unordered-list') && (
            <ListButton listType="unordered" />
          )
        }

        {
          options.includes('ordered-list') && (
            <ListButton listType="ordered" />
          )
        }
      </s-stack>
    </s-box>
  )
}