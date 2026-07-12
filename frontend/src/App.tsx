import { useState, useEffect } from "react";
import type { Pessoa } from "./types";
import { listarPessoas, criarPessoa, deletarPessoa } from "./services/api";

function App() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");

  // Busca as pessoas assim que a tela carrega
  useEffect(() => {
    carregarPessoas();
  }, []);

  async function carregarPessoas() {
    const dados = await listarPessoas();
    setPessoas(dados);
  }

  async function handleCriarPessoa(evento: React.FormEvent) {
    evento.preventDefault();

    await criarPessoa({ nome, idade: Number(idade) });

    setNome("");
    setIdade("");
    carregarPessoas();
  }

  async function handleDeletarPessoa(id: number) {
    await deletarPessoa(id);
    carregarPessoas();
  }

  return (
    <div>
      <h1>Controle de Gastos Residenciais</h1>

      <section>
        <h2>Pessoas</h2>

        <form onSubmit={handleCriarPessoa}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Idade"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            required
          />
          <button type="submit">Cadastrar</button>
        </form>

        <ul>
          {pessoas.map((pessoa) => (
            <li key={pessoa.id}>
              {pessoa.nome} ({pessoa.idade} anos)
              <button onClick={() => handleDeletarPessoa(pessoa.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;