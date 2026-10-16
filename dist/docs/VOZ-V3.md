# Voz V3 — revisão de todos os textos

16/10/2026. Auditoria de dist/app.mjs e dist/index.html. Não alterei esses arquivos. Dados e textos novos em dist/copy.mjs, prontos para integração.

## Nome adotado

O usuário escolheu **Trelelê**. Essa grafia substitui Margem na marca e nos títulos do protótipo; não é escolha pendente. Descritor direto: “Namoro por livros”. Manter o tom adulto e comum definido abaixo; o nome não justifica slogans rimados ou gírias forçadas. Consulta preliminar de usos está em NOMES-V3.md; não há promessa de disponibilidade de marca. Esta tarefa alterou somente os documentos; arquitetura aplica o nome no app.

## Decisão de linguagem

PT-BR de adultos comuns. Interface curta e direta. Perfis têm trabalho, bairro, hábitos e opiniões particulares; não funcionam como chamadas de anúncio. Livros dão assunto, sem transformar todas as pessoas em escritores de aforismos. Tirar metáforas de história, página, conexão, frases de efeito, paralelismos de café/suspense e gíria acrescentada só para parecer espontâneo. Não prometer detector de IA: a revisão trata de naturalidade, contexto e diversidade de vozes.

Demo deve permanecer visível em faixa global. Nos pontos de risco — mensagens, denúncia, foto e assinatura — explicar a simulação localmente. Fora desses pontos, evitar repetir “cenário fictício” em cada ação. Não afirmar bloqueio real, atendimento humano, proteção real de foto ou compra ativa.

## Perfis reescritos integralmente

| Pessoa | Opinião inicial | Bio |
| --- | --- | --- |
| Ana | Reli A hora da estrela este ano. Na escola eu não tinha gostado. | Sou professora, moro na Pompeia e tenho um cachorro que não me deixa dormir até tarde. Gosto de cozinhar para os amigos. |
| Davi | Levei um tempo para acostumar com a pontuação do Saramago. Valeu insistir. | Trabalho com TI. Pedalo de manhã quando consigo e jogo futebol mal, mas vou toda semana. Prefiro bar onde dá para ouvir a outra pessoa. |
| Bia | Gostei de Tudo é rio, mas tenho umas ressalvas sobre o final. Sem spoiler aqui. | Sou nutricionista. No sábado tento correr e geralmente acabo na padaria. Estou aprendendo cerâmica e ainda só fiz potes tortos. |
| Léo | Comecei A vegetariana sem saber nada sobre o enredo. Foi uma boa escolha. | Moro em Botafogo e trabalho com produção. Vou à praia até no dia nublado. Procuro alguém para sair, conversar e ver no que dá. |
| Lia | Torto arado foi o último livro que dei de presente. A pessoa gostou, ainda bem. | Sou arquiteta. Faço aula de dança às terças e tenho mais plantas do que espaço. Gosto de marcar um café sem passar três semanas combinando. |

Há também três opiniões específicas por pessoa em bookOpinions. A troca de livro deve trocar a opinião no card, quando aplicável. Não atribuir a mesma opinião global do catálogo a todos. Catálogo mantém IDs para compatibilidade; “Ensaio sobre a cegueira” passa de classificação genérica de Suspense para Ficção no cadastro do livro. Categoria de filtro do perfil não é uma classificação bibliográfica definitiva.

## Mapa literal de microcopy

| Texto anterior | Texto V3 |
| --- | --- |
| No seu tempo. | Você pausou a descoberta |
| Chegamos à última página. | Não há mais perfis por aqui |
| Alguém gostou das suas histórias. | Quem curtiu seu perfil. |
| As fotos continuam guardadas. | As fotos continuam ocultas. |
| Sua próxima história está por aí. | Você ainda não recebeu curtidas |
| Seus interesses enviados | Curtidas que você enviou |
| Aguardando interesse mútuo | Ainda não deu match |
| Um interesse mútuo abre uma conversa. | Seus próximos matches aparecem aqui. |
| Vamos começar pelo assunto? | Nenhuma conversa por enquanto |
| Vocês já têm um livro para começar. | Vocês deram match. Que tal mandar um oi? |
| Foto oculta · conversa aberta | Foto oculta |
| Vocês deram match por livros ♡ | Conversa de teste |
| Personagem fictício | Perfil de teste |
| Mais uma página de vocês. | Fotos liberadas |
| Primeiro, a conversa. | A foto ainda está oculta |
| Podemos revelar? | Quer mostrar sua foto? |
| Seu aceite está registrado | Você escolheu mostrar |
| Quero revelar | Quero mostrar minha foto |
| Retirar meu consentimento | Deixar de mostrar minha foto |
| Entender a revelação | Quando a foto aparece? |
| Comece por uma boa pergunta… | Escreva uma mensagem |
| Seu perfil começa pelos livros. | Seus livros aparecem no lugar da foto. |
| Minha estante | Meus livros |
| Uma nova forma de dar match | Sobre este teste |
| Antes da foto, uma conversa. | Como funciona a foto |
| Você escolhe como continuar | Opções da conversa |
| Bloquear personagem | Bloquear perfil |
| Encerrar conexão | Desfazer match |
| Encerrar esta conexão? | Desfazer este match? |
| Motivo do cenário | Motivo |
| Bloquear também neste cenário | Bloquear este perfil também |
| Registrar apenas na demo | Salvar neste teste |
| Salvar no cenário | Salvar |
| Reiniciar demonstração | Recomeçar o teste |
| Aplicar preferências | Aplicar filtros |
| Quero conhecer alguém | Quero conhecer alguém |
| Busco uma relação | Quero namorar |
| Aberto a possibilidades | Ainda não sei |
| Um match já abriu esta história. Encontre a conversa na sua caixa. | Vocês já deram match. A conversa está na aba Conversas. |
| Ainda não há uma pessoa para voltar. | Você ainda não passou nenhum perfil. |
| Última pessoa disponível novamente. | O perfil anterior voltou. |
| 24h e turnos alternados simulados. Faltam os aceites dos dois. | Conversa e prazo simulados. Agora falta a escolha de cada pessoa. |
| Seu aceite está registrado em privado nesta simulação. | Você escolheu mostrar sua foto neste teste. |
| Aceite do personagem simulado. | A escolha do outro perfil foi simulada. |
| Novos acessos revogados. Isso não apaga uma imagem já vista. | A imagem não aparece mais aqui. Isso não apaga o que a outra pessoa já viu. |
| Retrato alterado: os dois aceites foram reiniciados. | A imagem mudou. Os dois precisam escolher mostrar de novo. |
| A conversa ainda não está elegível. Use os controles da simulação para testar. | Ainda falta tempo ou resposta dos dois. Você pode usar os botões de teste. |
| Ação indisponível neste cenário. | Não foi possível fazer isso agora. |
| Use idades de 18 a 99; a mínima não pode superar a máxima. | Escolha idades entre 18 e 99 anos. A idade mínima precisa ser menor ou igual à máxima. |

