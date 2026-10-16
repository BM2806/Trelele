# Margem V2 — aceites de interação e prevenção de regressões

Data: 16/10/2026. Referência: ECC `tdd-guide` e `pr-test-analyzer`. A V2 muda de demonstração editorial para aplicativo de descoberta com cartões, gestos e navegação compacta, tomando cinco capturas enviadas pelo usuário como referência de dinâmica. Não há alegação de cópia do código do Tinder, proteção real de fotos ou QA visual.

## Escopo verificável

A revisão atual define aceites antes da implementação. Depois da entrega, executar testes Node e validação sintática, inspecionar código e integridade de arquivos. Testes de domínio ou do classificador puro de gestos não substituem E2E no navegador. Sem navegador autorizado nesta etapa, toque real, scroll, animação, foco, contraste visual e composição nos tamanhos móveis permanecem pendentes.

## Aceites P0 da nova experiência

| ID | Ação | Aceite |
|---|---|---|
| V2-01 | Arrastar cartão horizontalmente além do limiar | Esquerda dispensa e direita manifesta interesse; só uma decisão por gesto, sem efeito adicional no clique sintético seguinte |
| V2-02 | Soltar, perder captura ou cancelar gesto | `pointerup` encerra uma vez; `pointercancel` e perda de captura não aprovam perfil; não deixa cartão travado |
| V2-03 | Tocar sem deslocamento significativo | Não curte nem dispensa; pode abrir detalhe conforme área tocada; botão clicado executa sua própria ação uma vez |
| V2-04 | Arrastar verticalmente, em diagonal predominantemente vertical ou rolar | Não decide interesse; `touch-action` e captura não bloqueiam a rolagem útil |
| V2-05 | Gesto curto ou abaixo do limiar | Cartão retorna ao estado neutro; nenhuma decisão e nenhum avanço |
| V2-06 | Segundo dedo, arrasto fora do cartão, gesto sobre botão/input/link | Só ponteiro ativo é considerado; controles internos não iniciam swipe; mouse usa botão principal |
| V2-07 | Clique rápido repetido em curtir/dispensar, gesto seguido de clique | Cada perfil recebe no máximo uma decisão por interação; próxima pessoa não é decidida acidentalmente |
| V2-08 | Desfazer dispensa | Reapresenta exatamente o último perfil dispensado elegível; não revive bloqueados nem remove denúncia |
| V2-09 | Desfazer curtida que criou match | Não apaga match, mensagem ou consentimento de maneira silenciosa. Impede ação ou pede confirmação com consequência clara; encerrar usa contrato de unmatch |
| V2-10 | Abrir caixa de conversas | Apresenta novas conexões sem mensagens e lista de conversas, incluindo nome e prévia textual; tocar abre a pessoa correta |
| V2-11 | Receber reciprocidade simulada e alternar telas | Match único aparece em conexões; histórico mantém mensagens e seleção; personagem e simulação identificados |
| V2-12 | Abrir edição, alterar e pré-visualizar perfil | Prévia mostra os dados atuais sem perder rascunho ao trocar aba; salvar e cancelar têm efeitos distintos e compreensíveis |
| V2-13 | Atualizar seleção de livros | Afinidade exibida em cartões, lista e modal deriva da seleção atual; não mantém frase falsa sobre obras removidas |
| V2-14 | Consentimento unilateral | Nenhum rosto é exibido nos cartões, detalhe, avatar, inbox, nova conexão ou chat. Foto só aparece quando domínio autoriza os dois lados |
| V2-15 | Trocar retrato, revogar, bloquear ou encerrar após revelar | Todos os pontos de renderização retiram retrato futuro; consentimento de versão antiga não libera novo retrato |
| V2-16 | Bloquear/encerrar e denunciar depois | Pessoa sai da descoberta e chat ativo; rota para denúncia permanece sem reabrir conversa |
| V2-17 | Inserir texto com HTML, aspas, Unicode ou emojis | Conteúdo é exibido como texto; não vira elemento, atributo ou script; limites de tamanho aplicados |
| V2-18 | Estado vazio, filtro sem candidatos, fim da fila | Mensagem contextual e ação útil; não pula perfil elegível pela combinação remoção+índice |
| V2-19 | Navegar por teclado e link “pular para conteúdo” | Todo botão tem nome acessível; gestos possuem alternativas clicáveis; âncora não muda rota; foco recuperável |
| V2-20 | Abrir plano pago ou ação experimental | Sem cobrança, coleta de cartão ou promessa de benefício não implementado; revelação não pode ser comprada sem consentimento |

## Riscos conhecidos da versão anterior

