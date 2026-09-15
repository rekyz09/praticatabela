document.getElementById('btcomprar').addEventListener('click', function () {
    const checkboxes = document.querySelectorAll('.produto-checkbox:checked');

     if (checkboxes.length === 0) {
        alert('Você não selecionou nenhum produto para compra.');
       return;
    }
 
    let conteudo = 'Lista de compras\n';
    conteudo += '-----------------\n';
    checkboxes.forEach(function (checkbox) {
        conteudo += checkbox.dataset.produto + '\n';
                const linha = checkbox.closest('tr');
                const celulaEstoque = linha.querySelector('td:nth-child(5)');
                let estoqueAtual = parseInt(celulaEstoque.textContent, 10);
 
                if (estoqueAtual > 0) {
                    estoqueAtual -= 1;
                    celulaEstoque.textContent = estoqueAtual;
                }
 
                if (estoqueAtual === 0) {
                    checkbox.disabled = true;
                }
 
                checkbox.checked = false;
    });
 
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
 
    const link = document.createElement('a');
    link.href = url;
    link.download = 'compra.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
});
