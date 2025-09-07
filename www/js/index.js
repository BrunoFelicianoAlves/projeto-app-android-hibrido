function renderProdutos(data) {
  //Simular carregamento (opcional)
  setTimeout(() => {
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

    // $(".item").on('click', function() {
    //   var id = $(this).attr('data-id')
    //   localStorage.setItem('detalhe', id);
    //   app.views.main.router.navigate('/detalhes/');
    // });

  }, 300);
}

// ---- fonte dos dados (cache + fetch) ----
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
    .catch(err => console.error('Erro ao fazer fetch dos dados: ' + err));
}

function atualizarCarrinhoBadge() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');

  // Se você quiser contar itens (não quantidades), mantenha length:
  const count = carrinho.length;

  // Se preferir somar quantidades, use:
  // const count = carrinho.reduce((acc, it) => acc + (it.qtd || 1), 0);

  $('.btn-cart').attr('data-count', count);
}

// window.atualizarCarrinhoBadge = function () {
//   const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
//   const count = carrinho.reduce((acc, c) => acc + (c.quantidade || 1), 0);

//   $('.btn-cart').attr('data-count', count);
// };

// ---- eventos globais (delegados) ----
function ligarEventosGlobais() {
  // evita múltiplos bindings quando voltar várias vezes
  $(document).off('click', '.item');

  $(document).on('click', '.item', function (e) {
    e.preventDefault();
    //const id = $(this).data('id');
    const id = $(this).attr('data-id');
    localStorage.setItem('detalhe', id);
    app.views.main.router.navigate('/detalhes/');
  });
}

// ---- primeira carga do app ----
document.addEventListener('DOMContentLoaded', () => {
  ligarEventosGlobais();
  carregarProdutos(); // garante exibição na primeira vez
});

// ---- toda vez que a página index entra em foco (inclusive após voltar) ----
$(document).on('page:afterin', '.page[data-name="index"]', function () {
  carregarProdutos();
  atualizarCarrinhoBadge();
});


//Primeira Versão

// fetch('js/backend.json')
//     .then(response => response.json())
//     .then(data => { 
//         localStorage.setItem('produtos', JSON.stringify(data));
//         console.log('Dados dos produtos salvos no localStorage'); 

//         //Simular carregamento
//         setTimeout(() => {
//             //Esvaziar area de produtos
//             $("#produtos").empty();
//                 data.forEach(produto => {
//                     var produtosHTML = `
//                         <div class="item-card">
//                             <a data-id=${produto.id} href="#" class="item">
//                                 <div class="img-container">
//                                     <img src="${produto.imagem}">
//                                 </div>
//                                     <div class="nome-rating">
//                                         <span class="color-gray">${produto.nome}</span>
//                                         <span class="bold margin-right">
//                                             <i class="mdi mdi-star"></i>
//                                                 ${produto.rating}
//                                             </span>
//                                     </div>
//                                 <div class="price bold">${produto.preco_promocional.toLocaleString('pt-Br', { style: 'currency', currency: 'BRL'})}</div>
//                             </a>
//                         </div>
//                     `;

//                     $("#produtos").append(produtosHTML);

//                 });

//                 $(".item").on('click', function () {
//                     var id = $(this).attr('data-id');
//                     localStorage.setItem('detalhe', id);
//                     app.views.main.router.navigate('/detalhes/');
//                 });

//             }, 1000);
//     })
// .catch(error => console.error('Erro ao fazer fetch dos dados: ' + error ));