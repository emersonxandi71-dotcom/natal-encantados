# NATAL ENCANTADO

Loja estática responsiva para apresentar a Árvore de Natal Especial por **R$ 69,99**, com pisca-pisca grátis por unidade.

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

Para lançar pagamentos, implemente backend seguro e integração oficial com Mercado Pago ou Asaas. Crie e valide pedidos e valores no servidor, nunca confie em valores enviados pelo navegador, valide a assinatura/autenticidade do webhook do gateway e só então atualize o status do pagamento. Não gere PIX fictício nem marque o pedido como pago pelo frontend.

## Conteúdo e imagens

Imagens ilustrativas carregadas do Unsplash e fontes carregadas do Google Fonts; exigem conexão com a internet. Informações de entrega, prazos, avaliações e selos não são inventadas: confirme os dados comerciais com a loja antes de publicá-los.
