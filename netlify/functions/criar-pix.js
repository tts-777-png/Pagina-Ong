const axios = require('axios');
const qs = require('querystring');

exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

    try {
        const body = JSON.parse(event.body);
        const valorOriginal = body.amount || body.valor;
        // Garante que o valor seja um número e converte para centavos
        const valorCentavos = Math.round(parseFloat(valorOriginal) * 100);

        // CREDENCIAIS ATUALIZADAS
        const clientId = "399367e7-0075-487a-8d41-f90b28500e03";
        const clientSecret = "UyEROhShtkuDQc0OksWAIsScKYVrCTL9hwi4h7Rtb29Vy+DrJhUoOeZeEl/pF9/4Pzmjj+erzSvFtwXgrMx8WwMfbT6NJuqQsDZNIUteVSjv0G/0N5hI+p5vFXigknN6mJJhzdC7WFLkQsZ4aAiZQbETRUaRrEneWwq7bkgyc+c";

        // 1. Obter Token OAuth2
        const authResponse = await axios.post(
            'https://oauth.livepix.gg/oauth2/token',
            qs.stringify({
                grant_type: 'client_credentials',
                client_id: clientId.trim(),
                client_secret: clientSecret.trim(),
                scope: 'payments:write'
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const token = authResponse.data.access_token;

        // 2. Criar Pagamento
        const response = await axios.post('https://api.livepix.gg/v2/payments', {
            amount: valorCentavos, 
            currency: "BRL",
            redirectUrl: "https://adoteumapegada.netlify.app/obrigado",
            correlationID: `doacao-${Date.now()}`
        }, {
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        // Retorna a URL final de checkout
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ checkoutUrl: response.data.data.redirectUrl })
        };

    } catch (error) {
        console.error("ERRO NA FUNÇÃO:", error.response ? error.response.data : error.message);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ 
                error: "Erro ao processar PIX", 
                details: error.response ? error.response.data : error.message 
            }) 
        };
    }
};