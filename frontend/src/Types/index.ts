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

export type TotalPorPessoa = {
  pessoaId: number;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
};

export type TotalGeral = {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
};

export type ResultadoTotais = {
  pessoas: TotalPorPessoa[];
  totalGeral: TotalGeral;
};