# NATAL ENCANTADO

Loja responsiva da NATAL ENCANTADO para apresentar a Árvore de Natal Especial por **R$ 69,99**, com pisca-pisca grátis e frete grátis conforme a oferta informada.

## Executar localmente

Abra `index.html` no navegador ou sirva a pasta com um servidor estático, por exemplo:

```bash
python3 -m http.server 8000
```

Acesse `http://localhost:8000`.

## Configuração do atendimento

No início de `app.js`, preencha `WHATSAPP_NUMBER` com o número oficial no formato internacional, somente dígitos (código do país + DDD + número). O botão informa que não está configurado enquanto o valor estiver vazio.

## Checkout e pagamento

O carrinho e seu resumo usam `localStorage` no próprio navegador. O formulário valida os campos e demonstra o resumo, mas **não envia dados a um servidor, não cria pedido e não confirma pagamento**. A mensagem exibida é: “Pagamento via PIX em configuração. Entre em contato com nosso atendimento para mais informações.”

## Integração Cakto pendente

A interface ainda não está integrada à API Pix. A Cakto documenta `POST https://api.cakto.com.br/public_api/payments/`, autenticação Bearer, `X-Idempotency-Key`, uma oferta ativa (`offerId`) e dados do cliente. A conta precisa ter Cakto Banking ativa, principal e com abertura concluída. A resposta fornece `pix.qrCode` (copia e cola) e expiração; a aplicação deve gerar a imagem do QR Code a partir desse código. A confirmação deve vir do webhook `purchase_approved`, com validação da origem e processamento idempotente.

Antes de implementar a cobrança real, configure no backend o token de acesso e o ID da oferta ativa, confirme o valor configurado na oferta e implemente webhook com validação conforme a documentação. Nunca exponha credenciais no navegador. O link de checkout hospedado informado pelo proprietário não substitui a API.

Documentação oficial: https://www.cakto.com.br/api-pix e https://docs.cakto.com.br/

Não gere PIX fictício nem marque o pedido como pago pelo frontend.

## Conteúdo e imagens

Imagens ilustrativas carregadas do Unsplash e fontes carregadas do Google Fonts; exigem conexão com a internet. Informações de entrega, prazos, avaliações e selos não são inventadas: confirme os dados comerciais com a loja antes de publicá-los.
