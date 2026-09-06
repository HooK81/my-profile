const XML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
};

function escapeXml(value: string): string {
  return value.replace(/[&<>"]/g, (char) => XML_ESCAPES[char]);
}

function buildFaviconSvg(initials: string): string {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">',
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">',
    '<stop offset="0" stop-color="#fb8a70"/>',
    '<stop offset="1" stop-color="#f5d06a"/>',
    '</linearGradient></defs>',
    '<rect x="4" y="4" width="92" height="92" rx="26" fill="url(#g)"/>',
    '<text x="50" y="64" font-family="Sora, Instrument Sans, system-ui, sans-serif" font-size="40" font-weight="700" fill="#071018" text-anchor="middle" letter-spacing="1">',
    escapeXml(initials),
    '</text></svg>',
  ].join('');
}

export function applyFavicon(initials: string): void {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }

  link.type = 'image/svg+xml';
  link.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(buildFaviconSvg(initials))}`;
}
