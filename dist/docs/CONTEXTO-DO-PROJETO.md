# Trelelê — contexto para retomar o trabalho

Atualizado em 16/10/2026. Repositório indicado pelo usuário: **BM2806/Trelele**, privado, branch principal `main`. É o lugar para manter código, testes, decisões e pesquisa deste projeto. Não incluir credenciais, dependências instaladas, metadados privados de publicação ou dados de pessoas reais.

## Produto e decisões do usuário

Aplicativo de namoro para adultos no Brasil. As pessoas se interessam por livros e opiniões antes de ver a foto. O objetivo é um aplicativo Android/iOS; a implementação atual é uma demonstração HTML/JS da interface para celular, sem binários nativos ou backend. Não apresentar uma landing page como produto final.

Nome escolhido: Trelelê. Margem foi o nome anterior. Houve pesquisa de usos existentes, sem certificação de disponibilidade de marca. A linguagem deve parecer conversa de adultos comuns: opiniões específicas, vozes diferentes, sem aforismos, slogans, gírias acrescentadas artificialmente ou respostas repetidas.

As três primeiras versões foram rejeitadas por aparência e navegação. O usuário pediu pesquisa real de Tinder e, principalmente, Happn: telas, ações, próximos destinos e retorno. A V4 inclui estudo visual, inventários, matriz de transições e implementação dos caminhos, sem alegar acesso ao código interno dos concorrentes.

## Contrato de navegação vigente

- Quatro raízes: Descobrir, Curtidas, Conversas, Perfil.
- Descobrir tem Para você (cartão por pessoa) e Por perto (quadro por cidade fictícia, sem GPS).
- Tocar um livro no cartão muda o livro da mesma pessoa. Swipe ou botão decide sobre a pessoa.
- Perfil de outra pessoa é tela própria, com origem explícita. A opinião de um livro expande na própria tela.
- Voltar restaura segmento, pessoa, livro, rolagem e, quando for conversa, rascunho e posição de leitura.
- Match é confirmação transitória; conversar abre a thread. A aba Conversas leva à caixa.
- Apenas escolhas curtas, filtros, segurança e ferramentas de teste usam painéis.

A especificação detalhada e suas diferenças de implementação estão em FLUXOS-V4.md. Use o código e o relatório de QA para confirmar o estado vigente; documentos antigos não descrevem necessariamente a interface atual.

## Implementação e evidências

`dist/app.mjs`: interface e navegação. `dist/domain.mjs`: regras em memória. `dist/interaction.mjs`: classificador de gesto. `dist/copy.mjs`: perfis fictícios, textos e diálogos finitos. `dist/pesquisa.html`: atlas comparativo. `scripts/build-research.py`: gera o atlas a partir das evidências.

`docs/HAPPN-V4.md` e `docs/TINDER-V4.md` distinguem capturas operacionais, marketing, imagens históricas e lacunas. Os manifestos em `docs/research` registram origem e arquivos inspecionados. `CODIGO-PRIVACIDADE-V4.md` identifica implementações públicas lidas, commits e licenças; nenhum código proprietário foi recuperado. Capturas de concorrentes não são fotografias de membros fictícios.

## Limites que não podem ser escondidos

Todos os perfis, mensagens e retratos são fictícios. A espera experimental de 24 horas e cinco turnos alternados de cada lado permite escolher revelar; os dois aceites ainda são necessários. Revogar, bloquear ou mudar a imagem retira a autorização demonstrada. O navegador não protege fotos reais e o relógio local não é confiável para produção.

Não há autenticação, banco, pagamento, moderação, prova de idade ou mensagens reais. Não coletar dados reais nesta demonstração. Não anunciar o projeto como seguro ou pronto para operação. As metas de monetização ainda são hipóteses.

## Verificação e próximo trabalho

Execute `npm ci`, `npm test` e `npm run check`. Os testes DOM emulados exercitam jornadas e histórico, mas não são navegador, motor de layout ou teste em aparelho. Qualidade visual, teclado móvel, acessibilidade assistiva e gestos nativos ainda precisam de validação real. Não usar quantidade de testes como prova de boa experiência.

Antes de produção: implementar aplicativo instalável, backend autoritativo, mídia privada por autorização, controles de idade/abuso, denúncia com atendimento, retenção/exclusão e cobrança conforme distribuição. Preservar a regra central de conversa e consentimento; não vender atalho para revelar fotos.
