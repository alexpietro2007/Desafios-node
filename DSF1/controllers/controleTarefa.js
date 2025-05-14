// controllers/tarefaController.js
import { promises as fs } from 'fs';
import { json } from 'stream/consumers';
import { v4 as uuidv4 } from 'uuid';

const caminhoArquivo = './data/tarefas.json';

export async function listarTarefas(req, res) {
    try {
        const dados = await fs.readFile(caminhoArquivo, 'utf-8');
        const tarefas = JSON.parse(dados);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(tarefas, null, 2));
    } catch (error) {
        console.error(error);
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
        res.send(JSON.stringify(tarefa, null, 2));
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar tarefa.' });
    }
}

export async function criarTarefa(req, res) {
    try {
        const { titulo, descricao, concluida } = req.body;

        if (!titulo || !descricao) {
            return res.status(400).json({ erro: 'Título e descrição são obrigatórios.' });
        }

        const dados = await fs.readFile(caminhoArquivo, 'utf-8');
        const tarefas = JSON.parse(dados);

        const novaTarefa = {
            id: uuidv4(), 
            titulo,
            descricao,
            concluida: concluida ?? false,
            dataCriacao: new Date().toISOString()
        };

        tarefas.push(novaTarefa);

        await fs.writeFile(caminhoArquivo, JSON.stringify(tarefas, null, 2));

        res.status(201).json(novaTarefa);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao criar a tarefa.' });
    }
}

export async function atualizarTarefa(req, res) {
    try {
        const { id } = req.params;
        const { titulo, descricao, concluida } = req.body;

        const conteudo = await fs.readFile(caminhoArquivo, 'utf-8');
        const tarefas = JSON.parse(conteudo);

        const index = tarefas.findIndex(t => t.id === id);

        if (index === -1) {
            return res.status(404).json({ erro: 'Tarefa não encontrada.' });
        }

        if (titulo) tarefas[index].titulo = titulo;
        if (descricao) tarefas[index].descricao = descricao;
        if (typeof concluida === 'boolean') tarefas[index].concluida = concluida;

        await fs.writeFile(caminhoArquivo, JSON.stringify(tarefas, null, 2));

        res.json({ mensagem: 'Tarefa atualizada com sucesso.', tarefa: tarefas[index] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao atualizar a tarefa.' });
    }
}

export async function deletarTarefa(req, res) {
    try {
        const { id } = req.params;

        const conteudo = await fs.readFile(caminhoArquivo, 'utf-8');
        const tarefas = JSON.parse(conteudo);

        const lista = tarefas.filter(tarefa => tarefa.id !== id);

        if (lista.length === tarefas.length) {
            return res.status(404).json({ erro: 'Tarefa não encontrada.' });
        }

        await fs.writeFile(caminhoArquivo, JSON.stringify(lista, null, 2));

        console.log(`Tarefa com ID ${id} removida com sucesso.`);
        res.status(200).json({ mensagem: `Tarefa com ID ${id} removida com sucesso.` });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao deletar a tarefa.' });
    }
}
