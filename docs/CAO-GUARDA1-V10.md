# Cão de guarda 1 — visual e gestos V10

**PREFLIGHT APROVADO PARA IMPLEMENTAÇÃO. Não é aprovação de execução ou release.** Examinadas 31 imagens nas folhas de contato, com originais 1530, 1540 e 1545 ampliados. Browser não acionado: indisponibilidade de UI já relatada pelo responsável.

## Evidência observada versus adaptação

| Prints | Observado nas imagens | Aplicação autorizada ao Trelelê |
|---|---|---|
| 1510 | Entrada com marca, ações e informação de acesso | Preservar abertura e marca originais fornecidas; não inventar Apple/auth |
| 1511 | Regras de convivência e aceite | Regras reais do beta, sem prometer operação inexistente |
| 1512–1519 | Nome, confirmação, aniversário, identidade com opções adicionais; back/progresso/CTA | Etapas claras com rascunho preservado, idade 18+, identidade opcional; não copiar proibição de editar nome sem contrato |
| 1522 | Intenção em seis tiles | Escolhas reais da experiência; 3 × 2 só se texto legível |
| 1524–1528 | Hábitos, comunicação, interesses, fotos em grid, bio | Gêneros/livros/fotos/bio; hábitos não entram sem requisito |
| 1529–1531 | Permissão, convite ao tutorial, deck imersivo e navegação | Tutorial opcional e deck; sem GPS, notificações, online ou física de gesto alegados como observados |
| 1532–1533 | Explorar por categorias | Referência de agrupamento, não licença para criar contagens ou categorias falsas |
| 1534 | Curtidas e oferta comercial | Trelelê mantém somente reciprocidades ativas; sem premium fictício |
| 1535–1536 | Hub de perfil, fotos, interesses e acesso à edição | Hub coerente com dados disponíveis; três livros e três fotos privadas são adaptação explícita |
| 1537–1542 | Configurações agrupadas, valores, preferências, visibilidade, sair e exclusão | AccountFlow local com ações funcionais, sem fingir serviço online |
| 1545(1) | Confirmação final de exclusão e alternativa de congelar | Consequências locais claras, cancelar sem perda, exclusão concluída antes de voltar; sem copiar prazos de servidor/facial |

## Bloqueantes de composição

- Cadastro por pergunta: back/progresso, título claro, CTA fixa com espaço reservado no scroll e estado de seleção/desabilitado reconhecível. Pular apenas o que for opcional. Não reciclar seis formulários longos como se fossem o fluxo observado.
- Marca/paleta próprias permanecem. As referências ensinam fluxo e hierarquia, não autorizam descartar a identidade fornecida.
- Fontes e touch targets não encolhem para reproduzir chips dos screenshots. Texto de opção pelo menos 14, ação pelo menos 48. Grid de três fotos em 360 deve ter editor acessível; não encaixar Trocar/Remover em ícones minúsculos.
- Três livros públicos e três fotos privadas substituem as seis fotos públicas do Tinder como adaptação de produto. Nunca colocar arquivo de rosto atrás de blur; elegibilidade e aceite bilateral continuam obrigatórios.

## Gesto — plano mobile aprovado

Single card em área não interativa da mídia; x/y/rotação acompanham o dedo. Limiar inicial proposto max(72 px, 24% da largura), fling com dx mínimo 48 e razão horizontal 1,35, saída 220 ms: escolhas de implementação para testar, não propriedades comprovadas pelos prints estáticos.

Qualificar eixo antes de capturar. Scroll vertical nativo não pode ser sequestrado. Drag classificado não dispara clique de troca de livro ao terminar. Pointercancel, Escape e cancelamento retornam ao centro e invalidam callbacks atrasados. Um guard compartilhado entre gesto e botões confirma uma decisão para o ID correto; limpar ao desmontar. Perfil completo não arrasta pessoas.

Curtida recíproca recentra e congela o mesmo cartão para Deu liga, sem removê-lo antes. Reduced motion instantâneo; botões seguem alternativa acessível. Livros mudam por toque/progresso/botões, sem outro swipe horizontal concorrente.

## AccountFlow e cadastro — plano aprovado

Nove views propostas (nome, nascimento, identidade, quem conhecer, intenção, gêneros, livros, fotos, bio/revisão) são adaptação Trelelê. Não acrescentar hábitos por imitação. Draft deve sobreviver ao retorno entre etapas; erros ficam associados à etapa e não apagam seleções.

Settings com linhas de aproximadamente 56 e agrupamento funcional. Pausar é estado local, não prova de ocultação em servidor. Apagar confirma perfil/fotos/histórico locais conforme a implementação real; await da Promise antes do retorno, erro recuperável, sem storage.clear global. Não copiar telefone/e-mail das referências nem prometer conta online.

## Próximo gate

Revisar diff e fontes; classificador/testes devem cobrir cancelamento, eixos e idempotência. Render/gestos reais em 390/360 continuam bloqueados enquanto browser estiver indisponível. Não emitir aprovação de fluidez, teclado físico ou release a partir desta análise. Nenhuma fonte de implementação foi editada por este crítico.

## Gate final de fontes congeladas

