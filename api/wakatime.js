export default async function handler(request, response) {
  // A chave é definida como variável de ambiente no painel do Vercel
  const apiKey = process.env.waka_2ad97326-672f-4d9a-ab89-71a78894085a;
  const userId = '24411d3f-4788-4d77-b413-800dff61f4fc'; // Seu ID do WakaTime

  if (!apiKey) {
    return response.status(500).json({ error: 'API key não configurada.' });
  }

  try {
    const apiResponse = await fetch(
      `https://api.wakatime.com/api/v1/users/${userId}/stats/last_7_days`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(apiKey).toString('base64')}`
        }
      }
    );

    if (!apiResponse.ok) {
      throw new Error(`Erro WakaTime: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    // Define cache de 5 minutos para reduzir chamadas à API
    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    response.status(200).json(data);

  } catch (error) {
    console.error('Erro no endpoint /api/wakatime:', error);
    response.status(500).json({ error: 'Falha ao buscar dados do WakaTime' });
  }
}
