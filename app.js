
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

import indexRouter from './routes/index.js';
app.use('/', indexRouter);

app.use((req, res) => {
    res.status(404).send('<h1>404 - Page Not Found</h1><p><a href="/">Return to ChronoSphere</a></p>');
});

app.listen(PORT, () => {
    console.log(`✅ ChronoSphere server is running on port ${PORT}`);
});