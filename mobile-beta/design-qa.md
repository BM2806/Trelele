# Trelelê — QA de design V6

## Estado da validação

Implementação baseada no alvo aprovado pelo supercrítico, com onda, decisão integrada e celebração “Deu liga!” no cartão. Build e integridade do runtime passaram após os ajustes finais. A auditoria independente não operou navegador. Os resultados renderizados abaixo são relatados pelo responsável principal e inspecionados pelo supercrítico em `../docs/SUPERCRITICA-V6.md`.

## Limites dos testes

- A configuração `qa=360` é um **container de 360 × 740**, não um dispositivo real de 360 px nem substituto do iPhone/Pixel calibrados do runtime.
- Os 17 testes de domínio e sete do classificador não validam tamanho de fonte, legibilidade ou percepção do gesto.
- Os quatro testes Worker validam empacotamento e rotas, sem aprovação visual.
- A suíte histórica V5 tem cinco falhas conhecidas e não exercita o React V6.

## Correções verificadas em código

- Tabs ficam inertes durante a celebração, evitando desmontagem da camada sem saída.
- Header, navegação, controles de livro e painel ficam inertes durante a celebração.
- Foco inicial ocorre uma vez por conexão; Tab circula pelos dois CTAs; Escape encerra.
- Teclado é ocultado ao celebrar; posicionamento do compositor usa o hook do runtime.
- Movimento reduzido desativa animações e confetes.
- Capa autêntica e exemplar ilustrativo têm estados separados.
- Aceite, revogação, troca de imagem e bloqueio continuam no domínio compartilhado.

## Evidência renderizada

| Evidência | Resultado registrado pelo supercrítico | Alcance |
| --- | --- | --- |
| Captura principal em 393 | Aprovada visualmente | Proporções e chrome da configuração inspecionada |
| `trelele-v6-container-360.jpg` | Layout aprovado | Container 360 × 740, não aparelho real; responsável mediu scrollWidth = clientWidth = 360 |
| `trelele-v6-deu-liga.jpg` | Rejeitada | Estado deslocado/cortado e subtítulo com contraste baixo; não usar como captura final |
| `trelele-v6-liga-final.jpg` | Overlay 393 aprovado | Mensagem, capas e dois CTAs inteiros; sem teclado visível |

O responsável relatou gestos reais: curto e vertical preservam Ana; direita intencional gera curtida recíproca; esquerda avança Davi para Bia sem dupla decisão. Também relatou overlay descendente do article e URL inalterada. Não foi executado cancelamento real de ponteiro em integração; o classificador puro tem testes unitários, mas isso não testa eventos de navegador.

A captura rejeitada foi afetada por `locator.click`/`scrollIntoView`, que rolou `.device-screen` até 288. Após recarga e toque nativo, scrollTop foi 0, `keyboard.visible` era falso e não havia inputs montados. A primeira imagem mostra evidência inválida para handoff, sem comprovar um defeito do teclado do runtime.

O responsável confirmou no navegador que “Puxar assunto” abre a conversa de Ana.

**Ainda pendentes neste registro:** overlay em container 360; CTA “Continuar olhando”, Escape e movimento reduzido. Não fechar esses itens apenas pela existência de CSS/handlers.
