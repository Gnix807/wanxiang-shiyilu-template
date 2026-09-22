export function remarkFixLooseBold() {
  function transformChildren(children) {
    if (!Array.isArray(children)) return children;

    const regex = /\*\*[ \t\u3000]*([^\n*]+?)[ \t\u3000]*\*\*/g;
    const newChildren = [];

    for (const child of children) {
      if (child.type === 'text' && typeof child.value === 'string' && child.value.includes('**')) {
        let match;
        let lastIndex = 0;
        let hasMatches = false;

        regex.lastIndex = 0;
        while ((match = regex.exec(child.value)) !== null) {
          hasMatches = true;
          const matchStart = match.index;
          const matchEnd = regex.lastIndex;
          const boldContent = match[1].trim();

          if (matchStart > lastIndex) {
            newChildren.push({
              type: 'text',
              value: child.value.slice(lastIndex, matchStart),
            });
          }

          newChildren.push({
            type: 'strong',
            children: [
              {
                type: 'text',
                value: boldContent,
              },
            ],
          });

          lastIndex = matchEnd;
        }

        if (hasMatches) {
          if (lastIndex < child.value.length) {
            newChildren.push({
              type: 'text',
              value: child.value.slice(lastIndex),
            });
          }
          continue;
        }
      }

      // If this child has its own children, recurse into them
      if (child.children && Array.isArray(child.children)) {
        child.children = transformChildren(child.children);
      }

      newChildren.push(child);
    }

    return newChildren;
  }

  return (tree) => {
    if (tree && Array.isArray(tree.children)) {
      tree.children = transformChildren(tree.children);
    }
  };
}
