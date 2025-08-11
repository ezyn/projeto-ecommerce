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
        atualizarContadorCarrinho();
    });
});

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
}

// Atualiza o contador do carrinho
function atualizarContadorCarrinho() {
    const carrinho = obterProdutosDoCarrinho();
    let total = 0;

    for (const item of carrinho) {
        total += item.quantidade;
    }

    document.getElementById('contador-carrinho').textContent = total;
}

atualizarContadorCarrinho();