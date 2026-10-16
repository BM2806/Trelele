# Trelelê — produto, receita e validação

Data da análise: 16/10/2026. Nome provisório; disponibilidade de marca, domínio e lojas não foi verificada. Aplicação do planner ECC: requisitos, etapas incrementais, riscos e critérios verificáveis. Este documento não escolhe backend. Valores e metas identificados como hipóteses não são dados de mercado nem previsões.

## Decisão de produto

Desenvolver um piloto de namoro 18+ em que livros iniciam a descoberta e fotos são reveladas somente após conversa e consentimento dos dois. O benefício é ter assunto e descobrir uma pessoa pelo que ela pensa; gostar do mesmo livro não prova compatibilidade romântica. Não usar “percentual de alma gêmea”, promessa de namoro ou superioridade moral sobre outros aplicativos.

Uma experiência de namoro precisa gerar oportunidades recíprocas e conversas que as pessoas desejem continuar. Downloads, lista de espera e quantidade bruta de matches não bastam. O piloto deve validar essa experiência antes de cobrar ou expandir nacionalmente.

Separar marca, cadastro e consentimento do Livrado. Participar de clube do livro não implica disponibilidade romântica. Não importar perfis, fotos, grupos ou orientação de outro produto sem adesão específica.

## Evidências externas e limites

1. Tinder comercializa conveniência, descoberta e visibilidade: curtidas ilimitadas, voltar, passaporte, ver curtidas e priorização. A própria tabela registra diferenças por testes e mercados. Não há preço brasileiro universal verificável nessa página; não presumir receita ou conversão do concorrente. [S1]
2. Bumble oferece planos opcionais com filtros, fila de curtidas, modo anônimo e consumíveis. Isso demonstra mecanismos existentes, não demanda pelo Trelelê. [S2]
3. Fable apresenta clubes gratuitos, conversas protegidas de spoilers e ferramentas de organização, com recursos adicionais vinculados à compra do e-book. Demonstra uma experiência social literária; não comprova demanda por namoro nem sugere copiar preço de clube. [S3]
4. Stripe publica no Brasil cartão nacional a 3,99% + R$ 0,39 por transação e Billing a 0,7% do volume. Pix aparece a 1,19% e somente por convite na página consultada. Isso não garante aceitação comercial de um negócio de namoro, liberação de recursos ou Pix recorrente. [S4]
5. Mercado Pago documenta assinaturas com frequência configurável e retentativas, com opção de pagar sem conta. A visão geral menciona Pix/boleto; não concluir que todos os meios têm débito recorrente automático no caso contratado. Validar integração, elegibilidade e meios em sandbox e proposta comercial. [S5]

Todas as recomendações seguintes são decisões ou hipóteses próprias, não características atribuídas aos concorrentes.

## Público e promessa

- Adultos interessados em namoro, não só leitores intensivos. Sem requisito de quantidade anual de livros ou repertório clássico.
- Aceitar leitura física, digital, quadrinhos e audiolivros. Quem lê pouco pode declarar um livro marcante e temas que deseja conhecer.
- Exibir intenção, idade e região aproximada antes da curtida; não esconder informações essenciais sob a narrativa de mistério.
- Não inferir orientação, religião, saúde ou posição política pelos livros. Preferências explícitas e dados sensíveis exigem tratamento próprio, conforme revisão jurídica e segurança.
- Promessa sugerida: “Conheça alguém pelo que desperta uma boa conversa. A foto vem quando os dois quiserem.” A interface também precisa explicar o requisito de conversa antes da revelação.

## MVP priorizado

