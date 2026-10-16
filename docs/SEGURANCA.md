# Trelelê — segurança, privacidade e confiança

Data de referência: 16/10/2026. Aplicação do roteiro ECC `security-reviewer`; análise de desenho, sem auditoria de um backend implementado. Requisitos abaixo não equivalem a controles já existentes. Segurança absoluta não pode ser garantida.

## 1. Fronteira da demonstração

O protótipo estático usa somente perfis, conversas, idades e consentimentos fictícios. Não recebe cadastros, uploads, documentos, localização, biometria ou dados reais de usuários. Não envia mensagens a pessoas, não verifica identidade e não representa uma comunidade operante. A interface deve dizer “Demonstração — pessoas e conversas fictícias”.

Desbloqueio visual, bloqueio e denúncia simulados validam compreensão do fluxo; não comprovam proteção de fotos ou atendimento operacional. Qualquer imagem incluída no pacote estático pode ser inspecionada. Uma foto ilustrativa presente na demo não é privada. Não apresentar a ocultação visual como barreira de segurança real. Se houver campo para exercitar interação, orientar a usar texto fictício, não transmitir nem persistir seu conteúdo e limitar tamanho.

Não colocar chaves, segredos, fotos reais, cadastros externos, telemetria identificável ou integrações de verificação na demonstração. O Go da demo não autoriza abertura de contas reais.

## 2. Modelo de ameaças para produção

Ativos: fotos privadas e suas versões, mensagens, preferências de relacionamento, livros selecionados, credenciais, dados de idade/verificação, localização aproximada, denúncias e evidências. Atores: usuário comum, pessoa abusiva, golpista, bot, conta comprometida, funcionário/fornecedor e atacante externo.

Fronteiras: aplicativo cliente → API; API → banco/armazenamento; API → notificações; operação → console de moderação; serviço → verificador de idade e demais operadores. O servidor é a autoridade sobre match, permissão, relógio, consentimento e bloqueio; o cliente não decide acesso.

| Ameaça | Prioridade | Controle exigido antes de público real |
|---|---|---|
| Recuperar foto antes do aceite por API, URL ou cache | P0 | Armazenamento privado, autorização por objeto e por versão, entrega autenticada sem cache compartilhado |
| Acessar chat de outro match alterando identificador | P0 | Autorização em cada operação e assinatura de canal; testes com três identidades |
| Menores acessarem ambiente de namoro | P0 | Garantia de idade proporcional ao risco, restrição 18+, tratamento urgente de suspeitas e revisão humana |
| Coerção, perseguição e retaliação após revelar | P0 | Revelação bilateral, saída imediata, bloqueio abrangente, denúncia preservada, sem punição por recusar |
| Bots, golpes românticos, perfis falsos | P0 | Limites de uso, detecção de padrões, verificação descrita com precisão e análise humana |
| Roubo de conta ou abuso administrativo | P0 | Sessões seguras, reautenticação em ações sensíveis, MFA obrigatório para equipe, menor privilégio e auditoria |
| Inferir religião, saúde, política ou sexualidade pelos livros | P0 | Sem inferências sensíveis; livros públicos selecionados; sem importar estante integral |
| Conteúdo malicioso, anexos, links e XSS | P0 | Chat inicial apenas texto, escape de saída, validação e limites; uploads somente no fluxo controlado de perfil |
| Denúncia perdida ou apagada pelo agressor | P0 | Registro protegido separado da visualização do chat; canal posterior ao unmatch e trilha de atendimento |
| Vazamento por logs, analytics ou notificações | P0 | Não registrar conteúdo íntimo/tokens; avisos genéricos por padrão e sem foto privada |

P0 significa bloqueador de abertura a usuários reais; P1 significa melhoria posterior, sem substituir P0. A referência técnica é a autorização por objeto da [OWASP API1:2023](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/).

## 3. Invariantes de match, chat e foto

1. Match exige interesse recíproco e elegibilidade dos dois. Uma restrição única por par e operações idempotentes evitam conversas duplicadas em curtidas simultâneas.
2. Chat exige match ativo, duas contas elegíveis e ausência de bloqueio. Autorização vale para leitura, escrita, histórico, anexos, websocket e notificações.
3. Tempo de conversa só habilita convite para revelação. A regra exata ainda é hipótese de produto e deve ser publicada sem prometer medir intimidade. Não usar IA lendo conversa para decidir se houve “conexão suficiente”. Contadores são validados no servidor, não avançam por relógio do dispositivo nem por repetição de eventos.
4. Revelação exige dois aceites explícitos, para aquele match e para as versões atuais das duas fotos. Atualizar qualquer foto cancela a autorização bilateral e requer novos aceites. Não há revelação unilateral, automática, comprável ou acessível por plano pago.
5. Recusar/adiar não exige justificativa, não expõe quem recusou e não reduz alcance. Uma solicitação pendente por par; após recusa, nova solicitação somente por iniciativa de quem recusou ou por ação bilateral clara. Sem notificações de cobrança, sequências obrigatórias ou contagem regressiva coerciva.
6. Retirar consentimento, bloquear, encerrar match ou suspender conta impede entregas futuras de fotos. Imagem já vista pode ter sido capturada; não prometer apagar cópias de terceiros ou impedir todo screenshot.
7. Não enviar original antes da autorização, nem em HTML, resposta JSON, pré-carregamento ou thumbnail identificável. Ocultar com CSS/desfoque não é controle de acesso. Remover EXIF e outros metadados de uploads; não aceitar SVG/HTML arbitrários como foto.
8. Preferir entrega por endpoint autenticado que revalida permissão em cada pedido. URL assinada reutilizável até expirar não satisfaz revogação imediata por si só. Definir comportamento para bytes já entregues; cache local e memória não podem ser “desvistos”.
9. Bloqueio confirmado impede mensagens aceitas posteriormente. Mensagens já em trânsito não devem gerar notificação depois de uma nova checagem de permissão. A arquitetura deve documentar ordenação e comportamento sob concorrência.

