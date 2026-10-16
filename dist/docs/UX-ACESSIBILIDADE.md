# Margem — UX e acessibilidade

Estado: especificação proposta em 16/10/2026. Aplicação do agente ECC `a11y-architect`; não equivale a auditoria executada nem certificação. Margem é nome de trabalho, sem pesquisa de disponibilidade neste documento.

## Decisões de experiência

- A afinidade literária oferece contexto, sem prometer compatibilidade amorosa ou pontuação científica.
- Permitir gêneros variados, audiolivros, quadrinhos e leitores ocasionais. Não usar quantidade de livros como ranking de valor pessoal.
- Explorar pessoas, com histórias e opiniões sobre leituras. As capas ajudam a reconhecer títulos; as respostas pessoais sustentam a escolha.
- Ação explícita “Tenho interesse” e “Próxima pessoa”; swipe é opcional, nunca único meio de operar. Evitar “descartar”, contagem regressiva, streak de mensagens e pressão para revelar.
- A revelação libera acesso às fotos para os dois na mesma transação no servidor. A exibição não pode ser garantida no mesmo milissegundo em aparelhos com redes diferentes.
- Explicar antes do consentimento que fotos vistas podem ser capturadas. Revogar acesso futuro não apaga cópias já feitas.

## Fluxos e critérios de aceite

| Fluxo | Comportamento exigido | Erro ou estado alternativo |
|---|---|---|
| Cadastro | Explicar proposta, 18+, regras e privacidade antes de pedir dados. Campos por etapa com progresso textual. Intenção, faixa etária e interesses separados das respostas literárias. Nenhum requisito de listar muitos livros. Fotos privadas com explicação de quem acessa. | Menor de idade: interromper sem recomendar contornar verificação. Falha na verificação oferece suporte acessível. Erro de campo junto ao campo, resumo de erros e valores preservados. |
| Preferências | Localização aproximada, idade e interesse recíproco. Explicar o efeito de filtros. Permitir cidade manual se negar geolocalização. | Sem elegíveis: explicar falta de perfis, oferecer revisar filtros explicitamente e lista de espera. Nunca ampliar distância/idade em silêncio. |
| Explorar | Nome escolhido, idade, região ampla, intenção, livros e respostas. Indicar afinidade concreta: “Vocês escolheram este livro”. Botões com rótulos claros e opções de denúncia. | Fim de fila distinto de erro de rede. Sem inventar pessoas, distância, presença online ou disponibilidade. Retomar posição ao voltar do perfil. |
| Match | Interesse mútuo cria conversa; abertura baseada na resposta curtida. Tela/aviso apresenta escolha “Conversar” ou “Continuar explorando”. | Interesse unilateral não deve sugerir reciprocidade. Notificações externas sem conteúdo sensível por padrão. |
| Chat | Histórico estável, composer acessível, envio explícito, status de envio/falha e reenvio sem duplicar. Pergunta inicial opcional. Sempre acessar bloquear/denunciar. | Falha mantém rascunho. Novas mensagens não roubam foco ou rolam quem está lendo histórico. Aviso “Novas mensagens” leva ao fim. |
| Elegibilidade para foto | Participação dos dois habilita opção, segundo regra de produto publicada. Mostrar condição compreensível; evitar contador gamificável de mensagens. | Sem elegibilidade: texto explica que ainda não está disponível. Tempo ou contagem não significam qualidade de vínculo. Não usar IA para julgar intimidade. |
| Convite privado | Cada pessoa registra “Quero revelar” em privado e pode cancelar antes da liberação. O interlocutor não vê quem aceitou, recusou ou está esperando. | Confirmação: “Sua escolha está salva. A revelação acontece quando os dois quiserem.” Não emitir evento de convite pendente ao outro. |
| Revelação bilateral | Modal explica escopo e consequência; confirmação explícita. Fotos disponíveis para ambos apenas quando duas autorizações válidas e conversa ativa. Aviso acessível e animação dispensável. | Revalidar consentimento, bloqueio e estado no servidor. Rede falhou: consultar estado final antes de repetir. Foto indisponível oferece tentar novamente; nunca revelar só uma foto como compensação. |
| Encerrar/bloquear | Bloquear imediatamente interrompe contato e acesso futuro segundo política, sem enviar motivo ao bloqueado. Denunciar pode incluir bloqueio; permitir denúncia mesmo após encerrar. | Separar “encerrar conversa”, “bloquear pessoa” e “denunciar”. Confirmação proporcional; denúncia preserva evidência segundo retenção informada, sem obrigar contato adicional. |
| Conta | Pausar descoberta, sair e excluir conta são opções distintas, encontráveis. Explicar o efeito em conversas e dados. | Exclusão tem confirmação explícita e feedback; evitar caminhos enganosos. Falha não informa sucesso. |

