// routes/tarefaRoutes.js
import { Router } from 'express';
import {
    listarTarefas,
    criarTarefa,
    buscarTarefaPorId,
} from '../controllers/controleTarefa.js';

const router = Router();

router.get('/', listarTarefas);
router.post('/', criarTarefa);
router.get('/:id', buscarTarefaPorId)

export default router;