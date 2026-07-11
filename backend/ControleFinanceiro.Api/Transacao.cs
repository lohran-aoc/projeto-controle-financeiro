namespace ControleFinanceiro.Api.Models
{
    // Representa uma movimentação financeira (receita ou despesa) de uma pessoa
    public class Transacao
    {
        public int Id { get; set; }

        public string Descricao { get; set; } = string.Empty;

        public decimal Valor { get; set; }

        // "Despesa" ou "Receita" — validado no Controller
        public string Tipo { get; set; } = string.Empty;

        public int PessoaId { get; set; }

        public Pessoa? Pessoa { get; set; }
    }
}