using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleFinanceiro.Api.Data;
using ControleFinanceiro.Api.Models;

namespace ControleFinanceiro.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PessoasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/pessoas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pessoa>>> ListarPessoas()
        {
            return await _context.Pessoas.ToListAsync();
        }

        // POST: api/pessoas
        [HttpPost]
        public async Task<ActionResult<Pessoa>> CriarPessoa(Pessoa pessoa)
        {
            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(ListarPessoas), new { id = pessoa.Id }, pessoa);
        }

        // DELETE: api/pessoas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletarPessoa(int id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);

            if (pessoa == null)
            {
                return NotFound();
            }

            // A exclusão em cascata configurada no AppDbContext remove as transações junto
            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}