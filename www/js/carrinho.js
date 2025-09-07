// app.dialog.alert('disparou');

var localCarrinho = localStorage.getItem('carrinho');

if(localCarrinho) {
    var carrinho = JSON.parse(localCarrinho);
    if(carrinho.length > 0 ) {
        //Tem itens no carrinho
        //Renderizar o carrinho
        renderizarCarrinho();
        //Somar totais do produtos
        calcularTotal();
    } else {
        //Mostrar carrinho vazio
        carrinhoVazio();
    }
} else {
    //Mostrar carrinho vazio
    carrinhoVazio();
}

function renderizarCarrinho() {
    $("#listaCarrinho").empty();
    $.each(carrinho, function(index, itemNoCarrinho) {
        var itemDiv = `
        <!-- Item do carrinho -->
            <div class="item-carrinho" >
              <div class="area-img">
                <img src="${itemNoCarrinho.item.imagem}">
              </div>
              <div class="area-details">
                <div class="sup">
                  <span class="name-prod">
                    ${itemNoCarrinho.item.nome}
                  </span>
                  <a data-index="${index}" class="delete-item" href="#">
                    <i class="mdi mdi-close"></i>
                  </a>
                </div>
                <div class="middle">
                  <span>${itemNoCarrinho.item.principal_caracteristica}</span>
                </div>
                <div class="preco-quantidade">
                  <span>${itemNoCarrinho.item.preco_promocional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  <div class="count">
                    <a class="minus" data-index="${index}" href="#">-</a>
                    <input  readonly href="#" class="qtd-item" type="text" value="${itemNoCarrinho.quantidade}"></input>
                    <a class="plus" data-index="${index}" href="#">+</a>
                  </div>
                </div>
              </div>
            </div>
            `;
        $("#listaCarrinho").append(itemDiv);
    });

    $(".delete-item").on('click', function () {
    var index = $(this).data('index');
    console.log('O indice é: ', index);

    //Confirmar
    app.dialog.confirm('Confirma a remoção?','Remover', function() {
    //Remover o item do carrinho
    carrinho.splice(index, 1);
    //Atualizar o carrinho com item removido
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    renderizarCarrinho();
    calcularTotal();
    atualizarCarrinhoBadge();
});

});

    $(".minus").on('click', function () {
        var index = $(this).data('index');
        console.log('O indice é: ', index);
       
        if(carrinho[index].quantidade > 1 ) {
            carrinho[index].quantidade --;
            carrinho[index].total_item = carrinho[index].quantidade * carrinho[index].item.preco_promocional;
            localStorage.setItem('carrinho', JSON.stringify(carrinho))
            app.views.main.router.refreshPage();
        } else {
            var itemName = carrinho[index].item.nome;
            app.dialog.confirm(`Gostaria de remover o ${itemName} ?`, 'Remover', function(){
                carrinho.splice(index, 1);
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                renderizarCarrinho();
                calcularTotal();
                atualizarCarrinhoBadge();
            });
        }
    });

    $(".plus").on('click', function () {
        var index = $(this).data('index');
        console.log('O indice é: ', index);
       
        carrinho[index].quantidade++;
        carrinho[index].total_item = carrinho[index].quantidade * carrinho[index].item.preco_promocional;
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        renderizarCarrinho();
        calcularTotal();
        
    });
}

function calcularTotal() {
    var totalCarrinho = 0;
    $.each(carrinho, function(index, itemNoCarrinho) {
        totalCarrinho += itemNoCarrinho.total_item;
    });
    $("#subtotal").html(totalCarrinho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
}

function carrinhoVazio() {
    $("#listaCarrinho").empty();

    $("#toolbarTotais").addClass('display-none');
    $("#toolbarChekout").addClass('display-none');

    //Mostrar sacolinha vazia
    $("#listaCarrinho").html(`
        <div class="text-align-center">
            <img id="img-carrinho" width="300" src="img/empty.gif">
            <br><span class="color-gray">Nada por enquanto...</span>
        </div>
        `)
}

$("#esvaziar").on('click', function() {
    app.dialog.confirm('Tem certeza que quer esvaziar o carrinho?', 'ESVAZIAR', function(){
        //Apagar o localStorage do carrinho
        localStorage.removeItem('carrinho');
        carrinho = [];
        carrinhoVazio();
        atualizarCarrinhoBadge();
    });
})