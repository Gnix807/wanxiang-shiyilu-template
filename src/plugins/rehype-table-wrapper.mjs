/**
 * Automatically wraps <table> elements in <div class="editorial-table-wrapper custom-scrollbar">
 * to enable responsive horizontal scrolling and Neo-brutalist container aesthetics.
 */
export function rehypeTableWrapper() {
  return (tree) => {
    const tablesToWrap = [];

    function findTables(node, parent, index) {
      if (!node || typeof node !== 'object') return;
      if (
        node.type === 'element' &&
        node.tagName === 'table' &&
        parent &&
        !(parent.tagName === 'div' && parent.properties?.className?.includes('editorial-table-wrapper'))
      ) {
        tablesToWrap.push({ table: node, parent, index });
        return;
      }
      if (Array.isArray(node.children)) {
        for (let i = 0; i < node.children.length; i++) {
          findTables(node.children[i], node, i);
        }
      }
    }

    findTables(tree, null, -1);

    for (const { table, parent, index } of tablesToWrap) {
      const wrapper = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['editorial-table-wrapper', 'custom-scrollbar'],
        },
        children: [table],
      };
      parent.children[index] = wrapper;
    }
  };
}