| Prioridade | Entrega | Critério de aceitação |
| --- | --- | --- |
| P0 | Elegibilidade 18+, cadastro e política de conduta | Menores não entram no fluxo de descoberta; declaração de idade isolada não é apresentada como verificação de identidade |
| P0 | Perfil com nome escolhido, idade, intenção, região, livros e resposta pessoal | Pessoa entende a proposta sem foto e pode revisar dados antes de publicar |
| P0 | Preferências recíprocas | Nenhum perfil fora de critérios essenciais é introduzido silenciosamente para preencher a tela |
| P0 | Descoberta, passar e curtir | A curtida é pela pessoa e seu perfil; selecionar um livro no onboarding não curte ninguém |
| P0 | Match bilateral e conversa | Chat só é aberto para par com interesse recíproco; encerramento bloqueia novos envios |
| P0 | Revelação por conversa e consentimento duplo | Requisitos visíveis; foto não chega ao cliente antes da autorização; teste de revogação e concorrência |
| P0 | Bloqueio, denúncia e suporte | Disponíveis antes e depois do match; denúncia continua possível após encerrar a conexão |
| P0 | Pausar descoberta, sair e excluir conta | Pausa não apaga conversas; exclusão explica consequências, retenção aplicável e assinatura |
| P0 | Estados vazios, erro e acessibilidade | Não fabricar pessoas nem simular matches; botões com rótulo e alternativa ao gesto de deslizar |
| P1 | Curtidas recebidas, favoritos privados, voltar e preferências de leitura | Somente após evidência de uso e com regras claras sobre desfazer curtida já correspondida |
| P1 | Assinatura e portal de gestão | Cobrança real somente com oferta pronta, política clara, integração homologada e cancelamento testado |
| P2 | Eventos literários | Piloto separado com responsável por operação, moderação, segurança presencial e orçamento |

Fora do MVP: videochamada, chamadas de voz, anexos de chat, ranking público, feed social, clubes, vendedor de livros, presentes, impulsionamento, IA redatora de mensagens, app nativo e algoritmo de embeddings. Esses recursos não são necessários para testar a hipótese central e ampliam custos ou superfícies de abuso.

## Experiência completa

### Entrada e perfil

1. Abertura explica namoro 18+, fotos protegidas e ausência de promessa de compatibilidade.
2. Cadastro apresenta regras essenciais, controles de privacidade e opções de verificação compatíveis com a política operacional definida pela equipe de segurança.
3. Pessoa informa idade, intenção, preferências recíprocas e cidade/região. A região pública nunca expõe endereço ou localização exata.
4. Seleciona até cinco livros, pelo menos um para iniciar, e escreve uma resposta curta. Cadastro manual é permitido quando catálogo falha; título duplicado ou edição diferente não deve fragmentar a afinidade.
5. Envia uma foto própria protegida e revisa como o perfil aparece antes da revelação. A foto é obrigatória para participar do piloto com revelação; avatares não substituem imagem pessoal nessa etapa. A verificação não significa ausência de risco.

### Descoberta e conexão

O card mostra nome, idade, região, intenção, livros e resposta. Afinidades são descritivas: “Vocês gostam de mistério” ou “Dois olhares sobre o mesmo livro”. Diferentes opiniões não geram incompatibilidade automática.

Separar filtros essenciais de preferências literárias. Nunca relaxar idade, orientação ou distância escolhida como limite rígido sem ação da pessoa. Se faltam candidatos, informar e oferecer ajustes opcionais. Não exibir livros como teste de inteligência, classe ou prestígio.

Match apresenta contexto da conexão e uma pergunta opcional. Os dois podem iniciar a conversa. Sem cronômetro que extingue um match, obrigação de resposta ou aviso de quem está esperando. Notificações devem ser discretas e configuráveis.

### Revelação da foto

Hipótese inicial alinhada ao domínio: elegibilidade após cinco turnos alternados de cada pessoa e 24 horas desde a primeira resposta bilateral. Mensagens seguidas do mesmo remetente formam um turno. Esses números são parâmetros experimentais, não medição de intimidade nem garantia antispam semântico. Na demo há controles explícitos para simular a passagem do tempo e as trocas. Teste de usabilidade pode indicar substituí-los antes de produção.

- O progresso mostra “Conversem dos dois lados e voltem a trocar mensagens em outro momento”; detalhes acessíveis explicam a regra sem exigir leitura técnica.
- Contagem mínima não é objetivo de sucesso, não deve virar gamificação nem premiar mensagens repetidas. Mensagens vazias e duplicatas exatas não avançam; filtros automáticos não garantem conversa significativa.
- Após elegibilidade, cada pessoa pode escolher “Quero revelar”. A decisão individual permanece privada até ambas aceitarem.
- Duplo consentimento revela as duas fotos na mesma transição. Ninguém compra, vê ou baixa a foto antes disso; a imagem integral não pode estar apenas borrada no dispositivo.
- Até a revelação, a pessoa pode retirar seu aceite. Se alguém encerrar, bloquear ou sofrer suspensão antes da transição, a revelação é cancelada.
- Depois de revelada, não prometer que é possível apagar capturas ou memória da outra pessoa. Encerrar conexão revoga acesso futuro dentro do app conforme política, não o que já foi visto.
- Recusar não gera cobrança, aviso acusatório ou mensagem “Fulano está esperando”. Denúncia inclui pressão para revelar e tentativa de exposição.