## Regras específicas da demonstração

Banner persistente e legível: “Demonstração com pessoas e conversas fictícias. Nenhuma mensagem é enviada.” Não apresentar login real, verificação real, cobrança, denúncia enviada ou privacidade garantida por backend inexistente. No cenário de revelação, botão deve dizer “Simular consentimento da outra pessoa” e a saída “Revelação simulada”. Um segundo participante automático nunca pode parecer humano real. Sem upload de fotos pessoais ou solicitação de dados sensíveis na demonstração. Mensagens de formulário devem esclarecer armazenamento local, se implementado; preferir memória da sessão.

## Padrão WCAG 2.2 AA e mobile

Meta: conformidade WCAG 2.2 nível AA, a verificar sobre o produto implementado. A recomendação W3C foi atualizada em 12/12/2024. A lista abaixo é seleção de critérios de maior risco, não substitui avaliação integral de A e AA.

| Área | Regra de implementação |
|---|---|
| Texto | Corpo preferencialmente 16–18 CSS px, altura de linha ~1,5; tamanhos relativos, zoom não bloqueado. Contraste 4,5:1 em texto normal e 3:1 em texto grande segundo definição normativa. Fonte editorial nos títulos; sans legível em formulários/chat. |
| Interface | Controles e estados relevantes com contraste mínimo 3:1; texto/ícone acompanha cor. Não comunicar interesse, erro ou envio apenas por cor. |
| Toque | Regra interna de produto: alvos de pelo menos 44×44 CSS px e separação confortável. WCAG 2.5.8 AA estabelece 24×24 CSS px com exceções; 44 não é o mínimo normativo AA. Barra inferior no alcance do polegar com safe area; ações destrutivas afastadas da ação principal. |
| Reflow | Conteúdo permanece operável a 320 CSS px de largura e com zoom/reflow equivalente a 400%, sem cortar campos e mensagens. O teclado móvel não cobre composer ou botão focado. |
| Teclado | Todas as ações por Tab, Shift+Tab, Enter/Space; ordem acompanha leitura. Sem gesto de arrastar obrigatório (2.5.7). Links para navegação, botões para ações; navegação ativa identificada. |
| Foco | Indicador visível e contrastante. Nada completamente escondido por cabeçalho, barra fixa, modal ou teclado (2.4.11); mirar visibilidade completa. Não confundir com 2.4.13 Aparência do Foco, que é AAA. |
| Diálogos | Nome e descrição acessíveis, foco inicial seguro, foco contido, Escape fecha quando apropriado, fundo inerte e retorno ao disparador. Confirmação de revelação começa em título/descrição, sem consentir por foco ou Enter herdado. |
| Formulários | Labels persistentes, instruções antes do campo, autocomplete adequado e erros vinculados. Não depender de placeholder. Não pedir informação novamente no mesmo processo sem necessidade (3.3.7). Autenticação permite gerenciador de senhas/colar; não depender de teste cognitivo (3.3.8). |
| Leitor de tela | Hierarquia de títulos e landmarks; nome, função e estado dos controles. Capas têm título/autor em texto próximo; imagem redundante pode ter alt vazio. Fotos reveladas com alternativa neutra definida por política, sem inferência automatizada sobre identidade ou atributos sensíveis. |
| Atualizações | Status de envio, salvamento e match por região live moderada; sem anunciar todo o histórico. Chat pode usar log de adições controladas após teste real em VoiceOver/TalkBack/NVDA. |
| Movimento | Respeitar prefers-reduced-motion: revelação instantânea com confirmação textual. Sem rotação, confete obrigatório, parallax ou animação contínua de páginas. Não esconder informação atrás de animação. |
| Ajuda | Ajuda e denúncia em local consistente (3.2.6). Linguagem direta em português, sem metáfora como único rótulo de ação. |

