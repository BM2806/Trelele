# Trelelê — contrato de interface V4

Produto pretendido: aplicativo Android/iOS de namoro por livros para adultos. Implementação atual: protótipo mobile estático, sem backend ou binários instaláveis. V4 substitui o perfil em painel da V3; detalhes de comportamento e limites estão em FLUXOS-V4.md.

## Hierarquia antes de aparência

Quatro raízes: Descobrir, Curtidas, Conversas e Perfil. Descobrir alterna Para você (uma pessoa por cartão) e Por perto (quadro de duas colunas). O quadro usa a cidade fictícia selecionada, não GPS nem supostos cruzamentos. Cada tile abre a pessoa; não registra interesse por tocar uma capa.

Pessoa é tela própria com origem explícita e ações adequadas ao contexto. Opiniões de livros expandem inline. Voltar restaura segmento, livro, quadro ou conversa de origem. Curtir sem reciprocidade confirma o envio no perfil; passar retorna à descoberta atualizada. Match oferece conversar ou continuar. Thread tem cabeçalho próprio; rascunho e leitura são preservados ao ver o perfil.

Filtros, escolhas curtas e segurança usam painéis. Editar o próprio perfil é detalhe da raiz Perfil. Ferramentas de teste e pesquisa ficam fora das quatro tarefas principais.

## Evidência externa

HAPPN-V4.md e TINDER-V4.md registram 37 imagens examinadas, inventários e transições documentadas. O quadro de duas colunas foi observado em publicação histórica atribuída ao Happn Design, não confirmado como home universal atual. Há documentação oficial atual do mapa por agrupamentos. As capturas funcionais independentes do Tinder têm versão/data não informadas; marketing e imagens históricas são identificados como tais. Nenhum código proprietário foi recuperado.

A página pesquisa.html exibe sete evidências selecionadas, fontes, limites e três jornadas. CODIGO-PRIVACIDADE-V4.md identifica código público realmente lido e licenças; isso não prova a implementação interna dos concorrentes.

## Sistema visual e voz

Preserva Plus Jakarta Sans oficial local e Phosphor MIT, superfícies claras, cobalto e texto escuro. A mudança V4 é de hierarquia e transições, não apenas cor. Layout mantém formato de aparelho, safe areas e ações acessíveis. Capas conceituais originais representam livros; capturas concorrentes permanecem na pesquisa, nunca como perfis fictícios.

VOZ-V3.md e copy.mjs seguem vigentes: texto direto, opiniões específicas e roteiros diferentes por pessoa, sem slogans ou resposta genérica repetida. A interface distingue simulação de ação real.

## Foto, alcance e validação

O desbloqueio depende de conversa, prazo experimental e aceites dos dois. Não existe atalho pago. Retratos fictícios só aparecem na thread autorizada; a descoberta continua com capas. Bloqueio, encerramento, revogação ou mudança de versão retiram a autorização demonstrada.

QA-V4.md valida as jornadas e estados em DOM emulado. Isso não é aprovação visual, de usabilidade, gesto nativo ou segurança de produção. O próximo gate de experiência é observar pessoas usando o aplicativo em aparelhos reais. Não usar quantidade de testes para afirmar que a navegação é boa.
