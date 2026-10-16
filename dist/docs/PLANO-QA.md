# Trelelê — plano de qualidade e critérios de lançamento

Data: 16/10/2026. Escopo imediato: demonstração estática, módulo de domínio puro e testes `node:test`. Referência de trabalho: ECC `tdd-guide` e `pr-test-analyzer`, aplicados à cobertura comportamental e ao risco real. Números de limiar e elegibilidade são hipóteses de produto até decisão explícita e teste com usuários.

## Limite da evidência

Uma demo demonstra navegação e transições locais. Não comprova autenticação, privacidade de mídia, integridade de banco, concorrência, entrega de mensagens, pagamento, verificação de idade ou operação de moderação. Dados fictícios e ações simuladas devem estar identificados. Nenhum relatório local deve alegar que uma denúncia foi entregue a uma equipe real.

Testes de domínio verificam decisões determinísticas. Em produção, o servidor deverá tomar essas decisões com identidade autenticada e transações; ocultar botões ou desfocar imagens no navegador não controla acesso.

## Invariantes P0

| ID | Cenário e preparação | Resultado obrigatório | Evidência imediata / produção |
|---|---|---|---|
| MATCH-01 | A curte B; B ainda não curtiu A | Nenhum match e nenhum chat liberado | Teste unitário / API e E2E |
| MATCH-02 | A e B manifestam interesse recíproco | Exatamente um match para o par, independentemente da ordem | Teste unitário / transação e restrição única no banco |
| MATCH-03 | Repetir curtida, evento ou requisição | Não duplica match, conversa ou notificação | Teste unitário / integração com idempotência |
| MATCH-04 | A tenta curtir a si, um usuário inexistente, bloqueado ou inelegível | Rejeita sem alterar estado válido | Teste unitário / API autenticada |
| MATCH-05 | Interesses simultâneos em duas sessões | Um par canônico; resultado consistente após leitura | Modelo sequencial local / teste concorrente real obrigatório |
| PHOTO-01 | Apenas uma parte consente | Nenhuma das duas fotos é revelada | Teste unitário / API de mídia |
| PHOTO-02 | Ambos consentem mas conversa não cumpre critérios | Sem revelação | Teste unitário / servidor |
| PHOTO-03 | Elegibilidade e dois consentimentos na versão atual | Revelação bilateral; acesso apenas aos participantes | Teste unitário / integração com armazenamento privado |
| PHOTO-04 | Uma foto é substituída, termos de revelação mudam ou nasce nova conversa | Consentimento da versão anterior não autoriza o novo material/contexto | Teste unitário / integração com versões de mídia e conversa |
| PHOTO-05 | Revogação antes da segunda autorização | Revelação não ocorre | Teste unitário / teste de corrida no servidor |
| PHOTO-06 | Revogação, bloqueio ou unmatch após revelação | Impede acessos futuros; informa que cópias já vistas não podem ser recuperadas | Teste unitário / URL assinada curta e revogação definida |
| PHOTO-07 | Conta C consulta foto ou consentimento do par A/B | Acesso negado; não retorna URL, miniatura ou metadado privado | Fora da demo / teste negativo de autorização por objeto |
| BLOCK-01 | A bloqueia B antes ou depois do match | Impede descoberta, chat e acesso futuro a fotos nos dois sentidos | Teste unitário / API, fila e cache |
| BLOCK-02 | Evento atrasado tenta enviar mensagem/revelar depois do bloqueio | Bloqueio prevalece; evento não reabre a relação | Teste unitário / fila e integração |
| UNMATCH-01 | Encerramento repetido ou evento atrasado | Estado encerrado estável; consentimentos não reativados | Teste unitário / integração |
| REPORT-01 | A encerra o match ou bloqueia B e depois denuncia | Existe rota de denúncia pelo histórico recente; não exige reabrir o chat | UI local e teste unitário / fluxo E2E e moderação |
| REPORT-02 | Denúncia duplicada, categoria ausente ou falha de rede | Validação clara; reenvio seguro; protocolo somente após persistência | Simulação identificada / API e operação real |
| INPUT-01 | IDs inválidos, papel de terceiro, conteúdo vazio, Unicode, tamanho excessivo | Rejeita entradas inválidas e mantém o estado; conteúdo é exibido como texto | Unidade e UI / contratos e segurança |

### Decisões que devem virar contratos antes do beta

- A versão do consentimento deve ligar participante, par/conversa, finalidade e versão da mídia. Trocar foto não herda consentimento sobre outra imagem.
- A política de revogação deve ser visível, com semântica clara para novas requisições e o limite de imagens já visualizadas.
- Turnos alternados, tempo mínimo e quantidade de mensagens devem ser configuráveis. Mensagens vazias, repetidas ou de uma única parte não devem fabricar elegibilidade.
- Recriar match não reutiliza autorização anterior. Reentrada após bloqueio precisa de política explícita; a demo pode manter o bloqueio definitivo.
- Histórico para denúncia deve ter janela e retenção restritas; preservar evidência de moderação não equivale a devolver o chat ao participante.

## UX e estados de erro

Verificar em 360 px, 390 px e desktop, zoom de 200%, teclado e leitor de tela:

