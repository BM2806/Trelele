# Atualização V6 — 16/10/2026

Fonte canônica da nova UI: `mobile-beta/`. Leia seu `AGENTS.md` antes de editar. Regras de execução/teclado/PhoneFrame e arquivos protegidos devem ser preservadas.

Usuário escolheu proposta 3 (serif, ondulado e paleta brasileira), pediu mistura funcional da 1, rejeitou duas revisões claras por serem cruas, pouco jovens e genéricas. Nova direção alvo: `docs/design-v6/target-deck.png`; fundo verde, mídia imersiva, uma superfície amarela ondulada para identidade/opinião/decisão. Nada de grandes X/corações soltos, catálogo de miniaturas, campos cinza ou página branca.

Usuário exige crítico independente ANTES de cada nova geração/alteração visual; após executar, o resultado deve voltar à crítica. Agente atual supercritico_v6 registra contratos e aceites em `docs/SUPERCRITICA-V6.md`. Aprovação de imagem não é validação de runtime.

Última exigência: reciprocidade se chama **Deu liga!**, animação curta sobre o MESMO cartão congelado. Não abrir tela ou sheet; Puxar assunto abre conversa e Continuar olhando/Escape avança uma única vez. Foto continua protegida por prazo, conversa e consentimento dos dois; a animação não a revela.

Livros: usuário quer busca pelo título como no Livrada, preenchendo obra/edição/autor/capa via catálogos. Google Books tem API de volumes; Apple Search API oferece ebooks com condições de uso próprias. Nenhum conector ao vivo foi concluído nesta UI V6: o campo atual filtra catálogo local e isso deve permanecer explícito. Não alegar integração externa já feita.

Validação: runtime protegido28, build e Worker4 passaram; domínio17 idêntico. Root percorreu no cloud browser perfil/voltar/curtida/conversa/envio, arrasto curto/vertical sem decisão e direita com reciprocidade. O modo dev ?qa=360 mede contêiner360×740, não device. Capturas corretas e resultados finais em `mobile-beta/design-qa.md`. A suíte antiga V5 tem5falhas; não alegar npmtestglobalverde.

Storage: BM2806/Trelele privado main anteriorf81acf60c013ab47dd32deb540f4530d3111eb59; agente de armazenamento preparando snapshot semdeploy. Sites histórico permanece inalterado até publicação explicitamente solicitada. Credenciais/.env/.openai/node_modules/builds e arquivos temporários de QA não vão ao GitHub.

---

## Histórico V4 anterior

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