## Blocos que precisam de integração, além da troca literal

- Perfil: substituir arrays books/profiles/me locais pelos exports. Clonar me antes de editar, caso necessário. Não substituir nomes reais do usuário; Bruno é somente persona fictícia.
- Match: trocar “Você e [nome] já têm uma história em comum.” por strings.matchLine(nome).
- Afinidade: livros realmente compartilhados geram strings.sharedBooks(títulos); zero compartilhados usa strings.noSharedBooks. Não inventar afinidade de gosto ou personalidade.
- Chat inicial: usar seedChat; Lia pergunta sobre outros livros do Itamar e Bruno pede indicação. Próxima resposta sugerida para teste: Salvar o fogo.
- simulateConversation: usar simulatedDialogue e nextDemoLine(id, from, mensagens). Alternar o lado seguindo última mensagem, adicionar falas ainda não usadas e parar se null. Nunca cair em duas frases genéricas dentro de loop.
- Resposta simulada/automática: usar a próxima fala de simulatedReplies/nextDemoLine, sem repetir. Se esgotar, avisar “As respostas deste teste acabaram.” e não fingir nova pessoa escrevendo.
- As falas demonstrativas têm roteiro finito: não prometer resposta contextual livre a qualquer mensagem digitada. Preferir botão explícito “Adicionar resposta de [nome]” a resposta automática que parece real.
- Autoria: na conversa, nome do perfil no lugar de “Personagem fictício”; faixa/ajuda deixa claro que é teste.
- Foto: usar strings.revealRule. Texto integral: “É preciso esperar 24 horas depois de os dois começarem a responder e conversar pelo menos cinco vezes de cada lado, alternando as respostas. Várias mensagens seguidas contam como uma vez.”
- Escolha: usar strings.revealReadyBody e strings.revealAcceptedBody; não informar que a outra pessoa está esperando, nem exigir revelação para seguir no chat.
- Revogação: descrever interrupção de exibição futura, sem prometer apagar capturas ou o que já foi visto.
- Formulário de denúncia: strings.reportBody explícito e botão de salvar localmente. Nunca “enviar denúncia” nesta demo sem serviço.
- Assinatura: strings.subscribeTitle/Body; preço hipotético, nenhum checkout ativo.
- index.html: “Demo · perfis fictícios” → “Teste com perfis fictícios”; descrição: “Teste de um app de namoro por livros. Os perfis e as conversas são fictícios.”; “Pular para conteúdo” pode permanecer. Aplicar Trelelê, nome escolhido pelo usuário, com a mesma grafia no título, marca e rótulos acessíveis.
- Estúdio: rótulo pode ser “Sobre o teste e arquivos”; documentação técnica fica nessa área, não nos cards e bios.

## Exports para integração

books, profiles, me, seedChat, simulatedDialogue, simulatedReplies, nextDemoLine, strings, replacements. Não inserir falas via innerHTML sem escape. nextDemoLine não mantém cursor global: verifica mensagens existentes e retorna a próxima não usada ou null. O frontend deve impedir duplo envio da mesma resposta se houver timer.

## Revisão antes de publicar

Verificar todas as telas, diálogos, toasts, labels acessíveis, vazios e erros. A mera existência do módulo não significa integração concluída. node --check de copy.mjs passou. QA recebeu exports para executar o módulo real. Naturalidade é julgamento editorial; repetição e consistência podem ser verificadas automaticamente.