- A fila removia o perfil e avançava um índice: corrigido para primeiro candidato; não reintroduzir na pilha de cartões.
- Afinidades eram frases estáticas: corrigidas por interseção de livros; toda nova superfície precisa usar o mesmo cálculo.
- `hashchange` desviava a âncora `#main`: preservar a exceção de acessibilidade e revisar rotas novas.
- Rerender completo durante edição podia apagar texto não salvo. V2 deve manter rascunho ou avisar antes de descartá-lo.
- Denúncia é somente registro local, sem equipe ou envio real. Novas telas não devem transformar a simulação em falsa confirmação de atendimento.
- Os desenhos revelados são fictícios; quaisquer novos avatares devem evitar rosto real desbloqueado antecipadamente.
- Contagem de turnos e tempo são critérios técnicos experimentais, sem capacidade de avaliar intimidade ou conversa significativa.

## Revisão automatizada apropriada

1. `npm test`: separar resultado do domínio, classificador de gesto e integridade estática no relatório.
2. `npm run check`: incluir todos os módulos novos. Validação sintática não é teste de comportamento da interface.
3. Classificador puro: limiar exato e vizinhança, zero, negativos, NaN/infinito, diagonais, botão e ponteiro quando no contrato; saída determinística sem mutação externa.
4. Revisão da ligação DOM: conferir que decisão usa perfil capturado no início, protege commit duplicado e suprime clique após swipe; classificador isolado não comprova esses itens.
5. Integridade: imports, CSS, assets locais e arquivos de download realmente existem; nenhuma referência absoluta a scratch; documentos descrevem V2 sem manter validação editorial como se atual.
6. Regra de fotos: procurar todas as chamadas de renderização de avatar/retrato e verificar caminho pelo domínio. A presença de uma função de autorização não comprova uso em todas as telas.

## Critério de entrega

Aceitável como demonstração após validação sintática, testes pertinentes passando, bloqueios P0 corrigidos por inspeção e documentação das lacunas. Não chamar a demo de software seguro para produção. Antes de usuários reais, executar os gates de API, autenticação, mídia privada, concorrência, moderação e pagamentos do `PLANO-QA.md`.

## Resultado da implementação V2

O plano foi executado após estabilização do frontend; os resultados finais e as limitações estão registrados abaixo.

### Revisão intermediária com DOM emulado

Adicionados `tests/ui-harness.mjs` e `tests/ui.test.mjs`, usando somente a dependência de desenvolvimento happy-dom instalada pela coordenação. O harness lê o HTML e o código real de `app.mjs`, fornece os exports reais de domínio/classificador e executa listeners de clique, formulário e ponteiro em uma `Window` independente por caso. Fetch restringe-se a fixtures locais; não há servidor, navegador, screenshot ou medição real de layout.

Execução inicial intermediária: 13 casos DOM passaram; um caso adicional falhou e encontrou uma regressão real: `lostpointercapture` não encerrava o arrasto, permitindo commit em `pointerup` posterior. Achado encaminhado para correção com teste de regressão já escrito. O frontend segue em edição; os resultados finais serão registrados após aviso de término e nova execução. Asserções da inbox foram alinhadas ao contrato final: novas conexões sem mensagens em uma seção; conversas iniciadas na lista, sem duplicação.

### Resultado final da revisão V2

Após aviso de conclusão dos três arquivos frontend, nova execução efetiva em 16/10/2026:

| Grupo | Casos | Resultado |
|---|---:|---|
| Domínio puro | 17 | Todos passaram |
| Classificador puro de gestos | 7 | Todos passaram |
| Aplicação real em DOM emulado | 19 | Todos passaram |
| Total de `npm test` | 43 | Zero falhas, ignorados ou cancelados |
| `npm run check` | 3 módulos | Sintaxe válida; saída 0 |

O caso de perda de captura falhou antes da correção e passou após a adição do cancelamento de `lostpointercapture` pelo autor do frontend. As demais regressões verificadas por eventos DOM incluem: tap troca livro sem decidir pessoa; gesto horizontal decide uma vez; scroll vertical/arrasto curto/cancelamento não decidem; ponteiro secundário não substitui o ativo; gesto sobre controle não vira swipe; desfazer não remove match gerado; inbox não duplica novas conexões na lista de conversas; mensagem permanece texto escapado; rascunho de chat sobrevive navegação e limpa ao envio; filtros inválidos mantêm erro; edição salva e cancelamento preservam valores anteriores; seleção de relacionamento só aplica ao concluir; seleção de livros recalcula contagem; consentimento unilateral não revela; dois aceites revelam; revogação, nova versão e bloqueio retiram o retrato; denúncia segue disponível após encerramento/bloqueio.

**Limite do resultado:** happy-dom emula APIs e eventos. A geometria do cartão é fornecida pelo teste (390 px) porque não existe motor de layout. Isso não verifica captura nativa de ponteiro, clique gerado pelo navegador, inércia de scroll, desenho de animação, leitura por tecnologia assistiva, cores, screenshots ou qualidade visual. Nenhum navegador ou servidor foi iniciado. Os 43 testes não são 43 testes E2E; 19 são testes DOM e 24 são unidades de lógica.

**Parecer técnico:** demonstração aprovada no escopo dos testes acima. Validação visual e teste de gestos em dispositivo real continuam pendentes. A aprovação não autoriza coleta de contas, fotografias ou pagamentos reais.
