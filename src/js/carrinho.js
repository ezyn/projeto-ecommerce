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

// Melhoria: extraí a lógica de adicionar produto para uma função separada, facilitando manutenção e testes
function adicionarProdutoAoCarrinho(elementoProduto) {
    const produtoId = elementoProduto.dataset.id;
    const produtoNome = elementoProduto.querySelector('.nome').textContent;
    const produtoImagem = elementoProduto.querySelector('img').getAttribute('src');
    const produtoPreco = parseFloat(
        elementoProduto.querySelector('.preco').textContent
            .replace('R$ ', '')
            .replace('.', '')
            .replace(',', '.')
    );

    const carrinho = obterProdutosDoCarrinho();
    const existeProduto = carrinho.find(produto => produto.id === produtoId);

    if (existeProduto) {
        existeProduto.quantidade = (existeProduto.quantidade || 1) + 1;
    } else {
        carrinho.push({
            id: produtoId,
            nome: produtoNome,
            preco: produtoPreco,
            imagem: produtoImagem,
            quantidade: 1,
        });
    }
    salvarProdutosNoCarrinho(carrinho);
    atualizarCarrinhoETabela(); // Melhoria: chama uma função única para atualizar tudo
}

botoesAdicionarAoCarrinho.forEach(botao => {
    botao.addEventListener('click', (evento) => {
        adicionarProdutoAoCarrinho(evento.target.closest('.produto'));
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
    // Melhoria: uso de reduce para somar as quantidades, mais moderno
    const carrinho = obterProdutosDoCarrinho();
    const total = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    document.getElementById('contador-carrinho').textContent = total;
};

// Renderizar a tabela do carrinho de compras
function renderizarTabelaCarrinho() {
    // Melhoria: função mais enxuta, evita duplicidade de busca do carrinho
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector('#modal-1-content table tbody');
    if (!corpoTabela) return;

    corpoTabela.innerHTML = '';
    produtos.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="td-produto">
                <img src="${item.imagem}" alt="${item.nome}" />
            </td>
            <td>${item.nome}</td>
            <td class="td-preco-unitario">R$ ${item.preco.toFixed(2).replace('.', ',')}</td>
            <td class="td-quantidade">
                <input type="number" class="input-quantidade" value="${item.quantidade}" data-id="${item.id}" min="1" />
            </td>
            <td class="td-preco-total">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</td>
            <td><button class="btn-deletar" data-id="${item.id}"></button></td>
        `;
        corpoTabela.appendChild(tr);
    });
};

// Adiciona o evento de clique na tabela para remover produtos
// Melhoria: event delegation para input e click, evita duplicidade de listeners
const corpoTabela = document.querySelector('#modal-1-content table tbody');

corpoTabela.addEventListener('click', evento => {
    if (evento.target.classList.contains('btn-deletar')) {
        const id = evento.target.dataset.id;
        removerDoCarrinho(id);
    }
});

// adiciona o evento de escuta no input do tbody
corpoTabela.addEventListener('input', evento => {
    // Melhoria: validação de quantidade e atualização centralizada
    if(evento.target.classList.contains('input-quantidade')) {
        const produtos = obterProdutosDoCarrinho();
        const produto = produtos.find(produto => produto.id === evento.target.dataset.id);
        let novaQuantidade = parseInt(evento.target.value);
        if (isNaN(novaQuantidade) || novaQuantidade < 1) novaQuantidade = 1;
        if (produto) {
            produto.quantidade = novaQuantidade;
            salvarProdutosNoCarrinho(produtos);
            atualizarCarrinhoETabela();
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
    // Melhoria: uso de reduce para somar total, mais moderno
    const produtos = obterProdutosDoCarrinho();
    const total = produtos.reduce((acc, produto) => acc + produto.preco * produto.quantidade, 0);
    document.getElementById('total-carrinho').textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
};

// Atualiza o carrinho e a tabela
function atualizarCarrinhoETabela(){
    // Melhoria: centraliza atualização do contador, tabela e total em uma função só
    atualizarContadorCarrinho();
    renderizarTabelaCarrinho();
    atualizarValorTotalCarrinho();
};

atualizarCarrinhoETabela();
