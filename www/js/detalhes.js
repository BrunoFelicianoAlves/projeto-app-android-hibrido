//Recuperar o id do localStorage
var id = parseInt(localStorage.getItem('detalhe'));

//Pegar os produtos do localStorage
var produtos = JSON.parse(localStorage.getItem('produtos'));

var item = produtos.find(produto => produto.id === id);

if(item) {
    //Tem o item
    console.log('Produto encontrado: ', item);

    //Alimentar com os valores do item
    $("#imagem-detalhe").attr('src', item.imagem);
    $("#nome-detalhe").html(item.nome);
    $("#rating-detalhe").html(item.rating);
    $("#like-detalhe").html(item.likes);
    $("#reviews-detalhe").html(item.reviews + ' reviews');
    $("#descricao-detalhe").html(item.descricao);
    $("#preco-detalhe").html(item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    $("#precopromo-detalhe").html(item.preco_promocional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));

    var tabelaDetalhes = $("#tabelaDetalhes");

    item.detalhes.forEach(detalhe => {
        var linha = `
            <tr>
                <td>${detalhe.caracteristica}</td>
                <td>${detalhe.detalhes}</td>
            </tr>
            `;
        
        tabelaDetalhes.append(linha);
    });

} else {
    //Não tem o item
    console.log('Produto não encontrado');
}

var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

//Função para adicionar ao carrinho
function adicionarAoCarrinho(item, quantidade){
    var itemNoCarrinho = carrinho.find(c => c.item.id === item.id)

    if(itemNoCarrinho) {
        //Ja tem item no carrinho
        //Adicionar quantidade

        itemNoCarrinho.quantidade += quantidade;
        itemNoCarrinho.total_item = itemNoCarrinho.quantidade * item.preco_promocional;
    } else {
        carrinho.push({
            item: item,
            quantidade: quantidade,
            total_item: quantidade * item.preco_promocional
        })
    }

    //
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

//Clicou no adicionar carrinho
$(".add-cart").on('click', function() {
    //Adicionar ao carrinho
    adicionarAoCarrinho(item, 1);
    atualizarCarrinhoBadge();

    var toastCenter = app.toast.create({
        text: `${item.nome} adicionado ao carrinho`,
        position: 'center',
        closeTimeout: 2000,
    });

    toastCenter.open();
});