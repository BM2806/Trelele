# V13 — marca e catálogo: contrato de QA

**PREFLIGHT APROVADO antes da geração/edição. Resultado ainda não inspecionado.** Esta revisão é delimitada à nova marca/abertura e seleção de livros por catálogo real. O restante da V12 aprovada deve permanecer.

## Referências inspecionadas

IMG_1523.jpeg e `exec-3b5755c0-2306-46c3-a0d4-713ba375e246.png` foram vistos diretamente. A nova instrução explícita do usuário autoriza implementar o livro-coração e a abertura correspondente; substitui a instrução anterior de manter esse logo fora do app.

O arquivo final é raster 1254 × 1254, fundo branco opaco, aproximação da marca da referência; não é vetor nem reprodução matemática exata. BrandLogo reutiliza esse artwork sem reconstruir símbolo/letras, distorcer proporções ou cortar o circunflexo. Não misturar essa marca com o antigo símbolo de marcador/páginas. Converter formato sem alterar desenho é diferente de redesenhar.

## Abertura/entrada

Background decorativo novo aprovado: quatro cantos orgânicos verde/laranja com centro branco, inspirado em 1523, sem telefone, status bar, logo, slogan ou controles desenhados dentro da imagem. Marca e controles são elementos separados e acessíveis. Não gerar nova marca junto do background. Evitar ruído, manchas claras e textura involuntária observados em tentativas antigas de onda.

| Região | 360 × 640 | 390 × 844 |
|---|---|---|
| Artwork visível da marca | ~200–220 de largura, ~150–170 de altura | ~240 de largura, ~180 de altura |
| Margens de conteúdo | 24 | 24 |
| Provedores Apple/Google/e-mail | Três pills 52, gaps 8–10 | Mesma escala de texto/toque |
| Acesso à demonstração | Alvo 48 e texto legível | Mesmo contrato |
| Fundo e áreas livres | Curvas nos cantos, centro branco | Mesma relação, sem esticar marca |

Medidas referem-se ao artwork visível, não à tela quadrada de 1254 com margens internas. Se a altura útil diminuir, reduzir respiro decorativo e permitir scroll antes de reduzir botões/fonte. Reservar safe area e manter todos os provedores e retorno alcançáveis. O PNG opaco deve repousar em branco uniforme, sem parecer um adesivo quadrado sobre curva colorida.

Não copiar o texto branco sobre CTA laranja da referência: usar texto escuro com contraste suficiente. Não adicionar brilho/sombra pesada. Preservar copy de encontros literários, salvo mudança explícita de texto pelo usuário. Três provedores continuam exigência explícita; não implicam autenticação configurada.

## BookPicker na etapa 9

**Plano aprovado:** três slots selecionados no topo, busca título/autor, mínimo de dois caracteres antes da rede, debounce ~400 ms, AbortController e invalidação de resposta antiga. Resultado com capa, título, autor e ano quando disponível. Proveniência legível: Google Books, Open Library ou Local; não atribuir serviço diferente do efetivamente usado.

Contrato de composição: input fonte 16; capa ~36–44 × 54–66 em linha com alvo mínimo 64; origem/ano pelo menos 12; slot de remover com alvo 48, sem X minúsculo. Fallback “Sem capa” conserva proporção. Selecionar o terceiro livro não deve esconder resultados ou CTA em 360.

Estados obrigatórios: inicial/orientação, buscando com role=status, resultados, vazio, erro/retry, limite 429 sem loop, sem capa, três selecionados e remoção. Rótulos e erros acessíveis, não apenas cor. Capas reais continuam distintas de fotos privadas e não recebem filtros da marca.

**Bloqueante de integridade do produto:** três livros distintos significam três obras, não três IDs de edições da mesma obra. Deduplicar além do namespace/ID, por identidade de obra ou título/autor normalizados, preservando distinções legítimas de volumes. Não contar a mesma obra retornada por dois provedores como duas escolhas.

IDs externos com detalhes válidos devem sobreviver ao salvar/reabrir e aparecer em Meu perfil sem a validação antiga de catálogo local descartá-los. Metadados são texto, URLs de capa são validadas no serviço; sem HTML executável, URLs javascript/data arbitrárias ou foto pessoal tratada como capa. Não inventar ano, autor ou capa ausente.

## Review e privacidade

Nesta V13 há exceção explicitamente autorizada para pesquisa externa no BookPicker de review. Permitir a consulta deliberada com estado em memória, sem ler/escrever perfil, fotos ou sessão reais. A regra anterior de review sem qualquer rede deve ser atualizada apenas nesse escopo. Não transmitir outros campos do cadastro na query.

