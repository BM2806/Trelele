# Design System: Margem, nome provisório

> DIREÇÃO V1 SUBSTITUÍDA: a experiência editorial abaixo foi rejeitada pelo usuário. A especificação vigente de interação é DINAMICA-TINDER.md e UX-V2.md. O frontend V2 usa shell mobile, deck de perfis, toque por livro, swipe por pessoa, match e inbox. Este texto fica como histórico do estudo inicial.


## 1. Visual Theme & Atmosphere
Página editorial de uma pessoa: opinião ocupa a posição de manchete, livros dão contexto e os controles permanecem familiares. Densidade 5/10, variância 5/10 e movimento 2/10. App literário jovem e direto. Não transformar a descoberta em catálogo de capas nem entrevista de erudição. Não há promessa de marca disponível.

## 2. Color Palette & Roles
- Papel (#FAFAFA): fundo neutro uniforme.
- Superfície (#FFFFFF): conteúdo em foco.
- Tinta (#242424): texto principal e navegação selecionada.
- Texto secundário (#686868): metadados com contraste legível.
- Linha (#D8D8D8): separadores.
- Terracota (#A84132): único acento para interesse e ações principais.
- Anotação (#F3E9E7): resposta própria e identidade ilustrativa.
Capas conceituais e fotografia podem ter suas cores naturais; não introduzir novas cores de ação. Confirmar contraste por papel e estado antes da operação real.

## 3. Typography Rules
Instrument Sans local, licença SIL OFL preservada. Interface toda sem serifa. Títulos 34-60px fluidos; opinião 28-45px; corpo 16px; metadados curtos 11-13px. Linha de texto de leitura no máximo 65ch. Sem Inter, texto em degradê ou serifa genérica. A wordmark é tipográfica, não um logotipo aprovado.

## 4. Component Stylings
Botões planos, raio 5px, altura principal mínima 48px, rótulo visível e foco externo de 3px. Moldura editorial só agrupa uma pessoa, sem grades repetidas de cartões genéricos. Capas recebem sombra discreta para indicar objeto. Inputs com label acima; erro textual associado ao contexto. Dialog nativo com título, fechar, Escape e retorno de foco. Dados fictícios visíveis no topo de todas as telas. Ações de simulação aparecem explicitamente como simulação.

## 5. Layout Principles
CSS Grid: conteúdo + coluna de anotação em desktop. Uma coluna abaixo de 768px. Navegação inferior fixa apenas no celular, com espaço reservado para evitar encobrir conteúdo. Sem carrossel de três cards de recursos, hero centralizado ou sobreposição de textos. Preferências quebram linha; nunca exigir scroll horizontal para a tarefa principal. Perfil trata uma opinião como entrada; estante com três obras é conteúdo, não grade de features SaaS.

## 6. Motion & Interaction
Transições curtas de opacity/transform, sem efeitos permanentes disputando a leitura. prefers-reduced-motion desativa movimento. Nenhuma animação condiciona consentimento, tempo de resposta ou revelação. O foco é previsibilidade e autonomia; a recomendação estética de microloops é subordinada a acessibilidade e atenção neste produto.

## 7. Anti-Patterns
Sem roxo/neon, vidro, glow, emojis decorativos, porcentagem amorosa, usuários/contagens falsos apresentados como reais, fotos de banco fingindo usuários ou assinatura que antecipe uma foto. Não copiar a identidade dos sites de referência. Capas são estudos próprios, sem imitar editoras. Não chamar dados no browser de mídia protegida.

## 8. Fontes e aplicação
Ver REFERENCIAS-VISUAIS.md e dist/assets/references.json: MUBI Notebook para contexto editorial; Letterboxd para opinião sobre obras; Bookshop para curadoria; Apartamento para voz pessoal; StoryGraph para temas; Are.na para coleções. São referências de princípios, sem reprodução de layouts autenticados ou autorização implícita sobre seus ativos.