Comparar a hipótese com uma regra mais simples no piloto, sempre após conversa bilateral. Usuários precisam saber qual regra rege sua experiência. Nunca testar revelação automática ou unilateral sem consentimento.

### Segurança, saída e suporte

Menu acessível no perfil e chat: bloquear, denunciar, encerrar conexão. Pedir confirmação para encerramento irreversível; em denúncia de risco, não atrasar bloqueio com perguntas obrigatórias. Oferecer relato com contexto mínimo, confirmação de recebimento e canal de retorno apropriado. Não expor quem denunciou.

Pausar novas conexões não cancela assinatura; excluir conta e cancelar assinatura são operações distintas que a interface deve explicar, com caminho direto para gestão. A equipe jurídica define retenção, exclusão e tratamento de casos pendentes. Não lançar operação real sem responsável humano e escala de atendimento.

## Receita: uma oferta, quando houver valor

No piloto, core gratuito: descobrir, curtir em volume suficiente para testar, conversar, revelar por consentimento, bloquear, denunciar e controles essenciais de privacidade.

Hipótese de plano “Trelelê Mais”: R$ 29,90/mês. Faixa de experimento: R$ 19,90 / R$ 29,90 / R$ 39,90. Nenhum desses preços foi validado com clientes ou calculado como preço ideal. Não apresentar desconto ou preço riscado fictício.

Benefícios candidatos: fila de quem já curtiu, ainda com fotos protegidas; voltar em passes recentes; coleção privada ampliada no perfil; preferências opcionais de leitura. A fila mostra somente pessoas ainda elegíveis, ativas e não bloqueadas. Filtrar livros demais reduz liquidez: avisar e permitir desfazer filtros. Favoritos não podem ser usados para contornar bloqueio ou gravar perfil indefinidamente.

Não monetizar: desbloqueio de fotos, consentimento, denúncia, bloqueio, verificação básica necessária à operação, privacidade essencial, leitura de mensagens ou promessa de mais segurança. Não garantir matches ou mostrar curtidas falsas. Impulsionamento e likes ilimitados ficam adiados porque podem incentivar volume e enfraquecer a proposta de atenção.

Validação da oferta: entrevistas sobre tarefas e problemas, teste de compreensão, lista de interesse com preço explícito sem captura de cartão, depois compra real voluntária quando benefício estiver funcionando. Clique em preço e declaração de intenção não são conversão paga. Não cobrar para entrar em região sem densidade; oferecer aviso de abertura.

Checkout deve mostrar preço, periodicidade, benefícios, renovação e cancelamento. Exibir falha de pagamento sem encerrar conversa ou retirar acesso a foto já autorizada. Não apagar dados por downgrade. Relação comercial, categoria de atividade e obrigações fiscais precisam de validação própria; não presumir enquadramento como MEI.

## Pagamentos no Brasil

Dois candidatos documentados: Stripe e Mercado Pago. A equipe implementadora decide após testar experiência de compra, recuperação, cancelamento, reembolso, elegibilidade do negócio e tarifas contratuais.

Cartão recorrente é hipótese inicial de cobrança, não autorização para ativar produção. Pix avulso não é assinatura automática. Pix Automático só entra na oferta se o provedor, produto, contrato e integração suportarem o fluxo homologado. Não anunciar Pix recorrente pela mera presença de Pix numa página geral.

A distribuição pretendida é como aplicativo Android/iOS. Os cálculos a seguir são cenários preliminares de venda web e não incluem comissão de loja; não representam a margem final do aplicativo. Antes de implementar assinatura, revisar regras de faturamento e elegibilidade do negócio nas duas lojas, incluir taxas contratuais e recalcular a viabilidade. Nenhuma integração de cobrança foi implementada.

