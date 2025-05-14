// controllers/tarefaController.js
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const caminhoArquivo = './data/tarefas.json';

export async function listarTarefas(req, res) {
    try {
        const dados = await fs.readFile(caminhoArquivo, 'utf-8');
        const tarefas = JSON.parse(dados);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(tarefas, null, 2));
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao ler as tarefas.' });
    }
}

export async function buscarTarefaPorId(req, res) {
    try {
        const { id } = req.params;

        const conteudo = await fs.readFile(caminhoArquivo, 'utf-8');
        const tarefas = JSON.parse(conteudo);

        const tarefa = tarefas.find(t => t.id === id);

        if (!tarefa) {
            return res.status(404).json({ erro: 'Tarefa não encontrada.' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(tarefas, null, 2));

    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar tarefa.' });
    }
}


export async function criarTarefa(req, res) {
    try {
        // Padronizamos nome dos campos:
        const { titulo, descricao, concluida } = req.body;

        // Validação básica:
        if (!titulo || !descricao) {
            return res
                .status(400)
                .json({ erro: 'Título e descrição são obrigatórios.' });
        }

        // Lê tarefas existentes:
        const dados = await fs.readFile(caminhoArquivo, 'utf-8');
        const tarefas = JSON.parse(dados);

        // Cria nova tarefa:
        const novaTarefa = {
            id: uuidv4(),                       // chame a função
            titulo,
            descricao,
            concluida: concluida ?? false,      // se não vier, false
            dataCriacao: new Date().toISOString() // chamada correta
        };

        tarefas.push(novaTarefa);

        // Grava de volta no arquivo:
        await fs.writeFile(
            caminhoArquivo,
            JSON.stringify(tarefas, null, 2)
        );

        res.status(201).json(novaTarefa);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar a tarefa.' });
    }
}
