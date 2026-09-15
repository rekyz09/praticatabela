const LIMITE_ESTOQUE_BAIXO = 3;

document.addEventListener('DOMContentLoaded', function () {
    const botaoComprar = document.getElementById('btcomprar');
    const mensagem = document.getElementById('mensagem');

    // Aplica o selo de "estoque baixo" já na carga da página, caso algum
    // produto comece com poucas unidades.
    document.querySelectorAll('tbody tr[data-estoque]').forEach(atualizarSeloEstoque);

    if (!botaoComprar) return;

    botaoComprar.addEventListener('click', function () {
        const checkboxes = document.querySelectorAll('.produto-checkbox:checked');

        if (checkboxes.length === 0) {
            mostrarMensagem('Você não selecionou nenhum produto para compra.', true);
            return;
        }

        let conteudo = 'Lista de compras\n';
        conteudo += '-----------------\n';

        checkboxes.forEach(function (checkbox) {
            const linha = checkbox.closest('tr');
            const celulaValor = linha.querySelector('.estoque-valor');

            let estoqueAtual = parseInt(linha.dataset.estoque, 10) || 0;

            if (estoqueAtual <= 0) {
                checkbox.checked = false;
                checkbox.disabled = true;
                return;
            }

            conteudo += checkbox.dataset.produto + '\n';

            estoqueAtual -= 1;
            linha.dataset.estoque = estoqueAtual;
            celulaValor.textContent = estoqueAtual;

            atualizarSeloEstoque(linha);

            if (estoqueAtual === 0) {
                checkbox.disabled = true;
            }

            checkbox.checked = false;
        });

        baixarArquivo(conteudo);
        mostrarMensagem('Compra realizada! O arquivo compra.txt foi baixado.', false);
    });

    function atualizarSeloEstoque(linha) {
        const estoque = parseInt(linha.dataset.estoque, 10) || 0;

        linha.classList.remove('estoque-baixo', 'sem-estoque');

        if (estoque === 0) {
            linha.classList.add('sem-estoque');
        } else if (estoque <= LIMITE_ESTOQUE_BAIXO) {
            linha.classList.add('estoque-baixo');
        }
    }

    function mostrarMensagem(texto, isErro) {
        if (isErro) {
            alert(texto);
        }
        if (mensagem) {
            mensagem.textContent = texto;
        }
    }

    function baixarArquivo(conteudo) {
        const blob = new Blob([conteudo], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'compra.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
});
