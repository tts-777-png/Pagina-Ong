document.addEventListener('DOMContentLoaded', () => {
    const valueButtons = document.querySelectorAll('.btn-val');
    const customInput = document.getElementById('custom-val');
    const donateButton = document.getElementById('btn-livepix');

    // Correção do preenchimento:
    valueButtons.forEach(button => {
        button.addEventListener('click', () => {
            valueButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            customInput.value = button.getAttribute('data-amount');
        });
    });

    donateButton.addEventListener('click', async () => {
        const valor = customInput.value;
        if (!valor || valor <= 0) return alert("Selecione um valor!");

        donateButton.innerText = "Gerando PIX...";
        donateButton.disabled = true;

        try {
            // Chama a Netlify Function que criamos
            const response = await fetch('/.netlify/functions/criar-pix', {
                method: 'POST',
                body: JSON.stringify({ amount: valor })
            });
            
            const data = await response.json();
            
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl; // Redireciona para o checkout gerado pela API
            }
        } catch (err) {
            alert("Erro ao conectar com a API.");
        } finally {
            donateButton.innerText = "Apoiar via Livepix (PIX)";
            donateButton.disabled = false;
        }
    });
});