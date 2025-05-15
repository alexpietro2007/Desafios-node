import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
const caminho = new URL('../data/acervo.json', import.meta.url);

// Função para listar os livros

export async function verLivros(req, res) {
  try {
    const conteudo = await fs.readFile(caminho, 'utf-8');
    const dados = JSON.parse(conteudo);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(dados, null, 2));// você pode usar .json direto com o objeto
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao ler os livros' });
  }
}

// Função para adicionar um novo livro
export async function adicionarLivro(req, res) {
  try {
    const conteudo = await fs.readFile(caminho, 'utf-8');
    const livros = JSON.parse(conteudo);

    const entrada = Array.isArray(req.body) ? req.body : [req.body];

    const novosLivros = entrada.map(livro => ({
      id: uuidv4(),
      titulo: livro.titulo,
      autor: livro.autor,
      ano: livro.ano,
      dataCadastro: new Date().toISOString()
    }));

    livros.push(...novosLivros);

    await fs.writeFile(caminho, JSON.stringify(livros, null, 2));

    res.status(201).json({ mensagem: 'Livros adicionados com sucesso', livros: novosLivros });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao adicionar os livros' });
  }
}


export async function procurarLivro(req, res) {
  try {
    const { id } = req.params
    const conteudo = await fs.readFile(caminho, 'utf-8');
    const dados = JSON.parse(conteudo);
    const livro = dados.find(l => l.id === id)

    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrada.' });
    }

    res.status(201).json(livro)
  } catch (err) {
    res.status(500).json({ err: 'erro ao Procurar o Livro' })
  }
}

export async function editarLivro(req, res) {
  try {
    const { id } = req.params;
    const { titulo, autor, ano } = req.body;

    const conteudo = await fs.readFile(caminho, 'utf-8');
    const dados = JSON.parse(conteudo);

    const index = dados.findIndex(l => l.id === id);
    if (index === -1) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    // Atualiza os campos se forem enviados
    if (titulo) dados[index].titulo = titulo;
    if (autor) dados[index].autor = autor;
    if (ano) dados[index].ano = ano;

    // Atualiza a data de alteração
    dados[index].dataAlteracao = new Date().toISOString();

    await fs.writeFile(caminho, JSON.stringify(dados, null, 2));

    res.status(200).json({ mensagem: 'Livro atualizado com sucesso', livro: dados[index] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao editar o livro' });
  }
}

export async function deletarLivro(req, res) {
  try {
    const { id } = req.params
    const conteudo = await fs.readFile(caminho, 'utf-8');
    const dados = JSON.parse(conteudo);
    const lista = dados.filter(livro => livro.id !== id)
    if (lista.length === dados.length) {
      return res.status(404).json({ erro: 'Livro não encontrada.' });
    }
    await fs.writeFile(caminho, JSON.stringify(lista, null, 2));

    res.status(200).json({ mensagem: `livro com ID ${id} removido com sucesso.` });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar o livro' })
  }
}
export async function ordenar(req, res) {
  try {
    const { ordenar: campo } = req.query; // Renomeando para evitar conflito
    const conteudo = await fs.readFile(caminho, 'utf-8');
    const dados = JSON.parse(conteudo);
    const lista = [...dados];

    if (campo === 'ano') {
      lista.sort((a, b) => a.ano - b.ano);
    } else {
      return res.status(400).json({ message: `Não é possível ordenar por "${campo}"` });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(lista, null, 4));

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao ordenar os livros' });
  }
}

