# Happn V4 — telas e fluxos comprováveis

Pesquisa em 16/10/2026. Aplicado ECC Planner para separar requisito, evidência, inferência e lacuna. Foram recuperadas páginas oficiais, baixadas doze imagens e abertas doze imagens reais. Nove evidências diferenciadas foram reunidas em `docs/research/happn/manifest.json`; origens e hashes completos também estão em `dist/research/happn/PROVENANCE.json`. Não houve login, inspeção de API privada, engenharia reversa de binário ou teste do aplicativo instalado.

## Conclusão útil para o Trelelê

O Happn oferece mais de uma forma de encontrar pessoas: descoberta de perfis, cruzamentos no mapa e afinidade por lugares. Há evidência visual de um **quadro de duas colunas**, vinculado a um Spot, numa publicação de design histórica. Não há prova nesta pesquisa de que esse quadro seja a home atual de todas as contas no Brasil.

Para o Trelelê, um quadro “Pessoas por perto” pode adaptar sua densidade e navegação. Antes de ter permissão e integração reais, mostrar cidade/bairro declarado e distância aproximada somente quando verdadeira. Não simular “vocês se cruzaram” nem expor coordenadas de pessoas.

## Classificação das fontes e datas

- **Atual observado em documentação**: artigo oficial Map atualizado em 15/10/2026, com três imagens. A tela de mapa tem Home, Vibes, Map, Likes e Chat.
- **Documentação de outra versão**: artigo SuperCrush atualizado em 04/06/2026; a imagem usa Explore, Browse, Map, Likes e Chat. Seu comportamento está documentado; os labels não devem ser tratados como universais.
- **Promocional disponível hoje**: screenshots da Google Play, cuja página indica atualização de app em 15/10/2026. Marketing pode combinar mockup, fotografia, decoração e UI. A data da loja não data cada captura.
- **Histórico observado**: Dribbble publicado por “Happn Design”. O perfil se identifica como equipe de design, mas não houve confirmação independente de controle da conta; a data exata não apareceu na extração. A menção externa a 2023 não foi comprovada. Não marcar como layout atual2026.
- **Documentado, revisão antiga**: artigos oficiais de2023–2025 ainda acessíveis. Podem explicar regras, mas não bastam para afirmar interface atual.

## Atlas de nove evidências vistas

| ID/arquivo no diretório de pesquisa | Observado | Limite |
|---|---|---|
| happn-1 / help-map-overview.png | Mapa2D, nome do bairro, agrupamentos32/1, pílulas de locais, centralização e abasHome/Vibes/Map/Likes/Chat. | Não sabemos o resultado de todos os botões laterais. |
| happn-2 / help-map-crossings.png | Tutorial em bottomsheet, fundo escurecido, paginação eNext. | Explicação de cruzamentos, não lista final. |
| happn-3 / help-map-spots.png | Segundo passo de tutorial, símbolos de lugares,ExploreyourMap. | Não documenta composição do grid atual. |
| happn-4 / play-3.png | Mapa promocionalLapa/Rio, miniaturas e aviso de posição exata em segredo. | Composição de marketing. |
| happn-5 / play-4.png | ConfirmaçãoCrush, X,Comeceaconversar eVejaoperfil. | Ação de fechar é visível; seu destino exato não foi executado. |
| happn-6 / play-5.png | Nome/idade/selo, prompt sobre restaurante,Responder e foto seguinte. | Recorte de perfil. |
| happn-7 / play-6.png | Cabeçalho da conversa, resumo de cruzamentos, bolhas e cartão de local. | Campo de envio não aparece. |
| happn-8 / help-supercrush.png | Perfil individual grande, açõesBoost/X/coração/estrela, abasExplore/Browse/Map/Likes/Chat. | Outra nomenclatura em relação ao Map mais recente. |
| happn-9 / historical-main-screens.png | MapaSpot→sheet com nome/contador→grid2colunas; perfil; confirmaçãoCrush. | Histórico e autoria autoidentificada. |

As imagens são evidências, não ativos licenciados para reutilizar no produto. Não usar essas pessoas como usuários fictícios. Um atlas de pesquisa deve exibir fonte e classificação ao lado, separado da descoberta de pessoas do aplicativo.

## Inventário de superfícies, ações, destino e retorno

“Documentado” indica Help oficial; “observado” indica imagem aberta; “inferido” indica reconstrução proposta ainda não executada.

