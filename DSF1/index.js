// index.js
import express from 'express';
import router from './routes/tarefaRoutes.js';

const app = express();
app.use(express.json());
app.use('/tarefas', router);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});