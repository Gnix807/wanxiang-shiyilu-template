export interface ParsedPoetryLine {
  isCouplet: boolean;
  left?: string;
  right?: string;
  text?: string;
}

export function parsePoetry(html: string, cols: 1 | 2 | 'auto' = 'auto', poemTitle?: string): ParsedPoetryLine[] {
  if (!html) return [];
  // 将 <br> 和 <p> 边界统一替换为换行符
  const clean = html
    .replace(/<\/?p[^>]*>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n');

  const rawLines = clean
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (rawLines.length === 0) return [];

  // 2. 如果显式指定了单列排版 (columns={1})
  if (cols === 1) {
    return rawLines.map((line) => ({
      isCouplet: false,
      text: line,
    }));
  }


  // 1. 先检查是否每一行内自身已经包含半句分隔符（作者在单行中同时写了上联与下联）
  const singleMatches = rawLines.map((line) => {
    const commaMatch = line.match(/^([^，,；;]+[，,；;])\s*(.+)$/);
    if (commaMatch) {
      return {
        isCouplet: true,
        left: commaMatch[1],
        right: commaMatch[2],
      };
    }
    const spaceMatch = line.match(/^([\u4e00-\u9fa5]{4,8})\s+([\u4e00-\u9fa5]{4,8}[。！？]?)$/);
    if (spaceMatch) {
      return {
        isCouplet: true,
        left: spaceMatch[1],
        right: spaceMatch[2],
      };
    }
    return null;
  });

  if (singleMatches.every(Boolean)) {
    return singleMatches as ParsedPoetryLine[];
  }

  // 3. 判断是否应该两两配对为对偶两列（律诗、绝句、对联或显式 columns={2}）
  const canPair = rawLines.length >= 2 && rawLines.length % 2 === 0;

  if (cols === 2) {
    const result: ParsedPoetryLine[] = [];
    for (let i = 0; i < rawLines.length; i += 2) {
      if (i + 1 < rawLines.length) {
        result.push({
          isCouplet: true,
          left: rawLines[i],
          right: rawLines[i + 1],
        });
      } else {
        result.push({
          isCouplet: false,
          text: rawLines[i],
        });
      }
    }
    return result;
  }

  // cols === 'auto': 智能识别律诗、绝句、对联等传统格律诗特征
  if (canPair) {
    const titleHint = /(?:[五七]律|律诗|[五七]绝|绝句|对联|联句|排律)/.test(poemTitle || '');
    // 奇数行（0, 2, 4... 上联）以逗号或分号结尾
    const oddLinesHaveComma = rawLines.filter((_, idx) => idx % 2 === 0).every((l) => /[，,；;]$/.test(l));
    // 提取纯汉字字数，检测是否为字数齐整的五言/七言/四言等古诗
    const hanziLens = rawLines.map((l) => l.replace(/[^\u4e00-\u9fa5]/g, '').length);
    const isUniformHanzi = hanziLens.every((len) => len >= 4 && len <= 10 && len === hanziLens[0]);
    const isClassicalPoem = titleHint || oddLinesHaveComma || (isUniformHanzi && [2, 4, 8, 10, 12, 16].includes(rawLines.length));

    if (isClassicalPoem) {
      const result: ParsedPoetryLine[] = [];
      for (let i = 0; i < rawLines.length; i += 2) {
        result.push({
          isCouplet: true,
          left: rawLines[i],
          right: rawLines[i + 1],
        });
      }
      return result;
    }
  }

  // 兜底：现代自由诗按单行自然排印
  return rawLines.map((line) => ({
    isCouplet: false,
    text: line,
  }));
}

