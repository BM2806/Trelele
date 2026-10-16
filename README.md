# Trelelê — protótipo de aplicativo para celular

Nome escolhido para o protótipo; disponibilidade de marca ainda não validada. Encontros 18+ por afinidade literária; conversa antes do retrato, com consentimento bilateral. Este projeto contém uma demonstração estática da interface de aplicativo celular, regras de domínio testáveis, referências externas e documentação de arquitetura, segurança, produto e receita.

## Repositório do projeto
Código, testes, documentação e evidências ficam em https://github.com/BM2806/Trelele (privado). Este repositório foi indicado pelo usuário como armazenamento do projeto. O ambiente de publicação do protótipo é separado; não há sincronização contínua em segundo plano. Leia docs/CONTEXTO-DO-PROJETO.md antes de retomar o desenvolvimento.

## Produto e entrega
O produto pretendido é um aplicativo Android/iOS. O link é um protótipo da interface para celular, não um aplicativo instalável. No desktop ele conserva o formato de aparelho. Não há implementação nativa ou publicação nas lojas.

## O que pode testar
Descobrir pessoas fictícias, filtrar por cidade/idade/gênero literário, curtir e simular reciprocidade, trocar mensagens locais, simular 24h e cinco turnos de cada pessoa, dar aceites separados, retirar consentimento, simular troca de retrato, bloquear/encerrar e registrar denúncia fictícia após encerramento. Descobrir tem Para você (cartões) e Por perto (quadro de pessoas na cidade fictícia). Perfis abrem em tela própria e guardam a origem; as opiniões expandem dentro do perfil. Perfil próprio tem apresentação e edição separadas. Pesquisa e referências ficam no menu de demonstração. A interface usa Plus Jakarta Sans e Phosphor oficiais locais; fontes em docs/REFERENCIAS-V3.md.

O cenário começa com uma conversa fictícia com Lia. Ana tem interesse simulado prévio. Os demais perfis permitem testar curtidas sem reciprocidade. Não há pessoas reais conectadas.

## Rodar
Use Node 22+ e instale as dependências de desenvolvimento para os testes:

```sh
npm ci
npm test
npm run check
```

Sirva dist com um servidor HTTP estático de sua preferência (módulos ES não funcionam por file://). Exemplo local:

```sh
python3 -m http.server 8080 --directory dist
```

Abra http://localhost:8080. A rota #studio reúne documentos e referências. Não precisa instalar pacotes npm para executar a demo.

## Limite explícito
Não há autenticação, backend, banco, pagamento, moderação real, garantia de idade ou proteção de mídia. Estado e relógio estão no browser e são alteráveis. Nenhuma mensagem é enviada; recarregar apaga o cenário. Não use esta demo para dados, imagens ou casos reais.

A suíte verifica domínio, gestos, eventos DOM emulados, textos e integridade de ativos; não comprova controle de acesso de servidor, transações concorrentes, segurança em rede ou conformidade legal. A revisão de layout por navegador não estava disponível neste ambiente de entrega; não há declaração de conformidade WCAG ou QA visual concluído.

## Entrega e próximos gates
Veja docs/FLUXOS-V4.md, QA-V4.md, CODIGO-PRIVACIDADE-V4.md e ARQUITETURA.md. Antes de abrir contas reais: identity gerenciado; políticas e processo 18+; Postgres com transações/unicidade; mídia privada e autorização a cada acesso; denúncia/atendimento humano; exclusão/backup; testes integrados, de rede e de acesso indevido; avaliação jurídica; teste de usabilidade e dispositivos.

## Ativos e direitos
dist/assets/v3/PROVENANCE.json registra origem e hashes da fonte Plus Jakarta Sans e dos ícones Phosphor; as licenças OFL/MIT acompanham os arquivos. dist/assets/asset-manifest.json documenta as capas e o acervo anterior, que inclui fotografias ambientais e Instrument Sans. Capas conceituais e retratos SVG originais para personagens fictícios, sem reproduzir capas de editoras ou apresentar fotografias de terceiros como usuários. Os links de referências não concedem licença para copiar marcas, imagens, textos ou telas.

## Receita
R$29,90/mês é somente uma hipótese. Nenhuma cobrança ativa. Conversar, consentir/revelar e usar segurança ficam no core gratuito proposto. Leia PRODUTO-RECEITA.md para a sensibilidade econômica e condições de validação.

## Pesquisa visual V4
Abra dist/pesquisa.html através do servidor estático. A página reúne sete evidências com origem e limitações e um explorador das três jornadas principais. Os inventários completos estão em docs/HAPPN-V4.md e docs/TINDER-V4.md. docs/research contém as capturas originais e manifestos. Para regenerar o atlas: `python3 scripts/build-research.py`. Marcas e capturas de terceiros são referências de pesquisa, não ativos licenciados para os perfis do produto.