## Economia unitária: modelo auditável

Definições mensais:

- A: usuários ativos mensais reais; q: assinantes cobrados / A; N = A × q.
- P: preço médio efetivamente recebido antes das deduções; g e k: taxa percentual e fixa do processador; b: cobrança recorrente adicional.
- r: reembolso/chargeback como fração da receita, sem duplicar perdas já retiradas de P; t: carga tributária efetiva confirmada, não alíquota legal presumida.
- c: custo variável por ativo de toda a base; d: custo adicional por pagante; F: custo fixo mensal; M: aquisição no mês.
- V: custo de verificação e onboarding por novo cadastro; J: novos cadastros verificados no mês; D: tarifas de disputas e perdas extras ainda não refletidas em r.

Equações:

    Receita bruta = A × q × P
    Caixa após deduções proporcionais = A × q × [P × (1 - g - b - r - t) - k]
    Contribuição = A × q × [P × (1 - g - b - r - t) - k - d] - A × c - J × V - D
    Resultado operacional = Contribuição - F - M
    q de equilíbrio variável = c / [P × (1 - g - b - r - t) - k - d]

O último equilíbrio omite J×V e D para isolar sensibilidade; não é equilíbrio completo da operação. Reembolsos podem não devolver taxas, e tarifas de contestação precisam de linha específica; por isso D não deve ser zero por conveniência.

### Exemplo estritamente ilustrativo

Assumir P=R$29,90; g=3,99%; k=R$0,39; b=0,7% (referência pública Stripe [S4], sem decisão de fornecedor); r=2%; t=6% **como cenário arbitrário**, não orientação tributária; d=R$0,60; c=R$1,20; F=R$2.000. V, J, D e M estão zerados somente para comparação isolada abaixo e precisam ser adicionados no orçamento real. Os custos não são cotações.

Contribuição por pagante antes de financiar a base gratuita: R$25,11569. Contribuição por ativo: q × R$25,11569 − R$1,20. Equilíbrio variável: q≈4,78%, antes dos custos fixos, aquisição, onboarding e disputas adicionais.

| Conversão paga q | Contribuição por ativo | Contribuição com 1.000 ativos | Após F=R$2.000 | Ativos para cobrir F neste cenário |
| --- | ---: | ---: | ---: | ---: |
| 2% | -R$0,6977 | -R$697,69 | -R$2.697,69 | Não existe enquanto a contribuição for negativa |
| 5% | R$0,0558 | R$55,78 | -R$1.944,22 | Aproximadamente 35.853 |
| 10% | R$1,3116 | R$1.311,57 | -R$688,43 | Aproximadamente 1.525 |

Arredondamentos afetam o número de equilíbrio. A tabela não projeta conseguir 10% de conversão, 35 mil ativos ou custo fixo de R$2 mil. Demonstra que um preço aparentemente razoável pode sustentar mal a base gratuita. Se c subir para R$3,00, o equilíbrio variável sobe para aproximadamente 11,95% no mesmo preço; a 10%, escalar aumenta prejuízo variável.

### Decompor custos, sem esconder trabalho humano

Orçamento ilustrativo de c=R$1,20: R$0,30 de infraestrutura/mensagens/armazenamento, R$0,70 de moderação, R$0,20 de suporte. Medir custo real por evento e por coorte; não usar valores como promessa de hospedagem.

    Custo de moderação/ativo = casos por ativo × minutos por caso / 60 × custo hora carregado

R$0,70 pode representar 0,05 caso por ativo × 10 min × R$84/h ÷ 60. Esses três números são hipóteses. Casos graves, recursos e incidentes demandam mais tempo; disponibilidade de plantão tem componente fixo. Moderar fotos antes de publicar e reavaliar denúncias adiciona eventos próprios. Incluir treinamento, supervisão e cuidado com revisores no custo carregado.

SMS/OTP, checagens de idade/identidade, fraude, backups, observabilidade, catálogo, e-mail, atendimento, revisão jurídica, resposta a incidentes, engenharia e trabalho dos fundadores não são gratuitos. Alguns custos são fixos ou de entrada; classificá-los sem contar duas vezes. IA de moderação pode reduzir parte da triagem, não substituir responsabilidade humana nem eliminar custo de erro.

