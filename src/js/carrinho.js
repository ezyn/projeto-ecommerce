/*
Objetivo 1 - quando clicar no botão de adicionar ao carrinho:
    - atualizar o contador
    - adicionar o produto no localStorage
    - atualizar a tabela HTML do carrinho

Objetivo 2 - remover produtos do carrinho:
    - ouvir o botão de deletar
    - remover do localStorage
    - atualizar o DOM e o total

Objetivo 3 - atualizar valores do carrinho:
    - ouvir mudanças de quantidade
    - recalcular total individual
    - recalcular total geral
*/


// pega todos os botões de adicionar ao carrinho
const botoesAdicionarAoCarrinho = document.querySelectorAll('.adicionar-ao-carrinho');

// adiciona um evento de escuta nesses botões pra quando clicar disparar uma ação
botoesAdicionarAoCarrinho.forEach(botao => {
    botao.addEventListener('click', (evento) => {
        // pega as informações do produto clicado e adiciona no localStorage
        const elementoProduto = evento.target.closest('.produto');
        const produtoId = elementoProduto.dataset.id;
        const produtoNome = elementoProduto.querySelector('.nome').textContent;
        const produtoImagem = elementoProduto.querySelector('img').getAttribute('src');
        const produtoPreco = parseFloat(
            elementoProduto.querySelector('.preco').textContent
                .replace('R$ ', '') // remove o símbolo de real
                .replace('.', '')   // remove o ponto dos milhares
                .replace(',', '.')  // troca vírgula por ponto para o decimal
        );

        // buscar a lista de produtos do localStorage
        const carrinho = obterProdutosDoCarrinho();
        // verificar se o produto já existe no carrinho
        const existeProduto = carrinho.find(produto => produto.id === produtoId);

        if (existeProduto) {
            // se já existir, incrementa a quantidade
            existeProduto.quantidade = (existeProduto.quantidade || 1) + 1;
        } else {
            // se não existe, adicionar o produto com quantidade 1
            const produto = {
                id: produtoId,
                nome: produtoNome,
                preco: produtoPreco,
                imagem: produtoImagem,
                quantidade: 1,
            };
            // adiciona o produto ao carrinho
            carrinho.push(produto);
        }

        salvarProdutosNoCarrinho(carrinho);
        atualizarCarrinhoETabela()
    });
});

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
};

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
};

// Atualiza o contador do carrinho
function atualizarContadorCarrinho() {
    const carrinho = obterProdutosDoCarrinho();
    let total = 0;

    for (const item of carrinho) {
        total += item.quantidade;
    }

    document.getElementById('contador-carrinho').textContent = total;
};

// Renderizar a tabela do carrinho de compras
function renderizarTabelaCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector('#modal-1-content table tbody');
    if (!corpoTabela) return;

    corpoTabela.innerHTML = '';

    produtos.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class="td-produto">
                                <img
                                    src="${item.imagem}"
                                    alt="${item.nome}"
                                />
                            <td>${item.nome}</td>
                            <td class="td-preco-unitario">R$ ${item.preco.toFixed(2).replace('.', ',')}</td>
                            <td class="td-quantidade">
                                <input type="number" class="input-quantidade" value="${item.quantidade}" data-id="${item.id}" min="1" />
                            </td>
                            <td class="td-preco-total">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</td>
                            <td><button class="btn-deletar" data-id="${item.id}"></button>
                        </td>`;
        corpoTabela.appendChild(tr);
    });
};

// Adiciona o evento de clique na tabela para remover produtos
const corpoTabela = document.querySelector('#modal-1-content table tbody');
corpoTabela.addEventListener('click', evento => {
    
    if (evento.target.classList.contains('btn-deletar')) {
        const id = evento.target.dataset.id;
        //remove o produto do localStorage
        removerDoCarrinho(id);
    }
});

// adiciona o evento de escuta no input do tbody
corpoTabela.addEventListener('input', evento => {
    // atualiza o valor total do produto
    if(evento.target.classList.contains('input-quantidade')) {
        const produtos = obterProdutosDoCarrinho();
        const produto = produtos.find(produto => produto.id === evento.target.dataset.id);
        let novaQuantidade = parseInt(evento.target.value);
        if (produto) {
            produto.quantidade = novaQuantidade;
            salvarProdutosNoCarrinho(produtos);
            atualizarCarrinhoETabela()
        }
    }
});

// Função para remover um produto do carrinho
function removerDoCarrinho(id) {
    const produtos = obterProdutosDoCarrinho();

    // filtra os produtos que não tem o id passado por parametro
    const carrinhoAtualizado = produtos.filter(produto => produto.id !== id);
    salvarProdutosNoCarrinho(carrinhoAtualizado);
    atualizarCarrinhoETabela()
};

// atualizar valor total do carrinho
function atualizarValorTotalCarrinho(){
    const produtos = obterProdutosDoCarrinho();
    let total = 0;

    produtos.forEach(produto => {
        total += produto.preco * produto.quantidade;
    });

    document.getElementById('total-carrinho').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
};

// Atualiza o carrinho e a tabela
function atualizarCarrinhoETabela(){
    atualizarContadorCarrinho();
    renderizarTabelaCarrinho();
    atualizarValorTotalCarrinho();
};

atualizarCarrinhoETabela();
