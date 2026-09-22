/**
 * 给文章正文 Markdown 渲染出的所有外部链接自动加 target="_blank" rel="noopener noreferrer"。
 * 仅处理站外链接（http/https 且非本站域名）；站内链接和锚点保持默认（同标签页）。
 */
export function rehypeExternalLinks({ internalDomains = [] } = {}) {
  const localHosts = ['localhost', '127.0.0.1', ...internalDomains];
  return (tree) => {
    const visit = (node, fn) => {
      if (!node || typeof node !== 'object') return;
      fn(node);
      if (Array.isArray(node.children)) node.children.forEach((c) => visit(c, fn));
    };

    visit(tree, (node) => {
      if (node.tagName !== 'a') return;
      const props = node.properties || {};
      const href = props.href || '';
      // 只处理 http(s) 外部链接
      if (!/^https?:\/\//i.test(href)) return;
      // 已配置的本站域名及本地开发链接保持同标签页
      try {
        const host = new URL(href).hostname;
        if (localHosts.some(domain => host === domain || host.endsWith('.' + domain))) return;
      } catch {
        return;
      }
      props.target = '_blank';
      const rel = (props.rel || '').split(/\s+/).filter(Boolean);
      if (!rel.includes('noopener')) rel.push('noopener');
      if (!rel.includes('noreferrer')) rel.push('noreferrer');
      props.rel = rel.join(' ');
      node.properties = props;
    });
  };
}