## Oito testes moderados de usabilidade

Rodar com adultos, incluindo leitores ocasionais, baixa visão, leitor de tela e limitações motoras. Proteger dados e usar cenários fictícios. Primeira rodada de 6–8 participantes detecta problemas; não permite estimar conversão de mercado. As oito tarefas são roteiro, não oito testes já realizados.

| # | Tarefa | Evidência e critério proposto |
|---|---|---|
| 1 | Explicar o produto após ver introdução e cadastrar perfil fictício. | Distinguir namoro, afinidade e foto privada sem ajuda; registrar dúvidas e campos abandonados. |
| 2 | Encontrar pessoa interessante e explicar por quê. | Identificar uma resposta/livro como contexto e perceber idade, região e intenção; nenhuma crença em “compatibilidade garantida”. |
| 3 | Demonstrar interesse e continuar explorando com uma mão e teclado. | Completar sem swipe obrigatório, toque acidental ou perda de foco; registrar alcance e erros. |
| 4 | Abrir match e iniciar conversa sem inventar assunto. | Encontrar contexto inicial e enviar mensagem; entender que interlocutor é fictício na demo. |
| 5 | Autorizar revelação e cancelar antes da autorização do outro. | Explicar quem pode ver a decisão e que cancelamento vale antes da liberação; nenhum entendimento de revelação automática por tempo. |
| 6 | Simular segunda autorização e verificar foto liberada. | Entender que ambos obtêm acesso, que redes podem atualizar em momentos diferentes e que captura não pode ser impedida. |
| 7 | Receber mensagem indesejada, bloquear e denunciar. | Encontrar ações sem ajuda, entender diferenças e concluir sem precisar responder ao agressor. |
| 8 | Recuperar erro de rede e fila vazia com zoom/leitor de tela. | Distinguir erro de ausência de perfis; preservar rascunho; recuperar sem duplicar mensagem e navegar sem barreira crítica. |

Antes do piloto: zero bloqueadores de teclado/leitor de tela nas tarefas críticas; ninguém deve conseguir interpretar consentimento unilateral como bilateral. Critérios adicionais de sucesso/taxa/tempo devem ser definidos antes da coleta, não escolhidos após resultados.

## Fontes primárias consultadas

- W3C — WCAG 2.2: https://www.w3.org/TR/WCAG22/
- W3C — panorama e histórico da recomendação: https://www.w3.org/WAI/standards-guidelines/wcag/
- W3C — tradução autorizada em português: https://www.w3.org/Translations/WCAG22-pt-BR/
- W3C — foco não obscurecido: https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum
- W3C — alvo mínimo: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

## Lacunas e riscos de escopo

Não prometer “sem brechas”: especificação reduz riscos, mas não comprova segurança nem acessibilidade. Uma demo demonstra fluxo e linguagem; não valida consentimento servidor, privacidade de foto, moderação, pagamento, verificação etária ou disponibilidade de pessoas reais. Não reaproveitar foto ou mensagem de pessoa real como perfil sem autorização. Critério de revelação, verificação de adultos e retenção de denúncia precisam de decisão explícita antes de produção. Não perseguir originalidade visual por navegação incompreensível: manter rótulos familiares e diferenciar na composição, tipografia e conteúdo.
