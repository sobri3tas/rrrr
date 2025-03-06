const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const PRODUCTS_FILE = path.join(__dirname, '../backend/products.json');

let products = require(PRODUCTS_FILE);

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, '../adminf/index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.method === 'GET' && req.url === '/products') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(products));
    } else if (req.method === 'POST' && req.url === '/products') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newProduct = JSON.parse(body);
            newProduct.id = products.length + 1;
            products.push(newProduct);
            fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newProduct));
        });
    } else if (req.method === 'PUT' && req.url.startsWith('/products/')) {
        const productId = parseInt(req.url.split('/')[2]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const updatedProduct = JSON.parse(body);
            products = products.map(product =>
                product.id === productId ? { ...product, ...updatedProduct } : product
            );
            fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(products.find(product => product.id === productId)));
        });
    } else if (req.method === 'DELETE' && req.url.startsWith('/products/')) {
        const productId = parseInt(req.url.split('/')[2]);
        products = products.filter(product => product.id !== productId);
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
        res.writeHead(204);
        res.end();
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Admin server is running on http://localhost:${PORT}`);
});