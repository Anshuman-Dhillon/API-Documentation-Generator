const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const app = express();

// Function to recursively scan files in a directory
function scanFiles(dir, fileList = []) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanFiles(fullPath, fileList);
        } else {
            fileList.push(fullPath);
        }
    });
    return fileList;
}

// Function to extract Swagger comments using regex (for JavaScript)
function extractSwaggerComments(fileContent, ext) {
  if (ext === '.py') {
      // For Python files, look for multi-line strings containing Swagger JSON
      const regex = /"""([\s\S]*?)"""/g;  // Python multi-line string
      return fileContent.match(regex) || [];
  } else {
      // For JavaScript files, look for block comments with @swagger
      const regex = /\/\*\*([\s\S]*?@swagger[\s\S]*?)\*\//g;  // Matches block comments containing @swagger
      return fileContent.match(regex) || [];
  }
}

function cleanAndParseSwaggerComment(comment) {
  try {
      // Remove block comment markers and leading asterisks
      const cleanedComment = comment
          .replace(/\/\*\*|\*\//g, '') // Remove /** and */
          .replace(/^\s*\*\s?/gm, '') // Remove leading *
          .trim();

      // Handle triple quotes (for Python-style comments)
      const swaggerComment = cleanedComment.startsWith('"""') 
          ? cleanedComment.slice(3, -3).trim() // Remove the triple quotes
          : cleanedComment.replace('@swagger', '').trim(); // Remove the @swagger tag

      // Parse the cleaned comment as JSON
      return JSON.parse(swaggerComment);
  } catch (err) {
      console.warn(`Failed to parse Swagger comment:`, err.message);
      return null;
  }
}


function buildSwaggerSpec() {
  const routesDir = path.join(__dirname, 'routes');
  const files = scanFiles(routesDir);
  const swaggerPaths = {};

  files.forEach(file => {
      const ext = path.extname(file);
      if (!['.js', '.py', '.ts'].includes(ext)) return; // Support for JS, Python, TypeScript

      console.log(`Processing file: ${file}`);
      const content = fs.readFileSync(file, 'utf8');
      const swaggerComments = extractSwaggerComments(content, ext);

      console.log(`Extracted comments from ${file}:`, swaggerComments);

      swaggerComments.forEach(comment => {
          console.log("Processing comment: ", comment);  // Log the comment being processed
          const parsedComment = cleanAndParseSwaggerComment(comment);
          if (parsedComment && parsedComment.paths) {
              console.log("Parsed Swagger Comment:", JSON.stringify(parsedComment, null, 2));  // Log parsed comment

              // Merge paths into swaggerPaths
              Object.keys(parsedComment.paths).forEach(pathKey => {
                  if (!swaggerPaths[pathKey]) {
                      swaggerPaths[pathKey] = parsedComment.paths[pathKey];
                  } else {
                      Object.assign(swaggerPaths[pathKey], parsedComment.paths[pathKey]);
                  }
              });
          }
      });
  });

  console.log("Swagger Paths:", JSON.stringify(swaggerPaths, null, 2));  // Log the final swaggerPaths

  return {
      openapi: '3.0.0',
      info: {
          title: 'Automated API Documentation',
          version: '1.0.0',
          description: 'Generated from route files automatically',
      },
      paths: swaggerPaths,
  };
}


// Build Swagger Spec
const swaggerSpec = buildSwaggerSpec();

console.log(`Final Swagger Spec:`, JSON.stringify(swaggerSpec, null, 2));


// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
    console.log('Swagger docs available at http://localhost:3000/api-docs');
});
