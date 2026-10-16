# Trelelê V10 — mapa de UX a partir dos prints

Escopo desta entrega: dez arquivos efetivamente abertos por `view_image`, `IMG_1510.jpeg` e `IMG_1511.png` a `IMG_1519.png`; leitura de `mobile-beta/AGENTS.md`, `src/Prototype.tsx` e `src/Onboarding.tsx`; roteiros ECC Planner + Architect. Os outros 21 prints ficam com a equipe responsável. Não atribuo a eles observações que não fiz. Documento para implementar, não comprovação de implementação ou teste de aparelho.

**Legenda:** OBSERVADO = visível no print ou fonte indicada; INFERIDO = sequência/comportamento provável, não mostrado diretamente; ADAPTADO = decisão proposta para o Trelelê local.

## 1. Dez prints: tela, ação e estado

| Arquivo | OBSERVADO | Ação visível / transição proposta | O que não está comprovado |
| --- | --- | --- | --- |
| 1510.jpeg | Entrada vermelha; marca central; voltar; duas opções de acesso, Apple e telefone; links legais e ajuda de login. | ADAPTADO: abertura Trelelê → iniciar perfil local ou continuar perfil existente; opção de demonstração separada. | Nenhum login/OTP/servidor é demonstrado por uma imagem da entrada. Não criar botões Apple/telefone sem integração real. |
| 1511.png | Regras da casa, ícone, quatro blocos curtos, X e CTA “Eu aceito” no rodapé. | ADAPTADO: regras e privacidade do beta antes de preencher nome; aceitar → nome; X → abertura. | O print não mostra armazenamento do aceite nem a tela imediatamente anterior. |
| 1512.png | Pergunta única sobre nome; voltar; progresso fino no topo; campo com sublinhado; ajuda abaixo; teclado alfabético e controle de concluir acima dele. | Nome vazio → inválido; digitar → válido; fechar teclado mantém nome; avançar abre confirmação. | Validação de comprimento, caracteres e regra de nome não podem ser deduzidas do placeholder. |
| 1513.png | Mesmo nome preenchido; teclado fechado; scrim e confirmação central com nome; primário continuar e secundário editar. CTA da tela permanece visível atrás. | Continuar confirmação → aniversário; editar → campo do nome com valor preservado. | Ordem deduzida entre capturas, não vídeo da transição. Aviso de nome imutável é regra do Tinder visível; não impô-lo ao perfil local sem decisão própria. |
| 1514.png | Pergunta única de aniversário; data segmentada DD/MM/AAAA; teclado numérico; aviso de que só idade aparece; progresso maior. | Data válida adulta → continuar; data impossível/futura/menoridade → erro sem entrar na descoberta. | Erros e confirmação de idade não aparecem neste recorte. São aceites propostos do Trelelê. |
| 1515.png | Identidade de gênero, explicação, três opções principais, link de ajuda; checkbox separado de exibição pública; CTA cinza sem seleção. | Sem identidade → CTA desabilitado; escolher → estado 1516; controle de exibição independente. | O texto convida a selecionar opções, mas os prints não comprovam a cardinalidade total permitida. Não inferir algoritmo por essa frase. |
| 1516.png | Homem selecionado, borda e check vermelhos; CTA preto ativo; painel opcional de detalhes aparece logo abaixo da escolha. | Escolha principal válida basta para avançar; abrir detalhe → 1517; exibir no perfil continua separado. | Detalhes opcionais não podem virar requisito obrigatório. |
| 1517.png | Painel opcional expandido; descrições de identidades; conteúdo rolável e indicador lateral; chevron de recolher. | Expandir não muda etapa; selecionar detalhe não avança sozinho; recolher mantém seleção. | Não há evidência de outra rota/modal: a composição visível é expansão inline. |
| 1518.png | Mesmo painel rolado para outras opções, incluindo “Não listado”; pergunta/explicação permanecem no topo, CTA/checkbox continuam no rodapé. | Rolar apenas a região de opções; não rolar CTA para fora nem ocultar o estado principal. | Comportamento sticky é uma inferência forte entre dois estados, não medição do gesto. |
| 1519.png | Estado com Homem + detalhe cisgênero no resumo; item opcional destacado com borda/check; detalhe ainda expandido. | Detalhe escolhido persiste ao recolher/voltar; próxima etapa só pelo CTA. | Os prints não mostram o destino seguinte. Preferências de interesse não devem ser confundidas com identidade. |

**Ordem inferida do recorte:** entrada → regras → nome → confirmação de nome → aniversário → identidade de gênero → detalhe opcional. 1515–1519 são estados da mesma etapa, não cinco telas obrigatórias.

