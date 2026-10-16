# Trelelê V5 — jornadas e segurança

Revisão em andamento. Interface V5 refeita sem tomar a estrutura visual V4 como template. Nenhuma conclusão de UX visual será derivada da quantidade de testes.

## Escopo e método

Aplicação local executada em DOM emulado (happy-dom), com o grafo real de módulos ES carregado por `vm.SourceTextModule`. Imports nomeados, aliases e estado executam a semântica do Node, sem substituição de imports por regex. O harness lê a entrada declarada no `index.html`, limita módulos e fetch aos arquivos da distribuição, recusa import externo e não sobe servidor nem abre navegador. Node 22+ com `--experimental-vm-modules` é necessário; o aviso experimental não representa falha.

A revisão usa os critérios relevantes ECC `security-reviewer`: autorização em cada superfície, escape de texto, validade do consentimento e fronteira entre estado de navegação e decisões. Não houve auditoria de dependências remotas nem backend.

## Critérios de jornada

1. Quadro → perfil da mesma pessoa → opinião inline → retorno ao mesmo quadro e posição; reciprocidade → match → conversa correta. Nenhuma dessas transições revela retratos por si só.
2. Toque no card troca livro sem mudar pessoa. Gesto horizontal ou Passar decidem uma única pessoa. Scroll vertical, cancelamento e segundo ponteiro não decidem. A volta do perfil preserva livro, e uma pessoa passada não reaparece via histórico.
3. Inbox → thread → rascunho e leitura → perfil e opinião → retorno à mesma thread. Rascunho e scroll sobrevivem também a inbox/reabertura. Envio limpa apenas após sucesso.

## Critérios de segurança

- Exibição de retratos apenas depois da elegibilidade e dos dois consentimentos atuais; retirada unilateral antes do segundo aceite continua disponível.
- Revogar, atualizar foto, bloquear e encerrar prevalecem sobre histórico e deep links.
- Identificador de rota desconhecido, codificado ou inválido falha sem injetar HTML ou abrir conexão arbitrária.
- Mensagens, nome e bio são texto: não criam atributos/elementos do payload.
- Transição assíncrona concluída tardiamente não pode sobrescrever a rota atual nem restaurar HTML autorizado antes do bloqueio/revogação.

## Resultado

Aguardando conclusão da interface V5 e execução final. Os testes de domínio e classificador existentes permanecem preservados.

## Limites

DOM emulado verifica estado, eventos e navegação; não mede renderização, legibilidade, áreas de toque, conforto de swipe, percepção do quadro ou compreensão sem orientação. Ilustrações da demo são públicas e fictícias. Guardas locais não constituem autorização de produção; esta exige servidor e armazenamento privado. Sem certificação visual, de acessibilidade assistiva ou de uso em aparelho real.