**REVISÃO ESTÁTICA CONCLUÍDA — NENHUM P1 CONFIRMADO. GATE DE RENDER/INTERAÇÃO CONTINUA BLOCKED.** Não foram feitas alterações de implementação nem iniciadas novas tentativas de browser. Não solicitar novas mudanças por acabamento enquanto as fontes estão congeladas.

Escopo lido: Onboarding.tsx/onboarding.css, SwipeDeck.tsx/swipe-deck-state.mjs, AccountFlow.tsx/account-flow.css, campos literários/validação de profile-storage.ts e integração/MeuPerfil/CSS de Prototype. O diretório mobile-beta aparece untracked no git da raiz; portanto esta foi inspeção de fontes finais, não um diff versionado confiável antes/depois.

### Anatomia e conteúdo

Onze etapas com back, progresso, título sans claro e CTA fixa. canContinue condiciona nome, idade 18+, identidade, interesse, intenção, gênero literário, três livros distintos e três fotos; etapas literárias 7/8 seguem opcionais e têm Pular. A recomendação tem limite 200 e não virou requisito de conclusão. Defaults vazios preservam perfis legados. Revisão e MeuPerfil exibem gêneros, rotina de leitura, programas literários e recomendação como assunto de conversa. Não foram introduzidos julgamentos de aparência, bebida, astrologia ou compatibilidade algorítmica fictícia.

Literatura está presente em quatro blocos do cadastro (gêneros, rotina, programas, livros), recomendação opcional e perfil. Identidade/interesse/intenção continuam dados de encontros, coerentes com o produto, sem se tornarem teste de aparência. Copy em português é direta; não copia slogans ou “match” do Tinder como voz da marca.

### Gestos por fonte

Motion values acompanham x/y e rotação; classificação de eixo precede a decisão, pointer capture desativada e pan-y preservado. Token invalida callbacks atrasados; commit gate usa ID da pessoa; botões e drag compartilham requestDecision. Escape/cancel resetam; reduced motion omite animação de saída; reciprocidade recentra o cartão para celebração inline. Controles interativos são excluídos da origem do drag e cliques pós-drag são suprimidos.

Dois detalhes não bloqueantes: o wrapper envolve o cartão inteiro, inclusive texto não interativo, em vez de só a mídia; a etiqueta CURTIR/PASSAR aparece de modo binário após qualificação, enquanto deslocamento/rotação são proporcionais. Não descrever opacidade da etiqueta como proporcional nem afirmar fluidez observada. Nenhum destes detalhes exige redesenho agora; confirmar comportamento com scroll real quando UI voltar.

### Configurações

AccountFlow separa settings, pausa, apagar e informações; copy delimita aparelho/beta, não serviço online. Exclusão espera Promise, oferece Manter meus dados e mantém erro recuperável. Não há promessa de restauração em 90 dias ou reconhecimento facial copiada das referências. Foto local e consentimento não são substituídos por aparência.

### Riscos a verificar em 360, sem alegar falha observada

- Intenção em três colunas tem cerca de 100 px úteis por tile: font 14 e quebra estão presentes; verificar os rótulos mais longos.
- Fotos em três colunas mantêm Trocar/Remover em linhas de 48; verificar altura total, scroll e rodapé com teclado.
- Prompt da foto bloqueada em viewport curto continua exigindo inspeção de corte, conforme revisão V9.
- Recomendação de 200 caracteres sem espaços pode exigir overflow-wrap no bloco de perfil; não foi renderizada essa entrada extrema.

### Evidência de testes e limite de aceite

Responsável relata 41 testes mobile, 4 worker, 24 de domínio e 28 de integridade runtime, além de build verde. Não repetidos por este crítico. Teste de runtime/headless teve erro ambiental `uv_interface_addresses` do Vite em diagnóstico; isso não é resultado aprovado nem prova de bug do app. Sem browser disponível, não certificar onboarding com upload/reload/revisão, gestos reais, teclado físico, rotação ou publicação. A ausência de P1 estático não autoriza afirmar release visualmente validada.


## Registro de execução parcial — 16/10/2026

Relato direto do crítico após retomar o navegador: abertura conferida em 390×760 e 360×640; espaço de foto bloqueada do Descobrir observado em 360. Cadastro percorrido por regras, nome, nascimento adulto editado nativamente, identidade, interesse, intenção, gêneros, rotina literária, Pular programa e seleção de três livros distintos. A interface chegou à etapa 10/11, de fotos. O preenchimento inicial remoto da data alterou apenas o DOM; edição nativa disparou o estado React e habilitou Continuar. Não foi classificado como defeito do aplicativo.

O filechooser/setFiles travou o transporte por 291,8 segundos. Não houve confirmação de upload nem conclusão, edição, persistência, pausa ou exclusão pela interface nesta rodada. Testes automatizados de armazenamento são evidência separada. **Cadastro completo e release permanecem BLOCKED.** Não há P1 de upload demonstrado; há ausência de comprovação do caminho crítico.

A mancha branca na onda foi observada no verde. O crítico aprovou substituir apenas esse asset por duas curvas SVG nativas com fills exatos #14A859/#FE8A38, fundo branco e dimensões CSS preservadas. Root aplicou welcome-wave-clean.svg e passou build/runtime28; o resultado SVG ainda não foi observado na interface. Marca original preservada. Este registro resume mensagens do crítico; não substitui inspeção final após a correção.
