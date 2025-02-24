async function buscarFilmes(termoPesquisa, pagina) {
    const apiUrl = `http://www.omdbapi.com/?apikey=78c50321&s=${termoPesquisa}&page=${pagina}`;
    try {
        const resposta = await fetch(apiUrl);
        const dados = await resposta.json();
        const containerFilmes = document.getElementById('filmes');
        containerFilmes.innerHTML = '';
        document.getElementById("paginacao").innerHTML = "";

        if (dados.Response === "True") {
            console.log('total resultados', dados.totalResults);
            let totalPaginas = Math.ceil(dados.totalResults / 10);
            console.log('Qtd páginas', totalPaginas);

            // Links de paginação
            for (let x = 1; x <= totalPaginas; x++) {
                let divPaginacao = document.getElementById("paginacao");
                let a = document.createElement("a");
                a.id = "pagina_" + x;
                a.innerHTML = x;
                a.href = "#"; // Para evitar o recarregamento da página
                a.classList.add('page-link');
                
                if (x === pagina) {
                    a.classList.add('active');
                }

                a.addEventListener('click', () => {
                    buscarFilmes(termoPesquisa, x);
                });

                divPaginacao.appendChild(a);
            }

            // Filmes retornados pela API
            dados.Search.forEach(filme => {
                const coluna = document.createElement('div');
                coluna.className = 'col-md-3 filme';

                const card = document.createElement('div');
                card.className = 'card h-100';

                const imagem = document.createElement('img');
                imagem.className = 'card-img-top';
                if (filme.Poster !== "N/A") {
                    imagem.src = filme.Poster;
                } else {
                    imagem.src = 'https://via.placeholder.com/300x450?text=Sem+Imagem';
                }
                imagem.alt = filme.Title;

                const corpoCard = document.createElement('div');
                corpoCard.className = 'card-body text-center';

                const titulo = document.createElement('h5');
                titulo.className = 'card-title';
                titulo.textContent = filme.Title;

                const ano = document.createElement('p');
                ano.className = 'card-text';
                ano.textContent = filme.Year;

                corpoCard.appendChild(titulo);
                corpoCard.appendChild(ano);
                card.appendChild(imagem);
                card.appendChild(corpoCard);
                coluna.appendChild(card);

                // Adiciona ao container de filmes
                containerFilmes.appendChild(coluna);
            });
        } else {
            // Caso não encontre filmes
            const coluna = document.createElement('div');
            coluna.className = 'col-12 text-center';

            const paragrafo = document.createElement('p');
            paragrafo.className = 'text-danger';
            paragrafo.textContent = 'Nenhum filme encontrado.';

            coluna.appendChild(paragrafo);
            containerFilmes.appendChild(coluna);
        }
    } catch (erro) {
        console.error('Erro ao buscar filmes:', erro);
        const containerFilmes = document.getElementById('filmes');
        containerFilmes.innerHTML = '';

        const coluna = document.createElement('div');
        coluna.className = 'col-12 text-center';

        const paragrafo = document.createElement('p');
        paragrafo.className = 'text-danger';
        paragrafo.textContent = 'Algo deu errado. Tente novamente.';

        coluna.appendChild(paragrafo);
        containerFilmes.appendChild(coluna);
    }
}

// Botão de pesquisa
document.getElementById('botao-pesquisar').addEventListener('click', (event) => {
    event.preventDefault(); // Evita o envio do formulário
    const termoPesquisa = document.getElementById('campo-pesquisa').value.trim();
    if (termoPesquisa) {
        buscarFilmes(termoPesquisa, 1); // Inicia a busca com a página 1
    } else {
        alert('Por favor, digite o nome de um filme!');
    }
});
