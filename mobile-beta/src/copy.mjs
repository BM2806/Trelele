// Dados fictícios e textos da demonstração. Nenhuma fala é enviada a uma pessoa.
export const books = [
 {id:'estrela',title:'A hora da estrela',author:'Clarice Lispector',tag:'Ficção brasileira',opinion:'Li na escola e gostei bem mais quando reli adulta.'},
 {id:'avesso',title:'O avesso da pele',author:'Jeferson Tenório',tag:'Ficção brasileira',opinion:'Terminei num fim de semana. Depois emprestei para a minha mãe.'},
 {id:'torto',title:'Torto arado',author:'Itamar Vieira Junior',tag:'Ficção brasileira',opinion:'Demorei para começar. Quando peguei, li quase tudo no domingo.'},
 {id:'rio',title:'Tudo é rio',author:'Carla Madeira',tag:'Romance',opinion:'Gostei da escrita, mas discordo de algumas escolhas do final.'},
 {id:'vegetariana',title:'A vegetariana',author:'Han Kang',tag:'Romance',opinion:'Não foi uma leitura fácil para mim. Precisei parar algumas vezes.'},
 {id:'cegueira',title:'Ensaio sobre a cegueira',author:'José Saramago',tag:'Ficção',opinion:'No começo me perdi nos diálogos. Depois acostumei e li rápido.'}
];
export const profiles = [
 {id:'ana',name:'Ana',age:29,city:'São Paulo',intent:'Quero namorar',prompt:'Sobre um dos meus livros',quote:'Reli A hora da estrela este ano. Na escola eu não tinha gostado.',note:'Sou professora, moro na Pompeia e tenho um cachorro que não me deixa dormir até tarde. Gosto de cozinhar para os amigos.',books:['estrela','avesso','torto'],category:'Ficção brasileira',bookOpinions:{estrela:'Reli A hora da estrela este ano. Na escola eu não tinha gostado.',avesso:'Foi minha irmã que indicou. A gente acabou lendo quase ao mesmo tempo.',torto:'Quero reler. Passei rápido demais pela parte da Belonísia.'}},
 {id:'davi',name:'Davi',age:32,city:'São Paulo',intent:'Quero conhecer alguém',prompt:'Sobre um dos meus livros',quote:'Levei um tempo para acostumar com a pontuação do Saramago. Valeu insistir.',note:'Trabalho com TI. Pedalo de manhã quando consigo e jogo futebol mal, mas vou toda semana. Prefiro bar onde dá para ouvir a outra pessoa.',books:['cegueira','vegetariana','avesso'],category:'Suspense',bookOpinions:{cegueira:'Levei um tempo para acostumar com a pontuação do Saramago. Valeu insistir.',vegetariana:'Achei a segunda parte a mais difícil de ler. Ainda quero conversar sobre ela.',avesso:'Ganhei de aniversário. Foi um dos melhores presentes daquele ano.'}},
 {id:'bia',name:'Bia',age:27,city:'São Paulo',intent:'Quero namorar',prompt:'Sobre um dos meus livros',quote:'Gostei de Tudo é rio, mas tenho umas ressalvas sobre o final. Sem spoiler aqui.',note:'Sou nutricionista. No sábado tento correr e geralmente acabo na padaria. Estou aprendendo cerâmica e ainda só fiz potes tortos.',books:['rio','torto','estrela'],category:'Romance',bookOpinions:{rio:'Gostei de Tudo é rio, mas tenho umas ressalvas sobre o final. Sem spoiler aqui.',torto:'Peguei emprestado e já devolvi. Agora quero um exemplar meu.',estrela:'É curto, mas não consegui ler de uma vez. Fui voltando em alguns trechos.'}},
 {id:'leo',name:'Léo',age:35,city:'Rio de Janeiro',intent:'Quero conhecer alguém',prompt:'Sobre um dos meus livros',quote:'Comecei A vegetariana sem saber nada sobre o enredo. Foi uma boa escolha.',note:'Moro em Botafogo e trabalho com produção. Vou à praia até no dia nublado. Procuro alguém para sair, conversar e ver no que dá.',books:['vegetariana','cegueira','rio'],category:'Romance',bookOpinions:{vegetariana:'Comecei A vegetariana sem saber nada sobre o enredo. Foi uma boa escolha.',cegueira:'Já recomendei para gente que odiou. Continuo gostando bastante.',rio:'Li porque todo mundo falava dele. Fiquei mais interessado na Lucy.'}},
 {id:'lia',name:'Lia',age:30,city:'São Paulo',intent:'Quero namorar',prompt:'Sobre um dos meus livros',quote:'Torto arado foi o último livro que dei de presente. A pessoa gostou, ainda bem.',note:'Sou arquiteta. Faço aula de dança às terças e tenho mais plantas do que espaço. Gosto de marcar um café sem passar três semanas combinando.',books:['torto','estrela','avesso'],category:'Ficção brasileira',bookOpinions:{torto:'Torto arado foi o último livro que dei de presente. A pessoa gostou, ainda bem.',estrela:'Foi minha primeira Clarice. Depois tentei Água viva e ainda não terminei.',avesso:'Li no clube do trabalho. Foi a reunião em que mais gente apareceu.'}},
 {id:'rafa',name:'Rafa',age:31,city:'São Paulo',intent:'Quero conhecer alguém',prompt:'Sobre um dos meus livros',quote:'Comecei O avesso da pele no ônibus. Na volta, quase perdi meu ponto.',note:'Sou designer, moro na Saúde e tenho mania de fazer listas de lugares para conhecer. No domingo gosto de feira, pastel e uma caminhada sem pressa.',books:['avesso','rio','vegetariana'],category:'Ficção brasileira',bookOpinions:{avesso:'Comecei O avesso da pele no ônibus. Na volta, quase perdi meu ponto.',rio:'Uma amiga me emprestou. Acabamos conversando mais sobre o livro do que sobre a viagem dela.',vegetariana:'Li com o meu clube do bairro. Cada pessoa saiu da reunião com uma interpretação.'}}
];
export const me = {name:'Bruno',age:35,city:'São Paulo',intent:'Quero conhecer alguém',bio:'Moro em São Paulo há seis anos. Gosto de cinema, de cozinhar no domingo e de sair para tomar uma cerveja. Estou tentando ler mais antes de dormir.',books:['estrela','torto','cegueira'],relationship:'Monogamia',interest:'Todos'};
export const seedChat = [
 {from:'lia',text:'Oi, Bruno! Vi Torto arado nos seus livros. Você já leu outros do Itamar?'},
 {from:'you',text:'Oi! Só esse por enquanto. Você recomenda qual?'}
];
const lines = {
 ana:[['ana','Vi que você também releu A hora da estrela. Foi por conta própria?'],['you','Foi. Eu lembrava bem pouco da época da escola.'],['ana','Eu também. Li com uma amiga dessa vez e gostei mais.'],['you','Vocês costumam ler juntas?'],['ana','Às vezes. Ela lê muito mais rápido e precisa me esperar.'],['you','Comigo ia ter que esperar também. Leio mais no metrô.'],['ana','Eu tento, mas sempre passo da minha estação.'],['you','Já aconteceu comigo. Agora coloco alarme.'],['ana','Vou copiar isso. Você trabalha longe de casa?'],['you','Uns quarenta minutos. E você?'],['ana','Dou aula perto de casa, ainda bem. Tem algum café de que você gosta na Pompeia?'],['you','Conheço poucos por lá. Aceito indicação.']],
 davi:[['davi','Você demorou para acostumar com a escrita do Saramago também?'],['you','Demorei. No começo eu voltava para descobrir quem estava falando.'],['davi','Exatamente. Depois comecei a ler os diálogos quase em voz alta.'],['you','Boa ideia. Você já leu algum outro dele?'],['davi','Só As intermitências da morte. Gostei bastante.'],['you','Esse está na minha lista faz tempo.'],['davi','O meu ficou meses na estante antes de eu pegar.'],['you','Aqui tenho vários nessa situação.'],['davi','Já estou evitando livraria para não piorar.'],['you','Eu tento, mas entro para olhar e acabo levando.'],['davi','No sebo isso acontece ainda mais comigo. Você conhece algum bom?'],['you','Tem um perto de casa. Vou lembrar o nome e te mando.']],
 bia:[['bia','Você terminou Tudo é rio? Não quero soltar spoiler sem querer.'],['you','Ainda não. Está nos livros que quero pegar.'],['bia','Então vou me controlar. Depois quero saber o que você achou.'],['you','Combinado. Você costuma ler romance?'],['bia','Bastante. Mas alterno com umas leituras mais leves.'],['you','Eu também preciso alternar. Dois livros pesados seguidos não dá.'],['bia','Sim. Terminei um ontem e hoje vou só ver uma comédia.'],['you','Qual? Estou precisando de indicação.'],['bia','Ainda não escolhi. Aceito uma também.'],['you','Posso pensar em algumas. Você prefere filme ou série?'],['bia','Filme. Série eu começo e esqueço de continuar.'],['you','Então somos dois. Vou te mandar uma lista curta.']],
 leo:[['leo','Você chegou a terminar A vegetariana?'],['you','Ainda estou na metade. Está sendo bem diferente do que eu esperava.'],['leo','Também fui sem saber quase nada. Melhor não pesquisar muito antes.'],['you','Estou evitando. Você lê no celular ou em papel?'],['leo','Papel em casa, Kindle quando saio. Minha mochila agradece.'],['you','Faço a mesma coisa. Mas ainda compro mais livro do que preciso.'],['leo','Eu tenho uma pilha do lado da cama. Um dia ela cai.'],['you','A minha já caiu. Não aprendi.'],['leo','Bom saber que não sou o único. Você mora em que bairro?'],['you','Na Vila Madalena. Você é de Botafogo mesmo?'],['leo','Sou. Moro aqui há uns oito anos. Você vem ao Rio de vez em quando?'],['you','Venho, sim. Minha família mora aí.']],
 lia:[['lia','Recomendo Salvar o fogo. Li depois de Torto arado.'],['you','Vou anotar. Você gostou mais de qual?'],['lia','De Torto arado. Mas talvez porque foi o primeiro.'],['you','Comigo acontece isso com alguns autores.'],['lia','Você lê vários do mesmo autor seguidos?'],['you','Raramente. Geralmente mudo de assunto.'],['lia','Eu também. Agora estou lendo um policial bem fácil de engatar.'],['you','Qual é? Estou querendo um para levar numa viagem.'],['lia','O assassinato de Roger Ackroyd. Está bom até aqui.'],['you','Esse eu não li. Vai para a lista também.'],['lia','Daqui a pouco você vai ter leitura para a viagem inteira. Vai para onde?'],['you','Para o Rio, visitar minha família. E você, tem alguma viagem marcada?']],
 rafa:[['rafa','Você já leu O avesso da pele? Fiquei pensando nele uns dias depois.'],['you','Já li. Também precisei de um tempo quando terminei.'],['rafa','Você costuma conversar com alguém sobre o que lê?'],['you','Às vezes mando um áudio enorme para um amigo.'],['rafa','Bom saber que não sou só eu. Meu clube recebe uns desses.'],['you','Vocês se encontram sempre?'],['rafa','Uma vez por mês. A conversa acaba passando por tudo.'],['you','Imagino. O livro é só o começo.'],['rafa','Sim! E geralmente tem alguma coisa boa para comer.'],['you','Isso já me convenceria a participar.'],['rafa','No último encontro fiz um bolo de laranja. Deu certo por sorte.'],['you','Tenho uma receita que sempre fica meio torta, mas é boa.']]
};
export const simulatedDialogue = Object.fromEntries(Object.entries(lines).map(([id,items])=>[id,items.map(([from,text])=>({from,text}))]));
// Escolher próxima fala de um lado sem repetir texto já existente; não inferir respostas reais.
export function nextDemoLine(personId, from, messages = []) {
 const used = new Set(messages.map(m=>m.text));
 return simulatedDialogue[personId]?.find(item=>item.from===from&&!used.has(item.text))?.text ?? null;
}
export const simulatedReplies = Object.fromEntries(Object.entries(simulatedDialogue).map(([id,items])=>[id,items.filter(m=>m.from===id).map(m=>m.text)]));
export const strings = {
 demo:'Teste com perfis fictícios',
 discoveryIntro:'A foto só aparece se os dois quiserem.',
 revealHelp:'Quando a foto aparece?',
 pauseTitle:'Você pausou a descoberta',pauseBody:'Seu perfil não aparece para novas pessoas enquanto estiver pausado.',resume:'Voltar a descobrir',
 endTitle:'Não há mais perfis por aqui',endBody:'Você já viu os perfis deste teste com os filtros atuais.',review:'Ver perfis de novo',filters:'Filtros',
 receivedIntro:'Quem curtiu seu perfil. As fotos continuam ocultas.',receivedEmpty:'Você ainda não recebeu curtidas',receivedEmptyBody:'Quando alguém curtir seu perfil, aparece aqui.',
 sentTitle:'Curtidas que você enviou',sentStatus:'Ainda não deu match',
 inboxEmpty:'Nenhuma conversa por enquanto',inboxEmptyBody:'Quando vocês se curtirem, podem conversar por aqui.',newMatchesEmpty:'Seus próximos matches aparecem aqui.',
 matchTitle:'Deu match!',matchLine:name=>`Você e ${name} se curtiram.`,matchSend:'Mandar mensagem',matchContinue:'Continuar vendo perfis',
 noSharedBooks:'Nenhum livro em comum por enquanto.',sharedBooks:titles=>titles.length===1?`Vocês têm “${titles[0]}” em comum.`:`Vocês têm ${titles.length} livros em comum.`,
 bookCaptions:['Escolhi este livro','Também li','Outro que recomendo'],
 composer:'Escreva uma mensagem',threadDemo:'Conversa de teste · ninguém recebe estas mensagens',
 revealLockedTitle:'A foto ainda está oculta',revealReadyTitle:'Quer mostrar sua foto?',revealReadyBody:'Sua foto e a outra aparecem juntas, quando os dois aceitarem. Você pode continuar conversando sem mostrar.',
 revealRule:'É preciso esperar 24 horas depois de os dois começarem a responder e conversar pelo menos cinco vezes de cada lado, alternando as respostas. Várias mensagens seguidas contam como uma vez.',
 revealAction:'Quero mostrar minha foto',revealAccepted:'Você escolheu mostrar',revealAcceptedBody:'A foto aparece se a outra pessoa também aceitar. Até lá, você pode mudar de ideia.',
 revealRevoke:'Deixar de mostrar minha foto',revealedTitle:'Fotos liberadas',revealedBody:'Neste teste, aparecem ilustrações. Não são fotos de pessoas reais.',
 howTitle:'Como funciona a foto',howBody:'Primeiro vocês conversam. Depois do prazo e das respostas dos dois, cada pessoa pode escolher mostrar a foto. Uma pessoa só não libera as imagens.',
 demoControls:'Testar conversa e foto',demoControlsBody:'Estes botões preenchem mensagens e adiantam o relógio só neste teste.',simulateReply:name=>`Adicionar resposta de ${name}`,simulateTime:'Testar conversa após 24 horas',simulateConsent:name=>`Simular a escolha de ${name}`,simulateDone:'Conversa e prazo simulados. Agora falta a escolha de cada pessoa.',
 safetyTitle:'Opções da conversa',block:'Bloquear perfil',report:'Testar denúncia',unmatch:'Desfazer match',blockTitle:'Bloquear este perfil?',blockBody:'O perfil sai da descoberta e a conversa é encerrada neste teste.',unmatchTitle:'Desfazer este match?',unmatchBody:'Vocês deixam de aparecer nas conversas um do outro. Não dá para desfazer essa ação neste teste.',
 reportTitle:'Denúncia de teste',reportBody:'Este formulário não envia uma denúncia nem recebe atendimento. Não inclua informações pessoais.',reportReason:'Motivo',reportSubmit:'Salvar neste teste',reportSaved:'Salvo só neste teste. Nenhuma equipe recebeu a denúncia.',
 pauseLabel:'Pausar meu perfil',profileBooks:'Meus livros',profilePreview:'É assim que os outros veriam seu perfil neste teste.',
 projectTitle:'Sobre este teste',projectBody:'Este é um teste de um app de namoro por livros para maiores de 18 anos. Os perfis, as conversas e as ilustrações são fictícios. Não há conta, envio de mensagens ou cobrança.',
 subscribeTitle:'Plano pago em estudo',subscribeBody:'R$ 29,90 por mês é uma hipótese de preço. Nenhuma assinatura está à venda neste teste.'
};
export const replacements = {
 'No seu tempo.':strings.pauseTitle,
 'Chegamos à última página.':strings.endTitle,
 'Alguém gostou das suas histórias.': 'Quem curtiu seu perfil.',
 'As fotos continuam guardadas.':'As fotos continuam ocultas.',
 'Sua próxima história está por aí.':strings.receivedEmpty,
 'Seus interesses enviados':strings.sentTitle,
 'Aguardando interesse mútuo':strings.sentStatus,
 'Um interesse mútuo abre uma conversa.':strings.newMatchesEmpty,
 'Vamos começar pelo assunto?':strings.inboxEmpty,
 'Vocês já têm um livro para começar.':'Vocês deram match. Que tal mandar um oi?',
 'Foto oculta · conversa aberta':'Foto oculta',
 'Vocês deram match por livros ♡':'Conversa de teste',
 'Personagem fictício':'Perfil de teste',
 'Mais uma página de vocês.':strings.revealedTitle,
 'Primeiro, a conversa.':strings.revealLockedTitle,
 'Podemos revelar?':strings.revealReadyTitle,
 'Seu aceite está registrado':strings.revealAccepted,
 'Quero revelar':strings.revealAction,
 'Retirar meu consentimento':strings.revealRevoke,
 'Entender a revelação':strings.revealHelp,
 'Comece por uma boa pergunta…':strings.composer,
 'Seu perfil começa pelos livros.':'Seus livros aparecem no lugar da foto.',
 'Minha estante':'Meus livros',
 'Uma nova forma de dar match':strings.projectTitle,
 'Antes da foto, uma conversa.':strings.howTitle,
 'Você escolhe como continuar':strings.safetyTitle,
 'Bloquear personagem':'Bloquear perfil',
 'Encerrar conexão':strings.unmatch,
 'Encerrar esta conexão?':strings.unmatchTitle,
 'Motivo do cenário':'Motivo',
 'Bloquear também neste cenário':'Bloquear este perfil também',
 'Registrar apenas na demo':'Salvar neste teste',
 'Salvar no cenário':'Salvar',
 'Reiniciar demonstração':'Recomeçar o teste',
 'Aplicar preferências':'Aplicar filtros',
 'Quero conhecer alguém':'Quero conhecer alguém',
 'Busco uma relação':'Quero namorar',
 'Aberto a possibilidades':'Ainda não sei',
 'Um match já abriu esta história. Encontre a conversa na sua caixa.':'Vocês já deram match. A conversa está na aba Conversas.',
 'Ainda não há uma pessoa para voltar.':'Você ainda não passou nenhum perfil.',
 'Última pessoa disponível novamente.':'O perfil anterior voltou.',
 '24h e turnos alternados simulados. Faltam os aceites dos dois.':strings.simulateDone,
 'Seu aceite está registrado em privado nesta simulação.':'Você escolheu mostrar sua foto neste teste.',
 'Aceite do personagem simulado.':'A escolha do outro perfil foi simulada.',
 'Novos acessos revogados. Isso não apaga uma imagem já vista.':'A imagem não aparece mais aqui. Isso não apaga o que a outra pessoa já viu.',
 'Retrato alterado: os dois aceites foram reiniciados.':'A imagem mudou. Os dois precisam escolher mostrar de novo.',
 'A conversa ainda não está elegível. Use os controles da simulação para testar.':'Ainda falta tempo ou resposta dos dois. Você pode usar os botões de teste.',
 'Ação indisponível neste cenário.':'Não foi possível fazer isso agora.',
 'Use idades de 18 a 99; a mínima não pode superar a máxima.':'Escolha idades entre 18 e 99 anos. A idade mínima precisa ser menor ou igual à máxima.'
};
