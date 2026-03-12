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
        // Aceita tanto 'valor' quanto 'amount' vindo do front-end
        const valorOriginal = body.amount || body.valor;
        const valorCentavos = Math.round(valorOriginal * 100);

        // SUAS NOVAS CREDENCIAIS
        const clientId = "399367e7-0075-487a-8d41-f90b28500e03";
        const clientSecret = "GRdp2cY2e6FjEObf6YpVXWZX35J+lVvu5ir1lQq6c12fR1XNIeXKSJFmdRFLui1SwPDU8RMI3ibJMeFrskNAF1CWNbAoWVPLUlx2uxEMQq8fOmFTZLByAdlfM5Mymu0AFl64MJDQIzhhtBOK1vRvwfqusDdgRyLjL5vZe1HVLbY.";

        // 1. Obter Token OAuth2
        const authResponse = await axios.post(
            'https://oauth.livepix.gg/oauth2/token',
            qs.stringify({
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
                scope: 'payments:write'
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const token = authResponse.data.access_token;

        // 2. Criar Pagamento dinâmico
        const response = await axios.post('https://api.livepix.gg/v2/payments', {
            amount: valorCentavos, 
            currency: "BRL",
            // URL do seu novo site da ONG
            redirectUrl: "https://adoteumapegada.netlify.app/", 
            correlationID: `ong-${Date.now()}`
        }, {
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        // Retorna a URL que a API do Livepix gerou
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ checkoutUrl: response.data.data.redirectUrl })
        };

    } catch (error) {
        console.error("Erro completo:", error.response ? error.response.data : error.message);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: "Erro na API", details: error.message }) 
        };
    }
};