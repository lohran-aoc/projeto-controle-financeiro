// types/index.ts

export type Pessoa = {
  id: number;
  nome: string;
  idade: number;
};

export type Transacao = {
  id: number;
  descricao: string;
  valor: number;
  tipo: "Despesa" | "Receita";
  pessoaId: number;
};