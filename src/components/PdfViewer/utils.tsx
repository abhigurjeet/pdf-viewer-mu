export function getTooltipReadAloud(cb: Function) {
    const node = document.createElement("button");
    node.className = "PSPDFKit-8ehcbhz241z1tfyhjztbe12ube PSPDFKit-5hqvpgcgpf1769cn35dvtg4ktz PSPDFKit-Text-Markup-Inline-Toolbar-Redaction PSPDFKit-dcqzrnymm6bk9dm2mrhum7xwe PSPDFKit-Toolbar-Button PSPDFKit-Tool-Button "
    node.innerHTML = `<svg class="read-aloud-icon" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03zM14 3.23v2.06c3.39.49 6 3.39 6 6.71s-2.61 6.22-6 6.71v2.06c4.53-.51 8-4.32 8-8.77s-3.47-8.26-8-8.77z"/>
</svg>`;
    const item = {
        type: "custom",
        id: "read-aloud-tooltip",
        node: node,
        className: 'twcursorpointer ',
        title: "Read Aloud",
        onPress: cb
    };
    return item;
}