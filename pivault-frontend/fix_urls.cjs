const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replaceInFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace backticks: `http://localhost:5000/...` -> `${import.meta.env.VITE_API_URL}/...`
    content = content.replace(/`http:\/\/localhost:5000/g, '`${import.meta.env.VITE_API_URL}');
    
    // Replace double quotes: "http://localhost:5000/..." -> `${import.meta.env.VITE_API_URL}/...`
    content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`${import.meta.env.VITE_API_URL}$1`');
    
    // Replace single quotes: 'http://localhost:5000/...' -> `${import.meta.env.VITE_API_URL}/...`
    content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${import.meta.env.VITE_API_URL}$1`');

    fs.writeFileSync(filePath, content, 'utf8');
};

const walk = (dir) => {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) walk(file);
        else if (file.endsWith('.js') || file.endsWith('.vue')) replaceInFile(file);
    });
};

walk(srcDir);
console.log('URLs updated!');
