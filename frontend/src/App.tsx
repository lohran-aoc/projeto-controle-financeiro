import { useState, useEffect } from "react";
import type { Pessoa, Transacao, ResultadoTotais } from "./types";
import {
  listarPessoas,
  criarPessoa,
  deletarPessoa,
  listarTransacoes,
  consultarTotais,
} from "./services/api";

function App() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");

  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<"Despesa" | "Receita">("Despesa");
  const [pessoaSelecionadaId, setPessoaSelecionadaId] = useState("");
  const [erroTransacao, setErroTransacao] = useState("");

  const [totais, setTotais] = useState<ResultadoTotais | null>(null);
  const [filtroPessoaId, setFiltroPessoaId] = useState("");

  useEffect(() => {
    carregarPessoas();
    carregarTransacoes();
    carregarTotais();
  }, []);

  async function carregarPessoas() {
    const dados = await listarPessoas();
    setPessoas(dados);
  }

  async function carregarTransacoes() {
    const dados = await listarTransacoes();
    setTransacoes(dados);
  }

  async function carregarTotais() {
    const dados = await consultarTotais();
    setTotais(dados);
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
    carregarTransacoes();
    carregarTotais();
  }

  async function handleCriarTransacao(evento: React.FormEvent) {
    evento.preventDefault();
    setErroTransacao("");

    const resposta = await fetch("http://localhost:5068/api/transacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descricao,
        valor: Number(valor),
        tipo,
        pessoaId: Number(pessoaSelecionadaId),
      }),
    });

    if (!resposta.ok) {
      const mensagem = await resposta.text();
      setErroTransacao(mensagem);
      return;
    }

    setDescricao("");
    setValor("");
    setPessoaSelecionadaId("");
    carregarTransacoes();
    carregarTotais();
  }

  const pessoasParaExibir = totais
    ? filtroPessoaId
      ? totais.pessoas.filter((p) => p.pessoaId === Number(filtroPessoaId))
      : totais.pessoas
    : [];

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

      <section>
        <h2>Transações</h2>

        <form onSubmit={handleCriarTransacao}>
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as "Despesa" | "Receita")}
          >
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
          </select>
          <select
            value={pessoaSelecionadaId}
            onChange={(e) => setPessoaSelecionadaId(e.target.value)}
            required
          >
            <option value="">Selecione a pessoa</option>
            {pessoas.map((pessoa) => (
              <option key={pessoa.id} value={pessoa.id}>
                {pessoa.nome}
              </option>
            ))}
          </select>
          <button type="submit">Cadastrar</button>
        </form>

        {erroTransacao && <p style={{ color: "red" }}>{erroTransacao}</p>}

        <ul>
          {transacoes.map((transacao) => (
            <li key={transacao.id}>
              {transacao.descricao} — R$ {transacao.valor.toFixed(2)} ({transacao.tipo})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Totais</h2>

        <select
          value={filtroPessoaId}
          onChange={(e) => setFiltroPessoaId(e.target.value)}
        >
          <option value="">Todas as pessoas</option>
          {pessoas.map((pessoa) => (
            <option key={pessoa.id} value={pessoa.id}>
              {pessoa.nome}
            </option>
          ))}
        </select>

        <ul>
          {pessoasParaExibir.map((p) => (
            <li key={p.pessoaId}>
              {p.nome} — Receitas: R$ {p.totalReceitas.toFixed(2)} | Despesas: R${" "}
              {p.totalDespesas.toFixed(2)} | Saldo: R$ {p.saldo.toFixed(2)}
            </li>
          ))}
        </ul>

        {totais && !filtroPessoaId && (
          <p>
            <strong>
              Total geral — Receitas: R$ {totais.totalGeral.totalReceitas.toFixed(2)} |
              Despesas: R$ {totais.totalGeral.totalDespesas.toFixed(2)} | Saldo: R${" "}
              {totais.totalGeral.saldo.toFixed(2)}
            </strong>
          </p>
        )}
      </section>
    </div>
  );
}

export default App;