using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleFinanceiro.Api.Data;
using ControleFinanceiro.Api.Models;

namespace ControleFinanceiro.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransacoesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/transacoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transacao>>> ListarTransacoes()
        {
            return await _context.Transacoes.ToListAsync();
        }

        // POST: api/transacoes
        [HttpPost]
        public async Task<ActionResult<Transacao>> CriarTransacao(Transacao transacao)
        {
            var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId);

            if (pessoa == null)
            {
                return BadRequest("Pessoa não encontrada.");
            }

            // Menores de idade só podem ter despesas cadastradas
            if (pessoa.Idade < 18 && transacao.Tipo == "Receita")
            {
                return BadRequest("Erro: Apenas despesas podem ser registradas por menores de idade!");
            }

            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(ListarTransacoes), new { id = transacao.Id }, transacao);
        }

        // GET: api/transacoes/totais
        [HttpGet("totais")]
        public async Task<ActionResult<IEnumerable<object>>> ConsultarTotais()
        {
            var pessoas = await _context.Pessoas
                .Include(p => p.Transacoes)
                .ToListAsync();

            var totais = pessoas.Select(p => new
            {
                PessoaId = p.Id,
                Nome = p.Nome,
                TotalReceitas = p.Transacoes!.Where(t => t.Tipo == "Receita").Sum(t => t.Valor),
                TotalDespesas = p.Transacoes!.Where(t => t.Tipo == "Despesa").Sum(t => t.Valor),
                Saldo = p.Transacoes!.Where(t => t.Tipo == "Receita").Sum(t => t.Valor)
                    - p.Transacoes!.Where(t => t.Tipo == "Despesa").Sum(t => t.Valor)
            });

            var totalGeral = new
            {
                TotalReceitas = totais.Sum(t => t.TotalReceitas),
                TotalDespesas = totais.Sum(t => t.TotalDespesas),
                Saldo = totais.Sum(t => t.Saldo)
            };

            return Ok(new { Pessoas = totais, TotalGeral = totalGeral });
        }
    }
}