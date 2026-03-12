const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { amount } = JSON.parse(event.body);

  // Seus dados da API
  const clientId = "399367e7-0075-487a-8d41-f90b28500e03";
  const clientSecret = "GRdp2cY2e6FjEObf6YpVXWZX35J+lVvu5ir1lQq6c12fR1XNIeXKSJFmdRFLui1SwPDU8RMI3ibJMeFrskNAF1CWNbAoWVPLUlx2uxEMQq8fOmFTZLByAdlfM5Mymu0AFl64MJDQIzhhtBOK1vRvwfqusDdgRyLjL5vZe1HVLbY.";

  try {
    // 1. Chama a API do Livepix para gerar o checkout dinâmico
    // Nota: A URL exata depende da versão da API do Livepix (v1/payments)
    const response = await axios.post('https://api.livepix.gg/v1/payments', {
      amount: parseFloat(amount),
      description: "Doação ONG Adote uma Pegada"
    }, {
      headers: {
        'Authorization': `Bearer ${clientSecret}`, // Ou Client-ID dependendo da doc deles
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ checkoutUrl: response.data.checkoutUrl })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};