### Aquisição e retenção

    CAC por novo pagante = gasto de aquisição atribuível / novos pagantes incrementais
    CAC por ativo ativado = gasto / novos usuários que completam perfil e têm oportunidade elegível
    Trelelê paga com subsídio da base = [contribuição total] / pagantes
    Payback aproximado = CAC pago / margem mensal paga alocada

Só calcular payback com margem positiva e coortes comparáveis. Não misturar conversão do estoque de MAU com conversão de novos adquiridos. LTV≈margem mensal/churn é uma aproximação frágil com cancelamento variável e coortes jovens. Usar contribuição acumulada observada por coorte e horizonte limitado. Namoro pode gerar saída por sucesso: separar “conheci alguém” de abandono por experiência ruim, sem exigir exposição íntima.

## Aquisição e densidade regional

Começar em uma cidade (São Paulo como hipótese operacional), com adesão explícita de adultos e lotes de entrada. Cidade não basta: cruzar preferências recíprocas, intenção, faixa de idade, raio e atividade. Não buscar uma divisão binária artificial entre homens e mulheres; medir oportunidades reais para cada segmento, inclusive LGBTQIA+.

Definição de densidade: para cada pessoa, quantidade de perfis ativos nos últimos sete dias que atendem reciprocamente às restrições essenciais, descontando bloqueios e exposições já esgotadas. A meta inicial é hipótese: pelo menos 80% da coorte com 15 opções elegíveis no onboarding e reposição suficiente na semana. Revisar conforme ritmo real de uso; não alterar critérios para maquiar o indicador.

Aquisição inicial: parceria consentida com clubes, livrarias e criadores locais; indicação privada; eventos de apresentação que deixem claro serem de namoro. Não extrair membros de clubes nem contatar pessoas individualmente sem autorização. Nenhuma comunicação foi enviada neste trabalho.

Convites podem ter janela de ativação para reunir usuários, sem fingir escassez. Se uma região ou segmento não tiver opções, informar espera e não cobrar. Evitar mídia nacional antes de demonstrar densidade local. Incentivo por cadastro bruto tende a atrair perfis pouco comprometidos; testar indicação baseada em adesão real sem recompensas por match, foto revelada ou envio de mensagens.

## Plano de validação e decisões

As metas abaixo são pontos de decisão propostos, não benchmarks comprovados. Fixar protocolo e denominadores antes de observar resultados. Segmentar sem expor dados pessoais; não concluir que um pequeno grupo representa o Brasil.

1. **Entender a necessidade:** 20–30 entrevistas variadas, com usuários e ex-usuários de namoro. Investigar desconfortos, hábitos de leitura, disposição para conversar antes da foto e motivos para desistir. Não recrutar somente seguidores do fundador. Não transformar concordância em prova de demanda.
2. **Usabilidade:** 8–12 pessoas em protótipo com cenários de recusa, revelação e denúncia. Meta provisória: pelo menos 9 em 10 entendem que foto exige conversa e aceite duplo, e encontram bloqueio sem ajuda. Corrigir qualquer interpretação de foto automática ou garantia de segurança antes de piloto.
3. **Piloto:** 150–300 adultos consentidos, com convites por elegibilidade regional, por quatro a seis semanas. Volume é hipótese operacional; não garante poder estatístico. Sem perfis sintéticos misturados aos reais. Parar se atendimento de segurança não acompanhar.
4. **Resultado central:** proporção de usuários com oportunidades elegíveis que obtêm conversa recíproca em sete dias e, dentro dessas conversas, retorno bilateral em outro dia. Hipóteses para avançar: 30% dos elegíveis com conversa recíproca e 40% dessas conversas retomadas. Registrar incerteza e amostras; não tratar um ponto percentual isolado como prova.
5. **Revelação:** observar aceites, desistências, relatos de pressão e continuidade pós-revelação. Aumentar revelações às custas de segurança ou satisfação é fracasso. Coletar feedback de quem não quis revelar sem insistência.
6. **Receita:** depois de oportunidade e conversa comprovadas, testar benefícios e preços com compra real opcional. Comparar coortes e calcular contribuição incluindo os gratuitos. Sem entrega ou interesse suficiente, ajustar oferta em vez de esconder core em paywall.
7. **Expansão:** abrir nova região somente se primeira mantiver reposição, atendimento e contribuição mensuráveis. Cohortes de quatro semanas não justificam estimativa anual de LTV.

