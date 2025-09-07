// ---- Atualiza o badge do carrinho ----
function atualizarCarrinhoBadge() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');

  // Contagem simples de itens
  const count = carrinho.length;

  // Se preferir somar quantidades:
  // const count = carrinho.reduce((acc, it) => acc + (it.quantidade || 1), 0);

  $('.btn-cart').attr('data-count', count);
}

// ---- Renderizar produtos ----
function renderProdutos(data) {
  const $lista = $("#produtos");
  $lista.empty();

  data.forEach(produto => {
    const html = `
      <div class="item-card">
        <a data-id="${produto.id}" href="#" class="item">
          <div class="img-container">
            <img src="${produto.imagem}" alt="${produto.nome}">
          </div>
          <div class="nome-rating">
            <span class="color-gray">${produto.nome}</span>
            <span class="bold margin-right">
              <i class="mdi mdi-star"></i> ${produto.rating}
            </span>
          </div>
          <div class="price bold">
            ${produto.preco_promocional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        </a>
      </div>
    `;
    $lista.append(html);
  });
}

// ---- Carregar produtos (com cache) ----
function carregarProdutos() {
  const cache = localStorage.getItem('produtos');
  if (cache) {
    try {
      const data = JSON.parse(cache);
      renderProdutos(data);
      return;
    } catch (e) {
      console.warn('Cache inválido, refazendo fetch…');
      localStorage.removeItem('produtos');
    }
  }

  fetch('js/backend.json')
    .then(r => r.json())
    .then(data => {
      localStorage.setItem('produtos', JSON.stringify(data));
      renderProdutos(data);
    })
    .catch(err => console.error('Erro ao carregar dados: ' + err));
}

// ---- Eventos globais (delegados) ----
function ligarEventosGlobais() {
  $(document).off('click', '.item');

  $(document).on('click', '.item', function (e) {
    e.preventDefault();
    const id = $(this).attr('data-id');
    localStorage.setItem('detalhe', id);
    app.views.main.router.navigate('/detalhes/');
  });
}