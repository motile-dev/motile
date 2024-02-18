export function document(content: string) {
  `
  <!DOCTYPE html>
  <html>
  <body>
    ${content}
  </body>
  </html>
  `;
}
