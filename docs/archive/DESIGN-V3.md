# Trelelê — direção de aplicativo celular V3

Nome escolhido pelo usuário em 16/10/2026; antes chamado Margem. A escolha para o protótipo não certifica disponibilidade de marca. O produto pretendido é um app Android/iOS; esta entrega continua sendo um protótipo mobile por link, sem binário nativo ou backend.

## Composição e referências

Direção social contemporânea, cobalto/papel: fundo claro, texto escuro, acento #2449D8. Uma família tipográfica variável, Plus Jakarta Sans, foi obtida do repositório oficial Google Fonts e incorporada localmente com OFL. Os ícones estruturais vêm do Phosphor oficial, com licença MIT e sprite local. REFERENCIAS-V3.md registra fontes, alternativas, observações e decisões próprias. Não há alegação de reproduzir fontes ou código interno de concorrentes.

O shell conserva largura de aparelho, no máximo 480 px, altura dinâmica e safe areas. Desktop exibe a mesma experiência de celular. Descobrir contém uma pessoa por cartão: capa plana proporcional, nome, idade, opinião específica daquele livro e ações. Foram removidos o livro inclinado, o segundo livro cenográfico e o fundo desfocado. Não há landing page, hero ou colunas laterais.

## Navegação

Quatro destinos estáveis: Descobrir, Curtidas, Conversas e Perfil. Headers mostram o contexto da tela atual. Conversa é tela dedicada com voltar, pessoa e segurança; a barra global e as abas saem desse detalhe. Rotas distinguem inbox e pessoa. Perfil abre apresentação; a edição é uma ação separada. Referências, arquivos e simulações ficam no menu do aviso de teste, fora do histórico de mensagens.

Toque lateral troca o livro da mesma pessoa; arrasto horizontal ou botões decidem sobre a pessoa. Scroll vertical e arrasto cancelado não curtem. Novos matches sem mensagens aparecem separados das conversas já iniciadas. Detalhes e formulários têm fechar/cancelar, confirmação explícita de escolhas e retorno de foco.

## Voz

VOZ-V3.md e copy.mjs centralizam as decisões. Pessoas fictícias falam de trabalho, rotina e opiniões específicas; não narram slogans. Cada perfil tem opiniões por livro e um roteiro próprio. Respostas de teste são finitas e acionadas como simulação; o aplicativo não finge improvisar conversa humana. Estados vazios, consentimento e ações usam linguagem direta. Nada de porcentagem amorosa inventada ou promessa de proteção real em JavaScript.

## Consentimento e limites

A espera de 24 horas e cinco turnos alternados por lado é uma hipótese de produto. Cumprir os critérios abre uma escolha; não mostra automaticamente retratos. Ambos precisam consentir. Imagens da demonstração são ilustrações fictícias. Backend, mídia privada, verificação de idade, moderação e validação em aparelhos reais continuam necessários antes de operação.

## Ativos e verificação

assets/v3/PROVENANCE.json contém URLs oficiais, datas, tamanhos e hashes da fonte e dos ícones; avisos de licença acompanham os arquivos. As capas são conceituais originais. O recorte promocional do Breeze foi inspecionado como referência e não foi incorporado como foto de usuário.

QA-V3.md, REVISAO-V3.md e NAVEGACAO-V3.md registram resultados e pendências. Testes DOM emulados não são validação de desenho, teclado ou gestos em aparelho. Versões anteriores deste documento permanecem em archive/ como histórico, sem status de especificação vigente.
