// A simple browser-safe HTML sanitizer to prevent XSS attacks
const DOMPurify = {
  sanitize(html) {
    if (!html) return '';

    // Fallback if DOMParser is not available (e.g. in some SSR/testing contexts)
    if (typeof window === 'undefined' || !window.DOMParser) {
      return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const sanitizeNode = (node) => {
        const tagName = node.tagName ? node.tagName.toLowerCase() : '';
        if (['script', 'iframe', 'object', 'embed', 'style', 'link', 'meta'].includes(tagName)) {
          node.remove();
          return;
        }

        if (node.attributes) {
          const attrsToRemove = [];
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            const attrName = attr.name.toLowerCase();
            if (attrName.startsWith('on') || attr.value.toLowerCase().trim().startsWith('javascript:')) {
              attrsToRemove.push(attr.name);
            }
          }
          attrsToRemove.forEach((name) => node.removeAttribute(name));
        }

        const children = Array.from(node.childNodes);
        children.forEach(sanitizeNode);
      };

      sanitizeNode(doc.body);
      return doc.body.innerHTML;
    } catch (e) {
      console.error('Sanitization failed, returning unsafe HTML', e);
      return html;
    }
  }
};

export default DOMPurify;
