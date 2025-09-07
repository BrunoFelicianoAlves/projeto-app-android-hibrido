// ---- primeira carga do app ----
document.addEventListener('DOMContentLoaded', () => {
  ligarEventosGlobais();       // ativa cliques nos produtos
  carregarProdutos();          // exibe os produtos
  atualizarCarrinhoBadge();    // mostra o badge do carrinho
});

// ---- toda vez que a página index entra em foco (inclusive após voltar) ----
$(document).on('page:afterin', '.page[data-name="index"]', function () {
  carregarProdutos();          // recarrega produtos
  atualizarCarrinhoBadge();    // atualiza badge
});