## 2. Medidas normalizadas para o layout

OBSERVADO por inspeção dos arquivos: PNGs 1511–1519 têm **1179 × 2556 px**. Dividir por três resulta em **393 × 852 CSS px**, proporção compatível com captura 3×; isso é uma inferência forte, não leitura de metadado `devicePixelRatio`. O JPEG 1510 é **1179 × 2391**, equivalente a 393 × 797 sob a mesma hipótese; está recortado/diferente e não deve calibrar a altura inteira.

| Elemento | Medida de referência / normalizada | Aplicação |
| --- | --- | --- |
| Conteúdo horizontal | Margem raw aproximadamente 60 px → **20 CSS px**, 5,1% da largura | Coluna única de 353 px em viewport 393; usar padding responsivo equivalente. |
| CTA de 1511 e 1516 | Medição por pixels escuros: raw x60–1118, y2232–2381 → **x20–372,7; y744–793,7** | Largura ~353 px, altura ~50 px, raio pill; ancorado ao footer, não à posição absoluta 744 de qualquer aparelho. |
| Reserva abaixo do CTA | ~58 px até limite 852 | Inclui respiro/safe area da composição; não somar isso novamente ao inset do runtime. |
| Linha voltar/progresso | Estimativa visual: centro em y~81 CSS; seta em x~38; trilho central x~138–255, altura ~4 | Header compacto, barra de progresso curta; não usar barra full width de outro modelo. |
| Título | Estimativa visual: início x20, y~133–141; fonte ~32, peso alto, entrelinha ~36–39 | Uma pergunta por etapa. Não copiar fonte exata sem arquivo identificado. |
| Texto de apoio | Estimativa ~16 px, entrelinha 21–23 | Blocos legíveis; negrito apenas para decisão/restrição. |
| Opções principais | Largura da coluna; pill observado ~40–44 px de altura | Adaptar alvos para pelo menos 44 px; borda neutra versus acento+check selecionado. |
| Input | Sublinhado fino, texto ~16, sem cartão cinza | Campo na mesma coluna; label e ajuda explícitos. |
| Confirmação de nome | Modal central ~76% da largura, canto muito arredondado; dois CTAs em coluna | Não substituir por uma nova tela longa; foco dentro do modal e retorno ao nome. |
| Teclado | 1512/1514 mostram área de teclado real do sistema, com ação de concluir próxima da borda superior | Não embutir screenshot de teclado no app publicado; runtime só no preview. |

Os números de header/tipografia/modal são aproximações visuais, não medidas laboratoriais. A única caixa calculada por amostragem de pixels nesta revisão foi o CTA nos prints 1511/1516. Validar o layout em 393 × 852 e em viewport menor sem alterar ordem nem sobrepor CTA/teclado.

## 3. Diferenças concretas no código atual

| Fonte atual OBSERVADA | Diferença para o recorte / risco | Mudança V10 proposta |
| --- | --- | --- |
| `Onboarding.tsx`, step0 | Abertura tem começar/demo, sem etapa de regras. | Manter entrada honesta local, acrescentar regras do teste antes dos dados. |
| step1 contém nome + nascimento + cidade | Três perguntas simultâneas substituem as etapas individuais dos prints. | Separar nome e nascimento; cidade entra em preferências/contexto, não precisa ocupar a primeira pergunta. |
| step2 contém identidade + interesse + intenção | Etapa densa; não há detalhe opcional de identidade nem controle separado de exibir no perfil. | Identidade, preferência por pessoas e intenção em etapas distintas; detalhe inline opcional; visibilidade separada. |
| Nome vai direto para próxima etapa | Falta confirmação mostrada em 1513. | Confirmar nome antes do aniversário, com editar preservando valor. Não anunciar irreversibilidade no beta. |
| `owner-header` + progresso full width e títulos próprios | Anatomia difere da referência. | Header/back/trilho curto; footer fixo; uma pergunta. Respeitar tema Trelelê e texto próprio. |
| `patch()` define `completed:false`; autosave grava na mesma chave do perfil concluído | Cancelar edição pode deixar o perfil confirmado substituído por rascunho; `leaveOwnerEditor()` lê incompleto e limpa cache de proprietário. | Separar `draft` e `confirmed`; somente Concluir substitui confirmado. Cancelar nunca apaga perfil publicado anterior. |
| Step4 já exige três IDs únicos; step5 já exige três fotos; `finish()` revalida | Invariantes existem no onboarding atual, ao contrário da versão anterior auditada em V8. | Preservar as verificações, divisão em etapas e estados de erro. Não reintroduzir 0–6 livros. |
| `Prototype.tsx` usa vários estados de aba/pessoa/chat/sheet | Botão interno existe, mas não há um contrato único de origem/Back para todo o fluxo. | Um stack de telas explícito; sheet é camada curta, não substituto para perfil/edição/configurações. |
| Pausa em `useState`; exclusão via reset direto no onboarding | Falta jornada de configurações clara, confirmação da exclusão e resultado consistente pós-limpeza. | Configurações → visibilidade/pausa e Configurações → apagar dados locais → confirmar → limpeza efetiva → abertura. |

