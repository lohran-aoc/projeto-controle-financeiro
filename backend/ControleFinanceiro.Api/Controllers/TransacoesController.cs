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
    }
}