## Gate do resultado

Auditor é o único operador de browser. Capturar abertura e entrada em 390/360 com nova marca, curvas e três provedores; conferir ausência do logo antigo nos pontos substituídos, sem mudar o restante da V12. Exercitar busca real, troca rápida de consulta/stale, seleção/remoção, duplicidade entre edições, erro/sem capa e salvar/reabrir três livros externos. Comparar perfil com as seleções e garantir que fotos locais não entram nos resultados.

Aprovação de preflight não certifica integração de API, autenticação, upload nem render final. Nenhuma UI foi editada por este crítico; sua propriedade é este documento e a revisão independente.

## Inspeção dos assets finais

Vistos diretamente `public/assets/brand/trelele-opening-background-v13.png` e `trelele-book-heart-v13.png`. **ASSETS APROVADOS PARA APLICAÇÃO.** Fundo mantém os quatro cantos e linhas orgânicas da referência, centro branco livre e ausência de telefone, texto ou marca incorporados. Não foram encontrados os halos amarelos críticos das versões transparentes antigas. Logo tem contornos e circunflexo legíveis.

Crop proposto do logo, x121/y247 a x1134/y1021, preserva a área visual: largura 240 corresponde a altura aproximada 183; largura 220 a altura 168. Compatível com o budget aprovado. Não cortar mais a marca para forçar espaço.

Header/footer transparentes aprovados para expor os cantos. Revalidar contraste de retorno, links e provedores sobre a composição real; não cobrir a decoração com grandes blocos brancos nem deixá-la invadir textos. Ao ajustar o fundo em 360 × 640, verificar que background-cover não remove cantos essenciais ou desloca curva para dentro do controle. A inspeção dos assets não substitui as capturas de UI em 390/360, ainda pendentes nesta etapa.

## Gate final — imagens e integração real do catálogo

**APROVADO para o escopo V13 de marca/abertura/entrada e BookPicker testado no beta. Nenhum P1 visual nas capturas finais. Pode integrar/commitar esse resultado, sem nova exploração de layout.**

Inspecionadas diretamente as quatro capturas em `docs/design-v13`, com pares 390 × 844 e 360 × 640:

| Captura | Evidência visual |
|---|---|
| providers-final.jpg | Livro-coração e Trelelê inteiros, circunflexo correto, cantos orgânicos limpos; três provedores e demonstração legíveis, sem corte |
| welcome-final.jpg | Nova marca e fundo substituem os antigos; Começar/demonstração/18+ inteiros nas duas alturas |
| livros-selecionados.jpg | Três capas e títulos, ações Remover, contagem 3/3 e CTA disponíveis; proveniência Open Library e indisponibilidade do Google Books comunicadas |
| livros-retorno.jpg | Mesmas três escolhas após retorno da etapa 10 para 9, incluindo livro externo; CTA preservada |

P2 não bloqueante: na abertura, a marca fica mais alta que o centro composicional de IMG_1523, com maior respiro abaixo. A entrada com três provedores tem orçamento próprio autorizado. Não é corte, marca incorreta ou razão para reabrir conceitos nesta rodada. Em 360, com os três slots preenchidos, o campo de busca cai abaixo da dobra inicial; isso depende de scroll normal, não comprova oclusão.

Auditor relata execução real no browser: Google Books indisponível → fallback Open Library, buscas por Memórias Póstumas em 390 e 1984 em 360, capas com naturalWidth válido, seleção de três livros e ida 9 → 10 → 9 preservada. São evidências de integração/CORS e retorno executadas pelo auditor; este crítico viu as capturas e não operou o browser.

Arquitetura relata bookWorkKey com normalização NFKD/case/pontuação de título/autor e ISBN quando disponível, além de guard de três obras. Isso reduz duplicação de edições; não afirmar identificação universal de obra quando subtítulos/metadados diferem entre provedores. Proveniência fixa, campos limitados e whitelist de capa foram relatados como implementados. Não houve resultados fictícios substituindo falha de rede.

### Limites vigentes

Aceite não certifica autenticação de produção, envio de código/e-mail, upload de três fotos, commit/persistência completa de cadastro, todos os estados de erro/429/stale no browser ou Safari/IME físico. Review permite pesquisa externa explicitamente e mantém dados de demonstração em memória. Não alegar teste de 43 telas individuais nesta rodada. O restante da V12 não foi redesenhado nem revalidado integralmente por estas quatro imagens.