Esta leitura é da versão atual no momento da revisão. O bloco V8 “onboarding ausente” não deve ser repetido como achado atual: onboarding e armazenamento de proprietário já foram adicionados desde então.

## 4. Jornada completa proposta para o Trelelê local

Tudo abaixo é **ADAPTADO**, exceto quando um print é indicado. Estados depois da identidade dependem da integração com os demais 21 prints da equipe; não afirmo tê-los observado.

| ID | Tela/estado | Ação primária | Voltar/cancelar | Requisito para saída |
| --- | --- | --- | --- | --- |
| E0 | Abertura | Iniciar perfil neste aparelho | Não há nível anterior | “Continuar” só se houver perfil local válido; demo é uma escolha separada. |
| E1 | Regras do teste (1511) | Aceitar e continuar | X → E0 | Explicar respeito, privacidade, maioridade e que o beta não conecta pessoas reais. |
| E2 | Nome vazio/preenchido (1512) | Próxima | Voltar E1 | Nome de exibição válido; teclado não cobre a ação. |
| C2 | Confirmar nome (1513) | Confirmar | Editar → E2 | Nome preservado; não copiar política de imutabilidade sem suporte próprio. |
| E3 | Nascimento (1514) | Próxima | E2 | Data válida e adulto; não mostrar data completa no perfil público. |
| E4 | Identidade (1515–1519) | Próxima | E3 | Escolha principal; detalhe opcional inline; exibição é escolha independente. |
| E5 | Quem quero conhecer | Próxima | E4 | Preferência por pessoas; não derivar de identidade ou leitura. |
| E6 | O que busco | Próxima | E5 | Intenção explícita; não transformar intenção em garantia de match. |
| E7 | Gêneros literários | Próxima | E6 | Ao menos um conforme regra atual; “gênero literário” distinguido de identidade de gênero. |
| E8 | Três livros | Próxima | E7 | Exatamente três obras únicas; buscar/selecionar/substituir sem perder anteriores. |
| E9 | Três fotos | Próxima | E8 | Exatamente três arquivos válidos no armazenamento local; erro por slot; conteúdo não é entregue a outros perfis. |
| E10 | Apresentação e revisão | Concluir perfil local | Voltar às etapas/edit | Revalidação conjunta de dados e arquivos; só aqui confirmar. |
| R1 | Descobrir | Ver perfil / passar / curtir | Raiz | Livros/opiniões primeiro; slots pessoais apenas placeholders até consentimento. Trocar mídia não vota. |
| P1 | Perfil de outra pessoa | Curtir, passar ou conversar se já conectado | Origem R1/R2/chat | Preservar pessoa/livro/scroll; ações não podem criar chat unilateral. |
| C1 | Deu liga | Puxar assunto | Continuar → origem | Uma reciprocidade, uma conexão; não permitir duas celebrações por mesmo evento. |
| R2 | Deu liga | Abrir conexão recíproca | Raiz | Apenas matches ativos; não reintroduzir lista de likes sem reciprocidade. |
| R3 | Conversas | Abrir thread | Raiz | Novas conexões sem mensagem separadas de histórico; horário vem do estado. |
| T1 | Thread | Enviar mensagem local | Aba de origem | Preservar draft/posição ao visitar P1; fechar teclado antes de navegar. |
| F1 | Regra da foto | Entender / consentir quando possível | T1/P1 | Janela experimental e turnos dos dois só habilitam escolha; dois aceites válidos revelam ilustração, nunca foto local do proprietário para personagem fictício. |
| R4 | Meu perfil | Editar / configurações | Raiz | Exibir perfil confirmado; três livros e três fotos próprias só para o dono no aparelho. |
| M1 | Editar meu perfil | Salvar alterações | Cancelar → R4 | Rascunho separado; cancelar conserva confirmado e arquivos anteriores. |
| S1 | Configurações | Abrir preferências / visibilidade / dados | R4 | Lista de opções reais; nenhum botão de “conta online” fictício. |
| S2 | Visibilidade / pausa | Pausar descoberta | S1 | Pausa preserva dados e conversas, tem estado visível e botão retomar. Não equivale a excluir. |
| S3 | Apagar dados deste aparelho | Prosseguir para confirmação | S1 | Explicar escopo: perfil, fotos locais e preferências do teste; sem promessa de apagar conta remota inexistente. |
| C3 | Confirmar apagar | Apagar meus dados locais | Cancelar → S3/S1 | Desabilitar repetição durante operação; só indicar sucesso quando limpeza concluir. |
| E0b | Resultado da exclusão | Recomeçar / demo | Abertura | Perfil/fotos/flags locais limpos; revogar objectURLs; erro mantém recuperação, sem sucesso falso. |

