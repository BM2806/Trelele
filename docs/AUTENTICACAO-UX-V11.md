# Autenticação — experiência proposta V11

Documento de preparação. Não adiciona botões nem transforma o beta local em uma rede de pessoas. O backend isolado está em construção; sua disponibilidade não comprova integração completa com o aplicativo.

## Entrada e limites

**E-mail com código é a entrada padrão**, sem senha e sem telefone obrigatório. A opção só aparece ativa quando o backend e o envio transacional de e-mail estiverem funcionando. Apple e Google aparecem apenas quando suas capabilities estiverem habilitadas e os respectivos callbacks tiverem sido verificados. Não desenhar três botões sem destino real.

“Começar” poderá abrir essa entrada depois da integração aprovada. “Conhecer a demonstração” continua sendo uma escolha separada, com dados locais e pessoas fictícias. A marca original do Trelelê permanece; esta proposta não autoriza outra logo.

## Estados e textos

| Estado | Apresentação e ação |
| --- | --- |
| Capacidades carregando | Aguardar a verificação, sem habilitar provedores por suposição. |
| Serviço indisponível | “Não conseguimos abrir sua conta agora. Tente de novo em instantes.” Ação “Tentar novamente”; demonstração continua identificada como tal. |
| Escolha da entrada | E-mail como caminho principal; Apple e Google somente se disponíveis. Sem telefone obrigatório. |
| Digitar e-mail | “Qual é o seu e-mail?” Campo com teclado adequado e botão “Receber código”. Validar formato sem inventar uma consulta de existência da conta. |
| Pedido em andamento | “Pedindo seu código…”; impedir pedidos duplicados enquanto a requisição está em curso. |
| Pedido aceito | “Confira seu e-mail.” Mostrar o endereço e “Trocar e-mail”. Não afirmar que a mensagem chegou à caixa de entrada. |
| Digitar código | “Digite o código para continuar.” Um único campo, com colagem, teclado numérico e preenchimento automático quando suportado. O tamanho vem da configuração. |
| Verificando | “Conferindo…”; bloquear novo envio enquanto a verificação está em curso. |
| Código inválido | “Esse código não conferiu. Dá uma olhada e tente de novo.” Preservar o endereço. |
| Código vencido | “Esse código venceu. Peça outro para continuar.” |
| Reenvio permitido | Botão “Pedir outro código”. Após pedido aceito: “Vale o código que você acabou de pedir.” Não dizer “o último que chegar”: e-mails antigos podem chegar atrasados. |
| Limite temporário | “Espere um pouco antes de tentar de novo.” Exibir prazo apenas se fornecido pelo servidor; o relógio da interface não substitui o limite no backend. |
| Falha de rede ou envio | “Não conseguimos pedir seu código agora. Tente de novo.” Nenhum sucesso simulado. |
| OAuth cancelado | Voltar à escolha da entrada, sem tratar o cancelamento como conta criada. |
| OAuth retornou | Consultar a sessão oficial antes de avançar. Um callback aberto ou parâmetro de URL não comprova autenticação. |
| Sessão confirmada | Buscar o perfil pertencente ao `userId` da sessão. Se faltar cadastro, continuar o cadastro; não apresentar o perfil como concluído. |

Voltar da etapa de código permite corrigir o e-mail e limpa o código digitado. Códigos não entram em URL, logs ou armazenamento persistente do frontend. Ao sair da tela, ignorar respostas atrasadas de um pedido anterior. As telas de acesso usam cabeçalho com voltar e conteúdo rolável; não exibem navegação principal do aplicativo.

## Contrato com o backend em construção

O contrato atual de `GET /api/auth-status` informa `ready`, `providers: {google, apple, emailOtp}`, `profilePersistence`, `privatePhotoStorage: false` e `socialNetwork: false`. O serviço responde 200 quando pronto e 503 quando indisponível. Não retorna segredos nem credenciais dos provedores.

O cliente usa os métodos oficiais do Better Auth: `signIn.social`, `emailOtp.sendVerificationOtp` com `type: 'sign-in'`, `signIn.emailOtp`, `getSession`/`useSession` e `signOut`. Não criar endpoints paralelos de login. O reenvio proposto usa rotação do código; erros e limites devem ser mapeados a partir de respostas reais.

`GET/PUT /api/profile` são protegidos pela sessão e tratam somente os metadados do próprio usuário. O contrato é `metadataOnly: true`, `photosSupported: false`: não recebe originais, URLs de fotos nem um `completed` enviado pelo cliente como prova de prontidão. As **três fotos continuam locais**, sem armazenamento de mídia privada no servidor. Autenticação e persistência de metadados não autorizam anunciar uma rede social ou um cadastro remoto completo.

## Separação de identidade e dados

O `userId` confirmado pelo servidor é a identidade da conta. Nome, e-mail ou foto do provedor não substituem essa identidade. Nunca usar a foto do Google ou Apple como retrato público do aplicativo.

Os dados legados do beta estão em chaves e IndexedDB locais sem vínculo com uma conta autenticada. **Não importá-los automaticamente**, nem carregá-los como se pertencessem a quem acabou de entrar. O padrão é separar demonstração local e conta. Qualquer migração futura precisa de escopo próprio, confirmação explícita e associação inequívoca ao proprietário; fotos não devem ser enviadas implicitamente durante o login.

Ao sair ou trocar de conta, limpar estado em memória, requisições pendentes, previews temporários e caches daquela identidade antes de carregar outra. Dados autenticados devem ser separados por proprietário, sem reutilizar as chaves anônimas do beta. Não vincular contas automaticamente apenas porque um e-mail ou nome parece igual; a política de associação deve ser explícita e revisada no servidor.

“Apagar dados deste aparelho”, “Sair” e “Excluir conta” são ações distintas. A exclusão de conta só pode ser anunciada após confirmação do servidor, com a sessão recente exigida; a limpeza local não equivale a excluir uma conta online. Não substituir o fluxo local atual por esse rótulo antes da integração.

## Gates antes de ativar a experiência

1. Confirmar capacidades reais, entrega de e-mail, expiração, tentativas, reenvio e limites no servidor; OAuth com retorno e cancelamento funcionais.
2. Confirmar sessão e autorização por proprietário em leitura, edição e exclusão de metadados. Testar alternância entre duas contas sem vazamento de estado local ou fotos.
3. Manter idade e requisitos do perfil separados da autenticação. Uma sessão válida não torna alguém elegível nem conclui o cadastro.
4. Explicitar a ausência de mídia privada remota e rede social enquanto `privatePhotoStorage` e `socialNetwork` forem falsos. Não prometer recuperação das fotos em outro aparelho.
5. Fazer preflight visual e testar o fluxo real no celular, incluindo teclado, colagem de código, erro, voltar e logout. Só então ativar entradas na UI publicada.

## Fontes primárias verificadas

- [Better Auth — Email OTP](https://better-auth.com/docs/plugins/email-otp): envio, entrada com código, configuração de validade/tentativas e reenvio.
- [Better Auth — Google](https://better-auth.com/docs/authentication/google): integração do provedor.
- [Better Auth — Apple](https://better-auth.com/docs/authentication/apple): credenciais e configuração do provedor.
- [Better Auth — Users & Accounts](https://better-auth.com/docs/concepts/users-accounts): identidade e política de vinculação de contas.

Consulta em 16/10/2026. A arquitetura deve fixar a versão do backend; este documento define a experiência desejada, sem afirmar que os provedores já estão configurados.
