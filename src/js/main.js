const livepixUser = "adoteumapegada"; // Use apenas seu nick do Livepix aqui

document.addEventListener('DOMContentLoaded', () => {
    // ... (mesma lógica de seleção de botões de antes)
    
    document.getElementById('btn-livepix').addEventListener('click', () => {
        const valor = document.getElementById('custom-val').value;
        if (valor > 0) {
            // O Livepix redireciona com o valor direto na URL
            window.open(`https://livepix.gg/${livepixUser}/donation?amount=${valor}`, '_blank');
        } else {
            alert("Por favor, selecione um valor.");
        }
    });
});