### Estado de navegação mínimo

`entry → onboarding(step) → app(root)`; dentro do app, `root → person`, `root → thread → person`, `profile → edit`, `profile → settings → visibility/delete`. `sheet` só para ajuda curta, seleção pontual e confirmação. Voltar fecha primeiro a camada, depois retorna à tela anterior com seus dados; nunca reinicia onboarding ou conversa por recomposição de componente.

O fluxo “voltar para corrigir nome” restaura rascunho, não uma nova pessoa. O fluxo “cancelar edição” volta ao perfil confirmado, não ao personagem demonstrativo. O fluxo “apagar” só volta à abertura depois de remover armazenamento; `setEntry('welcome')` sozinho não é exclusão.

## 5. Contratos de estado que a implementação deve preservar

1. `draft` pode ser incompleto; `confirmed` só muda em Concluir/Salvar após validar. Reabrir a edição não deve marcar o confirmado como incompleto.
2. Identidade, interesse, intenção e gêneros literários são campos distintos. `showIdentity` é independente de utilizá-la na configuração local; não anunciar uso algorítmico real que o beta não executa.
3. Back de etapa mantém o rascunho; detalhe opcional expandido não adiciona etapa ao progresso. Progresso mede etapas do Trelelê, não porcentagens copiadas do Tinder.
4. Fotos do proprietário continuam em armazenamento local, com objectURLs criadas apenas na visualização do dono e revogadas ao sair. Blur não é autorização; slots de terceiros são placeholders independentes.
5. Alterar foto/conjunto de mídia invalida os aceites correspondentes no domínio demonstrativo. Regras continuam locais; não prometer privacidade de servidor.
6. Pausa não exclui perfil e não encerra conversa. Retomar conserva escolhas. Como não há usuários reais, texto deve dizer o que acontece neste teste, sem alegar invisibilidade comprovada a terceiros.
7. Apagar trata falhas de storage; não exibir “apagado” se IndexedDB ou perfil falhar. Não criar recuperação por email, Apple, SMS ou OTP sem serviço real.
8. Teclado nativo fica sob responsabilidade do browser no app publicado. O simulador usa seu runtime; não copiar teclas dos screenshots para dentro da UI.

## 6. Aceite direto para QA

- Percorrer E0→E10 com rascunho vazio, nome confirmado/editado, nascimento válido e inválido, identidade com e sem detalhe, preferência/intenção e três livros/fotos.
- Nome vazio/identidade vazia mostram estado desabilitado; nenhuma etapa opcional vira bloqueio obrigatório. Não perder escolha ao expandir/recolher/rolar identidade.
- Em 393 × 852 e viewport menor, footer fica alcançável com e sem teclado; safe area não é contada duas vezes; texto expandido rola sem carregar CTA junto.
- Entrar no app e voltar de perfil/chat sem perder mídia/draft. Testar botões e Back real, não apenas chamar handlers.
- Editar perfil concluído, alterar campo, cancelar: confirmado anterior intacto; recarregar mantém o estado correto.
- Pausar, navegar para conversas, voltar e retomar: dados preservados. Não confundir com exclusão.
- Apagar com confirmação: recarregar retorna à abertura sem perfil/fotos antigas. Simular falha de limpeza e exigir erro recuperável.
- Nenhum botão de login/assinatura/telefone simula autenticação bem-sucedida. Nenhum original pessoal é requisitado pela galeria de personagem fictício.

## 7. Limite desta evidência

Os dez prints demonstram anatomia e estados de entrada/início do cadastro. Não mostram descoberta, matches, configurações, pausa ou exclusão. A jornada macro dessas áreas acima é proposta Trelelê ancorada no código e nas regras do produto; deve ser reconciliada com os outros 21 prints pela coordenação. Não é reprodução certificada do backend, algoritmo, políticas ou versão atual inteira do Tinder.
