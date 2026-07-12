import type { Pessoa, ResultadoTotais, Transacao } from "../types";

const BASE_URL = "http://localhost:5138/api";

export async function listarPessoas(): Promise<Pessoa[]> {
  const resposta = await fetch(`${BASE_URL}/pessoas`);
  return resposta.json();
}

export async function criarPessoa(pessoa: Omit<Pessoa, "id">): Promise<Pessoa> {
  const resposta = await fetch(`${BASE_URL}/pessoas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pessoa),
  });
  return resposta.json();
}

export async function deletarPessoa(id: number): Promise<void> {
  await fetch(`${BASE_URL}/pessoas/${id}`, { method: "DELETE" });
}

export async function listarTransacoes(): Promise<Transacao[]> {
  const resposta = await fetch(`${BASE_URL}/transacoes`);
  return resposta.json();
}

export async function criarTransacao(transacao: Omit<Transacao, "id">): Promise<Transacao> {
  const resposta = await fetch(`${BASE_URL}/transacoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transacao),
  });
  return resposta.json();
}

export async function consultarTotais(): Promise<ResultadoTotais> {
  const resposta = await fetch(`${BASE_URL}/transacoes/totais`);
  return resposta.json();
}