| Superfície | Entrada e ações | Resultado comprovável | Retorno e estados não vistos | Evidência |
|---|---|---|---|---|
| Home / Timeline | Acesso principal; perfis por cruzamentos e preferências recíprocas. | Help descreve ordem cronológica e complementação com perfis da região. | Ordenação exata na versão nova, paginação, skeleton e erro são lacunas. | S1,S2; documentado2024. |
| Quadro de pessoas | Tela histórica de Spot; dois perfis lado a lado;X/coração em cada tile. | Grid e ações são observáveis. | Toque no tile→perfil e manutenção da rolagem são inferências de implementação; não executados. | I9; observadohistórico. |
| Map | AbaMap; clusters eSpots; botões laterais. | AtualHelp explica agrupamentos e locais, sem rota/posição exata. | Permissão negada, offline e carregamento não vistos. | S3,I1–I3; atualdocumentado/observado. |
| Seleção de cruzamento | Ampliar mapa; tocar número; preview inferior; tocarpreview. | Help descreve abertura dos perfis associados. | Voltar ao mesmo viewport e cluster é recomendação própria. | S4; documentado2024. |
| Spots | Pelo mapa ou seçãoSpots do perfil; selecionar lugar favorito. | Local reúne pessoas por afinidade declarada. Disponibilidade por cidades. | Sheet exato da versão2026 não comprovado; históricoI9 mostra lista. | S5,I9. |
| Perfil de outra pessoa | Perfil individual; fotos/dados/respostas;Like/X/SuperCrush. | PromptResponder e ações visíveis;Like recíproco permiteCrush. | X como ocultar tem regra específica a confirmar; não supor que bloqueia. | I6,I8,S6. |
| Like / limite | Interesse no perfil. | Limite diário e aviso documentados; assinatura retira limite. | Número do limite e formato do paywall não confirmados. | S7; documentado2024. |
| Crush | Likes dos dois ou aceitaçãoSuperCrush. | Confirmação com conversar/verperfil observada; chat liberado. | Fechar para origem é inferência; estado persistido requer backend. | I5,I9,S6,S8. |
| SuperCrush | Estrela azul na parte inferior do perfil; mensagem contextual ou semtexto. | Aceitar criaCrush e resposta; recusar impede novos cruzamentos, sem revelar recusa. | Compra/crédito insuficiente e validação de texto não observados. | S8,I8; documentado2026. |
| Likes recebidos | Messages ou aba dedicada conforme versão. | Assinatura permite saber quem curtiu e retribuir. | Lista vazia, ocultaçãofree e preços não comprovados visualmente. | S9; documentado2024. |
| Chat/lista | Crush→conversa; açãoEnviar e menu. | Bolhas/contexto vistos; Help2024 descreve texto. | Não prometer mídia/voz atuais; erroenvio/lido/teclado não vistos. | I7,S6,S10. |
| Remover conversa | ListaMessages com arrasto à esquerda ou menu3pontos. | Ação de exclusão documentada. | Efeito sobreCrush/outro usuário e confirmação precisam de fonte específica. | S11; documentado2023. |
| Preferências | MyAccount→MyPreferences; gênero/idade;Morecriteria pago. | Ajustes e critérios premium documentados. | Aplicação retroativa varia; Help2024 diz novos cruzamentos. Não copiar regra sem testar. | S12,S13. |
| Meu perfil/editar | Foto→Edit; + adiciona, Xremove; cortar e confirmar. | Cadastro requer foto; edição documentada. | UI completa, uploadfalho e moderação não vistos. | S14; documentado2025. |
| Certificação | Editarperfil→Let’sgo→gesto em vídeo. | Verificação e tentativa novamente documentadas. | Não implementar biometria simulada; contrato/retencão exigem decisão própria. | S15; documentado2024. |
| Settings/privacidade | MeuPerfil→Settings→Sharemycrossinglocations. | Desligar compartilhamento impede aparecer em mapas alheios segundoHelp. | Estado atual completo do painel não capturado. | S16; documentado2024. |
| Pausa | Foto superior→Settings→Pausemyaccount→confirmar. | Conta fica invisível; reativação porlogin; dados preservados. | Dialog exato não visto. | S17; documentado2024. |
| Safety/denúncia | Fim do perfil→ReportandBlock ou chat→3pontos→BlockandReport→motivo. | Caminhos e motivos documentados. | Confirmação final e acompanhamento de denúncia não vistos. | S18; documentado2025. |
| Boost/loja | Compraunitária/pacote; ativar. | Help descreve visibilidade temporária em destaque. | Duração, preço e cobrança não auditados. | S19; documentado2024. |

## Fluxos reconstruídos com fronteira de evidência

1. **Cruzamentos**: Home→Map→ampliar→cluster numerado→preview inferior→perfis associados. Esses passos são documentados. Selecionarperfil→perfil completo→voltar ao mesmo ponto é reconstrução sugerida; preservar filtro, scroll e viewport no Trelelê.
2. **Lugar em comum**: declararSpots no perfil→mapa ou seçãoSpots→lugar→pessoas associadas. O grid2colunas foi observado em material histórico. Nosso quadro regional não deve ser apresentado como cópia exata dessa versão.
3. **Interesse recíproco**: perfil→Like→aguardar interesse inverso→Crush→conversar. Não transformar curtida unilateral numa conversa autorizada.
4. **Mensagem em destaque**: perfil→estrela→contexto/mensagem→enviarSuperCrush→destinatário aceita→Crush/chat, ou recusa→sem novoscruzamentos. Os efeitos estão documentados; editor e envio não foram vistos integralmente.
5. **Controle da descoberta**: MeuAccount→preferências→salvar→novos perfis elegíveis;Morecriteria pode levar a assinatura. Precisamos de estados de zero resultados e remoção de filtros no nosso app, embora não tenham sido vistos no Happn.
6. **Segurança**: perfil/chat→ReportandBlock→motivo; retorno à lista segura é requisito próprio. Não manter acesso ao bloqueado por linksdiretos, notificações ou cache.
7. **Monetização**: Likesrecebidos/critériosextras/limiteLikes/Boost são gatilhos documentados. Paywall→checkout→sucesso/cancelamento/falha não foi auditado; não declarar fluxo pago completo.

