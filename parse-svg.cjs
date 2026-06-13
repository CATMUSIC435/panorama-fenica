const fs = require('fs');

try {
  let svg = fs.readFileSync('public/assets/map-animation.svg', 'utf8');

  // Strip XML declaration if present
  svg = svg.replace(/<\?xml.*\?>/i, '');

  // Find all base64 images
  const regex = /<image[^>]+xlink:href="data:image\/(png|jpeg);base64,([^"]+)"[^>]*>/g;
  let match;
  let count = 0;
  while ((match = regex.exec(svg)) !== null) {
    const ext = match[1];
    const base64 = match[2];
    const filename = `map-bg-${count}.${ext}`;
    
    // Parse attributes
    const widthMatch = match[0].match(/width="([^"]+)"/);
    const heightMatch = match[0].match(/height="([^"]+)"/);
    const transformMatch = match[0].match(/transform="([^"]+)"/);
    
    const w = widthMatch ? `width="${widthMatch[1]}"` : '';
    const h = heightMatch ? `height="${heightMatch[1]}"` : '';
    const transform = transformMatch ? `transform="${transformMatch[1]}"` : '';
    
    // Replace in SVG
    svg = svg.replace(match[0], `<image ${w} ${h} ${transform} href="/assets/${filename}" />`);
    count++;
  }

  // Remove trailing </image> which may be left behind if original was <image></image>
  svg = svg.replace(/<\/image>/g, '');

  // Handle JSX style blocks correctly by wrapping content in {` `}
  // Because the SVG might have <style>...</style>
  svg = svg.replace(/<style>([\s\S]*?)<\/style>/gi, function(m, p1) {
    return `<style dangerouslySetInnerHTML={{ __html: \`${p1.replace(/`/g, '\\`')}\` }} />`;
  });

  // Convert attributes to React format
  let jsx = svg
    .replace(/xmlns:xlink/g, 'xmlnsXlink')
    .replace(/xlink:href/g, 'href')
    .replace(/stroke-miterlimit/g, 'strokeMiterlimit')
    .replace(/stroke-dasharray/g, 'strokeDasharray')
    .replace(/stroke-dashoffset/g, 'strokeDashoffset')
    .replace(/stroke-width/g, 'strokeWidth')
    .replace(/stroke-linecap/g, 'strokeLinecap')
    .replace(/stroke-linejoin/g, 'strokeLinejoin')
    .replace(/fill-rule/g, 'fillRule')
    .replace(/clip-rule/g, 'clipRule')
    .replace(/class="/g, 'className="')
    .replace(/color-interpolation-filters/g, 'colorInterpolationFilters')
    .replace(/xml:space/g, 'xmlSpace')
    .replace(/stop-color/g, 'stopColor')
    .replace(/stop-opacity/g, 'stopOpacity')
    .replace(/font-family/g, 'fontFamily')
    .replace(/font-size/g, 'fontSize')
    .replace(/letter-spacing/g, 'letterSpacing')
    .replace(/font-weight/g, 'fontWeight');

  // Convert style="key: value;" to style={{ key: 'value' }}
  jsx = jsx.replace(/style="([^"]+)"/g, function(match, styleString) {
    const rules = styleString.split(';').filter(Boolean);
    const objStr = rules.map(rule => {
      const parts = rule.split(':');
      if (parts.length < 2) return '';
      // Convert kebab-case to camelCase
      const key = parts[0].trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
      const value = parts.slice(1).join(':').trim().replace(/'/g, '"');
      return `${key}: '${value}'`;
    }).filter(Boolean).join(', ');
    return `style={{ ${objStr} }}`;
  });

  // Add framer-motion path animation to paths
  jsx = jsx.replace(/<path /g, '<motion.path initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} transition={{ duration: 2, ease: "easeInOut" }} ');
  jsx = jsx.replace(/<\/path>/g, '</motion.path>');

  const componentCode = `import React from 'react';
import { motion } from 'framer-motion';

export const MapSVG = () => {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      ${jsx}
    </div>
  );
};
`;

  fs.writeFileSync('src/components/modals/MapSVG.tsx', componentCode);
  console.log('Successfully created MapSVG.tsx!');
} catch(err) {
  console.error(err);
}