## Métricas e guardrails

| Área | Indicador e denominador | Ação |
| --- | --- | --- |
| Ativação | Cadastro → perfil concluído → elegível com opções | Corrigir abandono e falta de candidatos separadamente |
| Conversa | Usuários com conversa recíproca / usuários com oportunidades; conversas retomadas / conversas recíprocas | Indicador principal; não contar mensagens automáticas |
| Revelação | Duplo aceite / pares elegíveis; continuidade bilateral em 48h / revelações, excluindo pares sem janela completa | Investigar queda e relatos qualitativos sem pressionar continuidade |
| Densidade | Mediana e percentil baixo de candidatos recíprocos por segmento | Não mascarar falta de opções pela média global |
| Segurança | Denúncias e bloqueios por 1.000 pares, severidade, reincidência e tempo de resposta | Aumento de denúncias pode refletir melhor acesso; interpretar com casos e gravidade |
| Consentimento | Exposições de foto sem duplo consentimento | Meta zero; incidente exige contenção imediata e revisão antes de retomar |
| Idade | Casos suspeitos/confirmados de menor; tratamento e eficácia das barreiras | Remover acesso e acionar protocolo; zero relato não prova zero ocorrência |
| Equidade | Oportunidade e sucesso por coorte suficientemente ampla | Investigar distribuição; não prometer resultados iguais nem coletar dado excessivo |
| Receita | Pagantes cobrados, reembolsos, cancelamento, margem por coorte | Nenhuma cobrança real sem controle de assinatura funcional |
| Operação | Fila por severidade, casos por moderador e reabertura | Suspender aquisição se houver risco sem capacidade de atendimento |

Hipótese de SLA operacional: triagem imediata de risco crítico durante atendimento e cobertura explícita de plantão antes do lançamento; demais casos em até 24 horas. Não prometer esse SLA externamente antes de definir equipe e cobertura. O app deve informar canal apropriado para emergências, sem se apresentar como serviço emergencial.

## Decisões consolidadas

- Aprovar piloto e protótipo funcional; não interpretar isso como aprovação de operação real com dados sensíveis, cobrança ativa ou marca registrada.
- Core de relacionamento e segurança gratuito. Receita inicial candidata é uma assinatura mensal única, com benefícios ainda sujeitos a validação.
- Foto protegida até conversa e consentimento dos dois, sem atalho pago.
- MVP sem anexos, voz, vídeo, feed, clubes e IA escrevendo pelo usuário.
- Uma região primeiro, acompanhando densidade recíproca e casos de segurança.
- Provedores, tributação e operação devem ser validados antes da cobrança; este documento não seleciona infraestrutura.
- Veredito: há uma proposta clara para experimentar. Viabilidade comercial permanece aberta; o cenário financeiro mostra que moderação e base gratuita podem consumir toda a receita de uma conversão paga aparentemente boa.

## Fontes oficiais consultadas em 16/10/2026

- **S1 — Tinder, Assinaturas do Tinder**, página com atualização indicada em 17/08/2026: https://www.help.tinder.com/hc/pt-br/articles/115004487406-Assinaturas-do-Tinder
- **S2 — Bumble, Understanding Bumble's paid features and subscription plans**, atualização indicada em 31/03/2026: https://support.bumble.com/hc/en-us/articles/32668790872733-Understanding-Bumble-s-paid-features-and-subscription-plans
- **S3 — Fable, Book Clubs Reimagined**, sem data de atualização pública identificada: https://fable.co/club-features
- **S4 — Stripe Brasil, Preços e tarifas**, tarifa pública consultada na data, sujeita a produto, elegibilidade e contrato: https://stripe.com/br/pricing
- **S5 — Mercado Pago Developers, Visão geral de Assinaturas**, sem data de atualização pública identificada: https://www.mercadopago.com.br/developers/pt/docs/subscriptions/overview

As fontes demonstram recursos e tarifas declarados pelos fornecedores. Não constituem pesquisa de demanda, validação jurídica, cotação contratual ou prova de que o Trelelê terá conversão, retenção e custos semelhantes.