## Lacunas que impedem chamar isto de varredura de todas as telas

Onboarding completo, permissões do SO, lista decruzamentos atual, quadroBrowse/Vibes2026, todos filtros, listasLikesfree/premium, checkout, notificações, estadosvazios, apagamento/erro de conta, denúncia submetida e reativação não foram executados. Nenhuma hipótese de UI acima é evidência de implementação interna.

A páginaPress oficial contém “Latestscreens”, mas o extrator não retornou os itens e a tentativa deHTML direto retornou conteúdo semimagens; o arquivo recebido foi mantido em `dist/research/happn/press-source.html`. Não alegamos ter visto essa galeria. O arquivoDribbble permite analisar uma composição de design; não é substituto de teste no app.

## Fontes primárias e evidências

I1–I3: [What is the Happn Map — atualizado15/10/2026](https://support.happn.fr/hc/en-us/articles/15703631805853-What-is-the-happn-Map).
I4–I7: [GooglePlayBrasil](https://play.google.com/store/apps/details?id=com.ftw_and_co.happn&hl=pt_BR).
I8/S8: [SuperCrush — atualizado04/06/2026](https://support.happn.fr/hc/en-us/articles/15706830983581-What-s-a-SuperCrush).
I9: [HappnDesign — MainScreens, histórico](https://dribbble.com/shots/21734525-New-Happn-App-Main-screens).

| Fonte | URL oficial |
|---|---|
| S1 Home | https://support.happn.fr/hc/en-us/articles/15702776421405-Who-are-the-profiles-that-show-up-on-my-Main-Page |
| S2 Ordem/Mapa | https://support.happn.fr/hc/en-us/articles/15703423225373-How-can-I-find-the-people-I-have-crossed-paths-with |
| S3 Mapa atual | https://support.happn.fr/hc/en-us/articles/15703631805853-What-is-the-happn-Map |
| S4 UsarMapa | https://support.happn.fr/hc/en-us/articles/15703661623581-How-can-I-use-the-map |
| S5 Spots | https://support.happn.fr/hc/en-us/articles/15701157304477-Enjoy-happn-Spots |
| S6 Conversar | https://support.happn.fr/hc/en-us/articles/15703060596893-How-can-I-start-a-conversation-with-someone |
| S7 LimiteLikes | https://support.happn.fr/hc/en-us/articles/20226638654109-Why-can-t-I-give-more-Likes |
| S8 SuperCrush | https://support.happn.fr/hc/en-us/articles/15706830983581-What-s-a-SuperCrush |
| S9 Likesrecebidos | https://support.happn.fr/hc/en-us/articles/15707074795421-What-is-the-List-of-people-who-have-Liked-you |
| S10 Mensagens | https://support.happn.fr/hc/en-us/articles/15703125634589-What-kind-of-messages-can-I-send-to-my-Crushes |
| S11 Removerconversa | https://support.happn.fr/hc/en-us/articles/15703165240861-Can-I-delete-a-conversation |
| S12 Preferências | https://support.happn.fr/hc/en-us/articles/15705637422621-How-can-I-change-my-preferences-for-the-people-I-cross-paths-with |
| S13 Critériosextras | https://support.happn.fr/hc/en-us/articles/15707166337309-Can-I-narrow-down-my-search-using-specific-criteria |
| S14 Fotos | https://support.happn.fr/hc/en-us/articles/15705377489949-How-can-I-add-or-delete-pictures-on-my-profile |
| S15 Certificação | https://support.happn.fr/hc/en-us/articles/15705484208925-How-can-I-certify-my-profile |
| S16 Compartilharlocal | https://support.happn.fr/hc/en-us/articles/15703705375517-I-do-not-want-to-appear-on-other-users-happn-Maps-What-Can-I-do |
| S17 Pausa | https://support.happn.fr/hc/en-us/articles/20372052592797-How-can-I-hide-my-account |
| S18 Denúncia | https://support.happn.fr/hc/en-us/articles/15715885819037-Can-I-report-a-profile-that-seems-suspicious |
| S19 Boost | https://support.happn.fr/hc/en-us/articles/15706982473117-What-is-Boost |

Manifest contém links diretos das imagens, sourcePage, legenda, observação, limites, data e hashes. IDs locais do motor de pesquisa: Map `turn77view2`, usoMap `turn77view3`, Spots `turn81view3`, SuperCrush `turn81view4`, Preferências `turn86view0`, denúncia `turn86view3`, Boost `turn98view0`, históricoDribbble `turn90view1`.
