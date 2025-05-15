import { Router } from "express";
import {
    verLivros,
    procurarLivro,
    adicionarLivro,
    editarLivro,
    deletarLivro,
    ordenar
} from '../controllers/controleLivros.js';

const router = Router();

router.get('/', (req, res) => {
    if (req.query.ordenar) {
        return ordenar(req, res);
    }
    return verLivros(req, res);
});

router.post('/', adicionarLivro);
router.get('/:id', procurarLivro);
router.put('/:id', editarLivro);
router.delete('/:id', deletarLivro);

export default router;
