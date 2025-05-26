import { type Descendant, Text, Element, Node } from 'slate';
import type { RootElement } from '~/types';

/**
 * Serialize the Slate value to the Shopify format. Shopify format is quite close to Slate format, with a few differences:
 *
 * - Nodes are wrapped in a "root" node
 * - Leaf nodes have type of "text" with a value propery
 */
export function serialize(nodes: Descendant[]): RootElement | '' {
  const renderedValue = nodes.map(node => Node.string(node)).join('').trim();

  if (renderedValue === '') {
    return '';
  }

  const convertNode = (node: Descendant): any => {
    if (Element.isElement(node)) {
      const { children, ...attributes } = node;
      return { ...attributes, children: children.map(convertNode) };
    } else if (Text.isText(node)) {
      const { text, ...attributes } = node;
      return { type: 'text', value: text, ...attributes };
    }

    throw new Error('Unknown node type');
  }

  const node: RootElement = {
    type: 'root',
    children: nodes.map(convertNode),
  };

  return node;
}

/**
 * Deserialize Shopify value to Slate value. If it is empty, we use an empty paragraph
 */
export function deserialize(node: RootElement | '' | null): Descendant[] {
  if (!node) {
    return [{ type: 'paragraph', children: [{ text: '' }] }];
  }
  
  const convertNode = (node: any): Descendant => {
    if (node.type === 'text') {
      return { 
        text: node.value, 
        ...(node.bold !== undefined && { bold: node.bold }),
        ...(node.italic !== undefined && { italic: node.italic })
      };
    } else {
      const { children, ...attributes } = node;
      return { ...attributes, children: children.map(convertNode) };
    }
  }

  return node.children.map(convertNode);
}