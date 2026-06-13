const fs = require('fs');
const filePath = 'c:/Users/catmu/Downloads/panorama-fenica/src/data/mock.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/({ code: '([^']+)', type: '([^']+)'(.*?)})(,|$)/g, (match, p1, code, type, rest, suffix) => {
    let img = "1pn.png";
    const lowerType = type.toLowerCase();
    if (lowerType.includes("1 bedroom")) {
        img = "1pn.png";
    } else if (lowerType.includes("2 bedroom")) {
        img = parseInt(code.replace(/\D/g, '') || '0') % 2 === 0 ? "2pn.png" : "2pn-v2.png";
    } else {
        img = "1pn+goc.png";
    }
    
    // Don't add twice
    if (p1.includes('room3dImage')) return match;

    // insert room3dImage before closing brace
    const modifiedObj = p1.replace(/}$/, `, room3dImage: '/assets/images/room3d/${img}' }`);
    return modifiedObj + suffix;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log("mock.ts has been updated successfully.");
