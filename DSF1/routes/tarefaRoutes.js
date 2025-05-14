// routes/tarefaRoutes.js
import { Router } from 'express';
import {
    listarTarefas,
    criarTarefa,
    buscarTarefaPorId,
    atualizarTarefa,
    deletarTarefa,
} from '../controllers/controleTarefa.js';

const router = Router();

router.get('/', listarTarefas);
router.post('/', criarTarefa);
router.get('/:id', buscarTarefaPorId);
router.put('/:id', atualizarTarefa);
router.delete('/:id', deletarTarefa);

export default router;