# Margem — interface de aplicativo celular V2

O produto é um aplicativo Android/iOS. Esta entrega é um protótipo navegável da interface mobile, acessível por link; não contém binário instalável, integração nativa nem backend. A direção editorial V1 foi substituída e está em archive/DESIGN-V1.md.

## Estrutura de tela

Shell de altura do aparelho, safe areas e navegação inferior persistente: Descobrir, Curtidas, Conversas e Perfil. No computador, o protótipo mantém a largura de um aparelho (máximo 480 px); não se expande em landing page. Sem hero, coluna lateral ou menu de site na descoberta. Telas curtas permitem rolagem para alcançar as ações.

## Descoberta e dinâmica

Uma pessoa por cartão, com capas conceituais dos livros em destaque. Toque nas laterais troca o livro da mesma pessoa. Arrasto horizontal decide sobre a pessoa; gesto vertical, cancelado ou curto não decide. Botões oferecem alternativa ao gesto. A faixa inferior do cartão abre o perfil completo. Match recíproco abre overlay com dois livros e ações de conversar ou continuar descobrindo. Desfazer não apaga um match já criado.

## Conversas e edição

Novos matches sem mensagens ocupam faixa horizontal; conversas iniciadas ocupam lista vertical, sem duplicação. Chat mantém rascunho ao navegar. Progresso para revelar e aceites são explícitos; foto nunca é prêmio automático de contador. Intenção e tipo de relacionamento usam painel inferior com seleção temporária, Concluir e descarte ao fechar.

## Linguagem visual

Instrument Sans local; superfícies claras; coral na identidade, verde para curtir e cores distintas nas capas. Ações redondas, cartão visual alto, metadados curtos. Capas originais e imagens com origem registrada em assets/asset-manifest.json. Nenhuma fotografia de banco representa um usuário. Identidade e ativos do Tinder não foram copiados.

## Acessibilidade e limites

Labels, botões equivalentes a gestos, foco visível e restaurado, diálogo nativo, reduced motion, controles de seleção semânticos e ajustes de contraste estão implementados. Revisão de código e testes DOM não certificam WCAG nem desenho/gestos em aparelhos reais. Consultar UX-V2.md e QA-V2.md para achados e lacunas.

## Fontes

DINAMICA-TINDER.md mapeia as cinco imagens enviadas e documentação oficial. REFERENCIAS-INTERACAO.md e assets/interaction-references.json registram as buscas e a inspeção de código aberto MIT. Nenhum acesso ao código interno do Tinder é alegado.