1. Primeira visita explica livros, match e foto com linguagem curta. Controles têm rótulos, foco visível e área de toque suficiente.
2. Descoberta vazia distingue filtros restritos, fim de sugestões e falha de carregamento. Alterar filtros não promete candidatos inexistentes.
3. Curtida possui confirmação e estado pendente; clique duplo não pula perfis nem gera dois matches. Pular, voltar e desfazer seguem regra explícita.
4. Chat mostra envio pendente/falho, permite tentar novamente e não duplica mensagens. Texto longo, emojis e palavras sem espaço não quebram a tela.
5. Revelação explica a condição de consentimento e não expõe quem recusou. Não usar contador que pressione a pessoa a continuar conversando.
6. Bloquear/encerrar oferece consequência clara e confirmação proporcional; denunciar permanece acessível. Mensagem de sucesso corresponde ao que ocorreu.
7. Atualizar a página e usar voltar/avançar mantém navegação previsível. Reset da demo restaura o estado fictício de forma explícita.
8. Movimento respeita `prefers-reduced-motion`; cor não é o único indicador de seleção. Botões sem funcionalidade real indicam simulação ou indisponibilidade.
9. Cadastro e perfil contemplam leitores ocasionais, quadrinhos e audiolivros, sem pontuação de erudição. Afinidade informa os fatores visíveis e não inventa percentual romântico.
10. Falha de imagem mostra alternativa útil e não revela rosto por imagem de fallback. Foto bloqueada não aparece em preload, HTML, CSS, rede ou armazenamento público em produção.

## Estratégia de verificação

### Agora: demo e domínio

- Executar `node --test` no projeto; registrar comando, contagem real e saída.
- Testar transições e tentativas inválidas, com estados independentes por teste, relógio controlável e asserções específicas.
- Para cada correção crítica, reproduzir o defeito com um teste que falha antes da alteração e passa depois quando viável.
- Inspecionar os arquivos entregues; procurar ações silenciosas, dados pessoais, URLs de fotos reveladas indevidamente e chamadas externas não declaradas.
- Fazer teste manual de ponta a ponta na demo: descobrir → curtir → match fictício → conversar → consentir → revelar → bloquear → denunciar. A sequência é simulada.
- Avaliar os testes pelo comportamento que protegem. Contagem ou cobertura percentual isoladas não representam segurança.

### Antes de produção

- Integração com banco real: unicidade de par, transações, reenvio, consentimento versionado, concorrência e efeitos de eventos atrasados.
- API autenticada: troca de IDs, acesso de terceiros, sessão expirada, revogação de sessão, limites de uso e envio abusivo.
- Armazenamento privado: originais inacessíveis antes da autorização, tokens de curta duração, respostas sem cache compartilhado, revogação e substituição de mídia.
- E2E com duas identidades reais de teste: todos os P0, refresh, duas abas, offline/reconexão e conflito de ações.
- Operação: denúncia recebida, fila, responsável, decisão, auditoria com acesso restrito e retorno adequado ao usuário.
- Verificar pagamentos com webhooks duplicados/fora de ordem, cancelamento e restauração de compra apenas quando a cobrança existir.
- Fazer revisão externa proporcional de segurança antes da abertura pública; obter evidência de acessibilidade com tecnologias assistivas.

## Métricas sem vigilância desnecessária

| Métrica | Definição e uso |
|---|---|
| Oferta elegível | Usuários ativos com ao menos N candidatos reciprocamente elegíveis na região; N definido no piloto |
| Match → conversa | Pares em que ambos enviam uma mensagem / matches criados, em janela definida |
| Retomada | Conversas com participação dos dois em mais de um dia |
| Revelação bilateral | Pares elegíveis com duas autorizações válidas / pares elegíveis |
| Continuidade após revelação | Pares com interação dos dois após revelar, separando janelas de 24 h e 7 dias |
| Integridade | Duplicatas de par, acessos privados indevidos, falhas de consentimento e divergências de bloqueio; meta operacional zero |
| Atendimento | Denúncias abertas, tempo até triagem, reincidência e resolução, com acesso restrito |
| Economia | Receita líquida por assinante e custo variável, incluindo moderação, verificação e pagamentos |

Eventos analíticos não devem incluir texto de conversa, orientação, livros associados a uma identidade, fotos ou localização precisa. Relatar funil por coortes agregadas e explicitar denominador, janela e perdas de instrumentação. Não concluir sucesso com cadastros, tempo de tela ou número bruto de mensagens.

## Gates de entrega

**Demo apresentável:** módulos executam, testes de domínio passam, navegação crítica funciona, estados simulados estão identificados, nenhum cadastro real/foto privada é solicitado, contraste/foco/tela pequena revisados e limitações documentadas.

**Beta fechado:** todos os P0 aplicáveis passam em integração e E2E; servidor é a autoridade; teste concorrente prova unicidade; mídia privada e consentimento versionado verificados; denúncia funciona após encerramento; adultos, privacidade, retenção e exclusão têm implementação e responsáveis; equipe de moderação e incidentes está disponível. Não há falha crítica ou alta aberta.

**Lançamento público:** beta produz evidência de oferta local e continuidade das conversas; limites de abuso e capacidade são medidos; monitoramento, backup/restauração e resposta a incidentes são exercitados; contratação/cobrança e cancelamento são verificáveis. Decisão de produto e segurança registrada com riscos residuais e responsáveis. Nenhum gate autoriza afirmar ausência absoluta de brechas.

## Registro de revisão

Plano criado antes da revisão de implementação. Resultado de testes e achados do código serão adicionados somente depois da execução efetiva.
