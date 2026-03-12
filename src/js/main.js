document.addEventListener('DOMContentLoaded', () => {
    const valueButtons = document.querySelectorAll('.btn-val');
    const customInput = document.getElementById('custom-val');
    const donateButton = document.getElementById('btn-livepix');

    // Lógica para preencher o valor ao clicar nos botões de R$
    valueButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Evita qualquer comportamento estranho
            
            // Remove destaque de todos os botões
            valueButtons.forEach(b => b.classList.remove('active'));
            
            // Adiciona destaque ao clicado
            button.classList.add('active');
            
            // Captura o valor do atributo data-amount
            const valor = button.getAttribute('data-amount');
            customInput.value = valor;
            
            console.log("Botão clicado, valor setado:", valor);
        });
    });

    // Enviar para a API
    donateButton.addEventListener('click', async () => {
        const amountValue = customInput.value;

        if (!amountValue || amountValue <= 0) {
            alert("Por favor, selecione ou digite um valor válido.");
            return;
        }

        donateButton.innerText = "Processando PIX...";
        donateButton.disabled = true;

        try {
            const response = await fetch('/.netlify/functions/criar-pix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amountValue })
            });

            const data = await response.json();

            if (data.checkoutUrl) {
                // Redireciona para a página de pagamento gerada
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error(data.details || "Erro desconhecido");
            }

        } catch (err) {
            console.error("Erro no checkout:", err);
            alert("Ocorreu um erro ao gerar o PIX. Tente novamente em instantes.");
        } finally {
            donateButton.innerText = "Apoiar via Livepix (PIX)";
            donateButton.disabled = false;
        }
    });
});