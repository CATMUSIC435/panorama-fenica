const fs = require('fs');

try {
  let svg = fs.readFileSync('public/assets/map-animation.svg', 'utf8');

  let count = 0;
  // Safely extract base64 images without destroying surrounding attributes
  // The regex captures everything before and after the base64 string inside the image tag
  svg = svg.replace(/<image([^>]*?)xlink:href="data:image\/(png|jpeg);base64,([^"]+)"([^>]*?)>/g, function(match, before, ext, base64, after) {
    const filename = `map-bg-${count}.${ext}`;
    fs.writeFileSync('public/assets/' + filename, Buffer.from(base64, 'base64'));
    count++;
    // Keep all original attributes, just replace the href
    return `<image${before}href="/assets/${filename}"${after}>`;
  });

  // Remove the trailing </image> which might be left over if the original had <image ...></image> and we replaced the opening tag with a self-closing one.
  // Actually, my new replacement doesn't add a self-closing slash if it wasn't there. It just replaces the href.
  // Wait, if it was <image ...></image>, the replace keeps it exactly the same! 
  // Let's just be safe and not mess with </image> because if the replace didn't add '/>', the original </image> is STILL VALID.

  // Inject CSS animations for the paths
  const customCSS = `
    <style>
      @keyframes drawLineAnim {
        0% { stroke-dashoffset: 3000; }
        100% { stroke-dashoffset: 0; }
      }
      @keyframes pulseLogo {
        0%, 100% {
          transform: scale(1) !important;
          filter: drop-shadow(0 0 4px rgba(214,155,96,0.3)) !important;
        }
        50% {
          transform: scale(1.15) !important;
          filter: drop-shadow(0 0 15px rgba(255,200,100,0.9)) !important;
        }
      }
      /* Target paths that have dasharray set, meaning they were prepared for drawing */
      path[style*="stroke-dasharray"], path[style*="strokeDasharray"] {
        animation: drawLineAnim 60s linear infinite !important;
        will-change: stroke-dashoffset;
      }
      /* Animate specific highlighted lines if they have a specific class like st115 or st136 */
      .st115, .st136, .st127, .st135 {
        animation: drawLineAnim 50s linear infinite !important;
      }
      /* Make the special N logo pulse and glow */
      #special-logo {
        animation: pulseLogo 3s infinite ease-in-out !important;
        transform-origin: center !important;
        transform-box: fill-box !important;
        will-change: transform, filter;
      }
    </style>
  `;

  // Insert the custom style before the closing </defs> tag
  if (svg.includes('</defs>')) {
    svg = svg.replace('</defs>', customCSS + '\n</defs>');
  } else {
    // If no defs, just put it after the opening <svg> tag
    svg = svg.replace(/<svg[^>]*>/, match => match + '\n' + customCSS);
  }

  fs.writeFileSync('public/assets/map-animated-clean.svg', svg);
  console.log('Successfully created map-animated-clean.svg!');
} catch(err) {
  console.error(err);
}