## 4. Idade, identidade e prevenção de fraude

Produto de namoro exclusivamente 18+. Autodeclaração/data digitada, telefone, cartão ou selo de foto isolados não comprovam maioridade. Antes do piloto real, selecionar e avaliar mecanismo de garantia de idade, cobertura, acessibilidade, falsos positivos/negativos, contestação e privacidade. Persistir somente resultado mínimo e validade quando possível, evitando cópia de documento e biometria próprios. Não escolher fornecedor nem afirmar conformidade sem avaliação concreta.

Idade confirmada, correspondência da foto e identidade civil são sinais diferentes. O selo deve nomear o teste realizado, não dizer “pessoa segura”. A [eSafety](https://www.esafety.gov.au/key-topics/staying-safe/online-dating) destaca que correspondência de imagem não comprova identidade e recomenda ferramentas claras de bloqueio/denúncia.

Suspeita fundamentada de menor: suspender descoberta, chat e revelação enquanto há avaliação; manter contestação acessível e não revelar a identidade do denunciante. Definir manejo de evidências sem pedir redistribuição de conteúdo abusivo. Política e treinamento precisam cobrir exploração infantil, ameaças, extorsão e imagem íntima não consentida.

Limites iniciais propostos, sujeitos a validação: até 30 curtidas/dia, 5 novas conversas/dia e 10 envios/minuto por conta, com limites adicionais por dispositivo/IP de forma proporcional e sem bloquear automaticamente redes compartilhadas. Repetição, volume e links suspeitos geram fricção/análise; não banir somente por um sinal ou por quantidade de denúncias. Nenhum limite isolado impede fraude. O piloto não permite anexos, pagamentos entre usuários, envio de dinheiro ou links clicáveis no chat.

## 5. Operação e moderação

Denunciar deve funcionar no perfil, conversa e histórico de conexões encerradas. Bloquear é imediato e distinto de denunciar. Motivos mínimos: menor, perfil falso, fraude, assédio/coerção, ameaça/perseguição, nudez não solicitada e outro. O usuário recebe protocolo, confirmação e estado do caso sem expor informação da outra parte. Evidências ficam separadas e acessíveis somente a profissionais autorizados, com registro de consulta e retenção justificada.

Metas operacionais propostas, ainda não contratadas e diferentes de prazos legais:

| Gravidade | Meta de início da triagem humana | Resposta inicial |
|---|---|---|
| Crítica: risco imediato, exploração de menor, extorsão ou vazamento ativo | Até 1 hora, cobertura contínua | Contenção proporcional, preservação restrita e acionamento do responsável |
| Alta: fraude, perseguição, coerção ou reincidência | Até 4 horas, cobertura contínua | Restringir quando necessário e investigar |
| Demais violações | Até 24 horas corridas | Revisar contexto, decidir e orientar |
| Recurso de sanção | Até 72 horas corridas | Revisão por outra pessoa quando possível |

Automação faz triagem; decisões com impacto precisam de revisão/contestação. Denúncia não é prova automática; banimentos têm motivo, trilha e recurso. Antes da abertura, indicar responsáveis e escala real, testar fila fora do expediente e demonstrar capacidade para o volume previsto. Sem cobertura para risco crítico, não abrir cadastro público. O app não se apresenta como serviço de emergência.

## 6. Privacidade e obrigações a fechar antes da produção

Análise jurídica e operacional precisa definir controlador, operadores, finalidade/base legal por tratamento, retenção, atendimento ao titular e transferências internacionais. Consentimento para revelar foto é uma permissão de produto; não substitui a definição das bases legais de toda a operação.

A [ANPD](https://www.gov.br/anpd/pt-br/acesso-a-informacao/perguntas-frequentes) lista religião, opinião política, saúde, vida sexual e biometria entre dados sensíveis. Livro lido não comprova essas características. Não inferir nem usar esses rótulos para segmentação, publicidade ou ranking. Preferências íntimas exigem tratamento específico; livros escolhidos para exposição não autorizam reutilização ampla da biblioteca pessoal.

Minimização: nome de exibição e região ampla, sem endereço, posição exata, empresa, sobrenome ou rede social obrigatória. Não revelar deslocamento por distância continuamente atualizada. Não importar contatos/estantes nem conectar Livrado por padrão. Nenhum treinamento de IA com mensagens/fotos. Notificações sem conteúdo íntimo por padrão. Equipe não navega chats livremente; acesso excepcional fundamentado e auditado.

Publicar política compreensível e canal verificado para acesso, correção, revogação, eliminação e contestação. Testar exportação e exclusão incluindo operadores e ciclo de backups; exceções de retenção de segurança/obrigações legais devem ser limitadas, justificadas e comunicadas. Os [direitos descritos pela ANPD](https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares) incluem essas possibilidades, com condições específicas; não prometer eliminação absoluta e imediata de qualquer registro.

O [ECA Digital — Lei 15.211/2025](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm) contempla serviços de acesso provável por menores. Rotular “18+” não resolve sozinho a avaliação de aplicabilidade. A ANPD publicou [orientações de aferição de idade e cronograma](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-publica-orientacoes-preliminares-e-cronograma-para-afericao-de-idade-no-ambiente-digital); a notícia apresenta orientações preliminares, portanto revalidar a regulamentação vigente e seu escopo no lançamento, sem tratar previsão de cronograma como conclusão de implementação.

Ter plano de incidentes com contenção, investigação, responsável e comunicações. A [página oficial de comunicação de incidentes](https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis) descreve comunicação à ANPD e titulares quando houver risco/dano relevante e prazo geral de três dias úteis, ressalvadas regras específicas. Avaliar enquadramento e contagem no caso concreto; metas de moderação não substituem esses deveres.

## 7. Aceites verificáveis e evidências

| ID | Teste antes da produção | Evidência mínima |
|---|---|---|
| SEC-01 | Conta C tenta ler/enviar em conversa A–B por API e websocket | Negativa sem conteúdo, inclusive identificadores alterados |
| SEC-02 | Um só aceite, prazo não cumprido, match encerrado e versão antiga de foto | Nenhum desses estados entrega foto; testes por API e mídia |
| SEC-03 | Duas curtidas simultâneas e reenvio da mesma requisição | Um match, um chat, nenhum efeito duplicado |
| SEC-04 | Bloquear durante envio/revelação, com cliente desatualizado | Após confirmação, novos pedidos negados e fila revalidada |
| SEC-05 | Inspecionar payload, cache, bundle, notificações e logs antes do aceite | Nenhum original, token ou URL de foto privada exposto |
| SEC-06 | Recusar e tentar repetir convite; tentar antecipar via assinatura/cliente | Regra mantida e ausência de pressão automática |
| SEC-07 | Upload inválido, arquivo enorme, metadados e conteúdo ativo | Rejeição segura, limites, reprocessamento e retirada de EXIF |
| SEC-08 | Conta restrita por idade, tentativa de acesso direto e recurso | Descoberta/chat/foto negados; recurso encaminhado |
| SEC-09 | Denunciar após unmatch/bloqueio e simular caso crítico fora do horário | Protocolo, evidência protegida, responsável recebe e atende meta |
| SEC-10 | Exportar/excluir conta, revogar sessões e executar restauração de backup | Dados acessíveis só ao titular; retenções/ciclo comprovados |
| SEC-11 | Testar injeção/XSS, limites, recuperação de conta e privilégios da equipe | Sem execução de conteúdo e sem escalada de acesso |

## 8. Go / No-Go público

**GO da demonstração:** apenas dados fictícios; rótulo de demo; nenhuma integração real; nenhuma credencial; funcionamento visual revisado. Não equivale a autorização para coletar dados.

**GO de piloto com pessoas reais somente se todos os itens abaixo tiverem evidência:**

- [ ] SEC-01 a SEC-11 passaram no backend real, com responsável e data.
- [ ] Não há vulnerabilidade crítica/alta aberta no escopo de acesso, fotos, contas e dados.
- [ ] Idade e identidade têm mecanismos e limites documentados; fraude e suspeita de menor têm fluxo testado.
- [ ] Moderação tem pessoas, escala, ferramentas, treinamento, recurso e cobertura crítica comprovados.
- [ ] Privacidade, termos, bases legais, contratos com operadores e retenções foram definidos para a operação concreta.
- [ ] Recuperação de conta, MFA de equipe, alertas, backups e resposta a incidentes foram exercitados.
- [ ] Usuário entende revelação bilateral e limitações de captura; nenhum plano pago ignora consentimento.
- [ ] Um responsável autoriza o piloto com relatório de riscos residuais e capacidade máxima.

**NO-GO:** foto protegida apenas no cliente; ausência de garantia de idade; denúncia fictícia em produto real; falta de moderador/escala crítica; logs com mensagens/fotos; acesso cruzado entre contas; credenciais no cliente; consentimento unilateral; coleta real na demo; qualquer P0 sem evidência. Aprovação do desenho ou teste visual não elimina esses bloqueadores.

Riscos residuais incluem captura de tela, mentira sobre gostos, fraude sofisticada, falso negativo de idade e abuso fora do app. A operação precisa medi-los e reduzir impacto continuamente, sem prometer “sem brechas”.
