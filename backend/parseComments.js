const fs = require('fs');
const path = require('path');

function parseCommentsFromFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const regex = /@swagger([\s\S]*?)\*\//g; // Extract comments with @swagger
    let match;
    const swaggerDocs = [];

    while ((match = regex.exec(content)) !== null) {
        swaggerDocs.push(match[1].trim());
    }

    return swaggerDocs;
}

function parseRoutes(dirPath) {
    const files = fs.readdirSync(dirPath);
    let swaggerDocs = [];

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const ext = path.extname(file);

        if (fs.statSync(filePath).isDirectory()) {
            swaggerDocs = swaggerDocs.concat(parseRoutes(filePath));
        } else if (['.js', '.py', '.java'].includes(ext)) { // Handle JS, Python, Java
            swaggerDocs = swaggerDocs.concat(parseCommentsFromFile(filePath));
        }
    });

    return swaggerDocs;
}

module.exports = { parseRoutes };