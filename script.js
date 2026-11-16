'use strict';

/* =========================================================
   MISSÃO OCULTA — online (WebRTC via PeerJS) + modo local
   Apenas HTML, CSS e JS. Sem servidor próprio.
   O anfitrião (quem cria a sala) é a "autoridade" do jogo.
   ========================================================= */

const PREFIX = 'missaoculta-jogo-';
const MAX_PLAYERS = 50;

/* Cada palavra é [palavra, dica]. A dica só aparece para o impostor quando o líder liga o modo com dica. */
const WORD_DATABASE = {
  lugares: [
    ["Cinema", "Sala escura com telão e pipoca"],
    ["Praia", "Areia, mar e guarda-sol"],
    ["Escola", "Lugar de sinal, aulas e recreio"],
    ["Hospital", "Lugar de cuidar da saúde, com macas e plantões"],
    ["Estádio de Futebol", "Arquibancadas lotadas e torcida cantando"],
    ["Biblioteca", "Silêncio e prateleiras cheias de livros"],
    ["Supermercado", "Carrinhos, corredores e fila no caixa"],
    ["Restaurante", "Cardápio, garçom e conta no final"],
    ["Aeroporto", "Embarques, malas e portões"],
    ["Academia", "Pesos, esteiras e suor"],
    ["Parque de Diversões", "Roda-gigante e montanha-russa"],
    ["Hotel", "Recepção, quartos e café da manhã incluso"],
    ["Igreja", "Lugar de fé, com bancos e sino"],
    ["Zoológico", "Bichos de vários cantos do mundo em recintos"],
    ["Museu", "Obras e objetos históricos expostos"],
    ["Shopping", "Lojas, praça de alimentação e escadas rolantes"],
    ["Padaria", "Cheirinho de pão quentinho de manhã"],
    ["Farmácia", "Remédios e balcão de atendimento"],
    ["Banco", "Cofres, caixas e gerente de conta"],
    ["Rodoviária", "Plataformas de embarque de ônibus"],
    ["Teatro", "Palco, cortinas e plateia"],
    ["Circo", "Lona, trapézio e picadeiro"],
    ["Fazenda", "Plantação, curral e vida no campo"],
    ["Cemitério", "Lugar silencioso de despedida, com lápides"],
    ["Prisão", "Celas e grades"],
    ["Delegacia", "Onde se registra um B.O."],
    ["Posto de Gasolina", "Bombas e frentistas"],
    ["Lavanderia", "Máquinas girando e roupas limpas"],
    ["Salão de Beleza", "Cortes, tinturas e unhas feitas"],
    ["Barbearia", "Barba e cabelo na navalha"],
    ["Piscina", "Água clorada para mergulhar"],
    ["Ponte", "Liga dois lados sobre um vão"],
    ["Castelo", "Torres, muralhas e realeza"],
    ["Universidade", "Cursos superiores e campus grande"],
    ["Acampamento", "Barracas, fogueira e noite ao ar livre"],
    ["Praça", "Bancos, árvores e gente passeando no centro"],
    ["Feira", "Barracas com frutas, legumes e gritos de preço"],
    ["Cassino", "Roletas, fichas e apostas"],
    ["Lanchonete", "Lanches rápidos no balcão"],
    ["Tribunal", "Juiz, martelo e julgamentos"]
  ],
  comida: [
    ["Pizza", "Redonda, cortada em fatias e com borda"],
    ["Hambúrguer", "Pão, carne e queijo empilhados"],
    ["Sushi", "Peixe cru e arroz, vindo do Japão"],
    ["Sorvete", "Gelado, vem em bolas na casquinha"],
    ["Lasanha", "Massa em camadas com molho e queijo"],
    ["Churrasco", "Carne na brasa com sal grosso"],
    ["Pastel", "Massa frita e crocante, recheada, vendida na feira"],
    ["Chocolate", "Doce feito de cacau que derrete na mão"],
    ["Pipoca", "Milho que estoura no calor"],
    ["Açaí", "Creme roxo e gelado servido na tigela"],
    ["Coxinha", "Salgado frito em formato de gota, com frango"],
    ["Taco", "Tortilha dobrada com recheio, típica do México"],
    ["Feijoada", "Feijão preto com carnes, comum aos sábados"],
    ["Brigadeiro", "Doce de bolinha com granulado"],
    ["Pão de Queijo", "Bolinha mineira e quentinha"],
    ["Macarrão", "Massa longa que se enrola no garfo"],
    ["Strogonoff", "Creme com carne ou frango, vai bem com batata palha"],
    ["Omelete", "Ovos batidos dobrados na frigideira"],
    ["Panqueca", "Massa fina e redonda, doce ou salgada, recheada"],
    ["Bolo", "Sobremesa assada, servida em fatias"],
    ["Pudim", "Doce gelatinoso com calda de caramelo"],
    ["Salada", "Folhas e legumes crus temperados"],
    ["Sopa", "Líquido quente tomado de colher no prato fundo"],
    ["Hot Dog", "Salsicha no pão com molhos"],
    ["Batata Frita", "Palitos dourados e crocantes"],
    ["Café", "Bebida quente e escura que desperta"],
    ["Suco de Laranja", "Bebida cítrica espremida"],
    ["Refrigerante", "Bebida com gás e muito açúcar"],
    ["Leite", "Líquido branco que vem da vaca"],
    ["Vitamina", "Fruta batida com leite"],
    ["Milkshake", "Bebida gelada e grossa, feita com sorvete"],
    ["Chá", "Folhas em infusão na água quente"],
    ["Água de Coco", "Bebida natural que vem dentro de um fruto"],
    ["Pamonha", "Milho verde cozido na palha"],
    ["Tapioca", "Goma de mandioca feita na frigideira"],
    ["Cuscuz", "Massa de milho cozida no vapor, comum no café da manhã nordestino"],
    ["Moqueca", "Ensopado de peixe com leite de coco e dendê"],
    ["Esfiha", "Massinha aberta com recheio, de origem árabe"],
    ["Kibe", "Bolinho de trigo e carne, de origem árabe"],
    ["Empadão", "Torta salgada com massa que esfarela"],
    ["Queijo", "Derivado do leite, pode ser ralado ou fatiado"],
    ["Ovo Frito", "Gema mole no meio de uma clara"],
    ["Arroz com Feijão", "Dupla básica do prato brasileiro"],
    ["Mel", "Doce natural feito por insetos"],
    ["Pão Francês", "Pãozinho de casca crocante da padaria"],
    ["Churros", "Massa frita em formato de tubo, com doce de leite"],
    ["Waffle", "Massa com marcas quadriculadas, vai com calda"],
    ["Donut", "Doce redondo com furo no meio"],
    ["Algodão Doce", "Nuvem de açúcar em palito"],
    ["Maçã do Amor", "Fruta vermelha coberta de caramelo duro, típica de festa junina"]
  ],
  profissoes: [
    ["Médico", "Usa jaleco e estetoscópio"],
    ["Professor", "Dá aulas e corrige provas"],
    ["Astronauta", "Trabalha fora do planeta, de macacão"],
    ["Bombeiro", "Apaga fogo e faz resgates"],
    ["Policial", "Usa farda e cuida da segurança pública"],
    ["Cozinheiro", "Passa o dia entre panelas e temperos"],
    ["Programador", "Escreve linhas de código na tela"],
    ["Ator", "Interpreta personagens"],
    ["Piloto", "Comanda uma aeronave num painel cheio de botões"],
    ["Dentista", "Cuida de sorrisos com broca"],
    ["Arquiteto", "Desenha plantas de construções"],
    ["Jornalista", "Apura fatos e escreve notícias"],
    ["Advogado", "Defende pessoas usando as leis"],
    ["Engenheiro", "Calcula e projeta estruturas e máquinas"],
    ["Pedreiro", "Assenta tijolos e mexe com cimento"],
    ["Mecânico", "Conserta motores e vive sujo de graxa"],
    ["Eletricista", "Mexe com fios e tomadas"],
    ["Encanador", "Resolve vazamentos e canos entupidos"],
    ["Padeiro", "Acorda de madrugada para assar"],
    ["Açougueiro", "Corta e vende carnes"],
    ["Fotógrafo", "Captura momentos com lentes"],
    ["Cantor", "Usa a voz no palco e no microfone"],
    ["Veterinário", "Cuida da saúde de bichos"],
    ["Enfermeiro", "Aplica injeção e acompanha pacientes"],
    ["Motorista", "Passa horas ao volante levando gente ou carga"],
    ["Carteiro", "Entrega cartas e encomendas de casa em casa"],
    ["Garçom", "Anota pedidos e leva pratos à mesa"],
    ["Barista", "Especialista em preparar café expresso"],
    ["Cabeleireiro", "Corta, pinta e penteia cabelos"],
    ["Jardineiro", "Cuida de plantas e faz podas"],
    ["Pintor", "Trabalha com tintas e pincéis"],
    ["Escritor", "Cria histórias em livros"],
    ["Juiz", "Veste toga e dá sentenças"],
    ["Detetive", "Investiga pistas e mistérios"],
    ["Cientista", "Faz experimentos e pesquisas"],
    ["Palhaço", "Nariz vermelho e gargalhadas"],
    ["Mágico", "Faz truques e some com coisas"],
    ["Youtuber", "Cria vídeos para um canal na internet"],
    ["Streamer", "Faz transmissões ao vivo na internet"],
    ["Salva-vidas", "Vigia banhistas e resgata quem se afoga"],
    ["Agricultor", "Planta e colhe alimentos no campo"],
    ["Faxineiro", "Deixa os ambientes limpinhos com rodo e vassoura"]
  ],
  pop: [
    ["Harry Potter", "Bruxinho de óculos e cicatriz na testa"],
    ["Marvel", "Universo de super-heróis nos quadrinhos e no cinema"],
    ["Star Wars", "Saga espacial com sabres de luz"],
    ["Batman", "Herói de capa e orelhas pontudas que age à noite"],
    ["Minecraft", "Jogo de blocos quadrados em que se constrói e minera"],
    ["Pokémon", "Criaturas de bolso que se capturam e treinam"],
    ["Stranger Things", "Série de garotos, mundo invertido e anos 80"],
    ["Barbie", "Boneca famosa e rosa"],
    ["Mario", "Encanador de bigode e boné vermelho dos games"],
    ["Shrek", "Ogro verde que mora num pântano"],
    ["Game of Thrones", "Série de reinos, dragões e disputa por um trono de espadas"],
    ["Matrix", "Filme em que a realidade é uma simulação e há pílulas coloridas"],
    ["Homem-Aranha", "Herói que lança teias e escala prédios"],
    ["Titanic", "Filme romântico sobre um navio famoso que afunda"],
    ["Frozen", "Animação de princesas irmãs, uma com poder de gelo"],
    ["O Rei Leão", "Animação de um filhote herdeiro da savana"],
    ["Toy Story", "Brinquedos que ganham vida quando ninguém vê"],
    ["Vingadores", "Time de heróis reunidos contra Thanos"],
    ["Senhor dos Anéis", "Jornada para destruir um anel na Terra-média"],
    ["Jurassic Park", "Parque com bichos pré-históricos recriados"],
    ["Avatar", "Filme de seres azuis num planeta chamado Pandora"],
    ["Naruto", "Anime de ninja loiro que quer ser líder da vila"],
    ["Dragon Ball", "Anime de esferas mágicas e lutas com cabelo dourado"],
    ["Turma da Mônica", "Quadrinhos de crianças brasileiras, com um coelhinho de pelúcia"],
    ["Chaves", "Seriado mexicano de um menino de barril e vila"],
    ["Bob Esponja", "Desenho de um personagem amarelo que vive no fundo do mar"],
    ["Os Simpsons", "Desenho de uma família amarela de Springfield"],
    ["Mickey Mouse", "Rato de orelhas redondas, mascote de um estúdio famoso"],
    ["Sonic", "Mascote azul que corre super rápido nos games"],
    ["Zelda", "Jogo de aventura com herói de espada e túnica verde"],
    ["Fortnite", "Jogo de batalha com construções e dancinhas"],
    ["Among Us", "Jogo de tripulantes coloridos e traidores numa nave"],
    ["Free Fire", "Jogo de sobrevivência numa ilha, famoso no celular"],
    ["Roblox", "Plataforma de jogos feitos pelos próprios usuários"],
    ["Squid Game", "Série coreana de jogos infantis mortais"],
    ["Procurando Nemo", "Animação de um peixe palhaço perdido no oceano"],
    ["Mulher-Maravilha", "Heroína amazona com laço mágico"],
    ["Coringa", "Vilão de sorriso largo e risada"],
    ["Pantera Negra", "Herói de traje preto, rei de Wakanda"],
    ["Velozes e Furiosos", "Filmes de carros turbinados e muita 'família'"]
  ],
  objetos: [
    ["Celular", "Cabe no bolso e vive nas mãos"],
    ["Notebook", "Computador dobrável que se leva na mochila"],
    ["Relógio", "Marca as horas no pulso ou na parede"],
    ["Garrafa", "Recipiente para levar líquido"],
    ["Espelho", "Mostra o reflexo de quem olha"],
    ["Mochila", "Leva livros nas costas"],
    ["Cadeira", "Serve para sentar, tem pernas e encosto"],
    ["Televisão", "Tela grande para ver programas e filmes"],
    ["Fone de Ouvido", "Música só para você, com fio ou sem"],
    ["Chaveiro", "Argola que agrupa chaves e enfeita"],
    ["Guarda-chuva", "Abre quando o tempo fecha"],
    ["Óculos", "Ajuda a enxergar melhor ou protege do sol"],
    ["Carteira", "Guarda documentos e dinheiro no bolso"],
    ["Chave", "Abre portas"],
    ["Tesoura", "Corta papel e tecido com duas lâminas"],
    ["Caneta", "Escreve com tinta"],
    ["Lápis", "Escreve e se apaga, tem ponta"],
    ["Caderno", "Folhas pautadas presas para anotar"],
    ["Borracha", "Apaga erros"],
    ["Régua", "Mede e traça linhas retas"],
    ["Vassoura", "Varre a sujeira do chão"],
    ["Escova de Dentes", "Higiene da boca, usada todo dia com pasta"],
    ["Pente", "Desembaraça fios"],
    ["Travesseiro", "Apoia a cabeça na hora de dormir"],
    ["Cobertor", "Esquenta nas noites frias"],
    ["Lanterna", "Ilumina no escuro, com pilhas"],
    ["Pilha", "Guarda energia em formato de cilindro pequeno"],
    ["Controle Remoto", "Muda de canal sem levantar do sofá"],
    ["Ventilador", "Pás que giram para refrescar"],
    ["Geladeira", "Eletrodoméstico que conserva comida em baixa temperatura"],
    ["Microondas", "Esquenta a comida girando um prato"],
    ["Panela", "Cozinha no fogão, tem tampa e cabos"],
    ["Garfo", "Talher com dentes"],
    ["Faca", "Talher que corta"],
    ["Colher", "Talher côncavo para tomar sopa"],
    ["Copo", "Vaso para beber água"],
    ["Prato", "Onde se serve a comida"],
    ["Martelo", "Bate em pregos"],
    ["Chave de Fenda", "Ferramenta que gira parafusos"],
    ["Bola", "Redonda, quica ou rola"],
    ["Vela", "Chama no pavio, derrete cera"],
    ["Fósforo", "Palito que acende fogo ao riscar"],
    ["Cadeado", "Tranca portões com chave ou senha"],
    ["Moeda", "Dinheiro redondo e de metal"],
    ["Balão", "Enche de ar e voa ou estoura"],
    ["Sacola", "Leva compras de mercado"],
    ["Toalha", "Seca o corpo depois do banho"]
  ],
  animais: [
    ["Cachorro", "Melhor amigo do homem, balança o rabo"],
    ["Gato", "Felino doméstico que mia e ronrona"],
    ["Leão", "Grande felino de juba, rei da selva"],
    ["Elefante", "Gigante cinzento com tromba e presas"],
    ["Girafa", "Animal de pescoço comprido e manchas"],
    ["Macaco", "Primata que pula de galho em galho e gosta de banana"],
    ["Cobra", "Rasteja sem patas e solta a língua"],
    ["Jacaré", "Réptil de focinho comprido que vive em rios"],
    ["Tubarão", "Peixe de nadadeira que assusta banhistas"],
    ["Golfinho", "Mamífero marinho inteligente que dá saltos"],
    ["Baleia", "Maior animal do mar, solta jato de água"],
    ["Pinguim", "Ave que não voa e vive no gelo"],
    ["Urso", "Peludo e grande, hiberna no inverno"],
    ["Lobo", "Uiva para a lua e anda em matilha"],
    ["Raposa", "Esperta, de rabo felpudo e focinho fino"],
    ["Coelho", "Orelhas compridas, pula e adora cenoura"],
    ["Cavalo", "Galopa e é montado"],
    ["Vaca", "Dá leite e muge"],
    ["Porco", "Rosna, rola na lama e tem rabinho enrolado"],
    ["Galinha", "Põe ovos e cacareja"],
    ["Pato", "Ave que nada e faz quá"],
    ["Ovelha", "Fornece lã e faz 'bé'"],
    ["Cabra", "Escala montanhas, tem chifres e barbicha"],
    ["Zebra", "Parece um cavalo listrado de preto e branco"],
    ["Tigre", "Grande felino com listras laranjas"],
    ["Onça", "Felino pintado das matas brasileiras"],
    ["Capivara", "Maior roedor do mundo, vive perto de rios"],
    ["Tartaruga", "Anda devagar com casco nas costas"],
    ["Sapo", "Pula, coaxa e vive perto de lagoa"],
    ["Borboleta", "Inseto de asas coloridas que nasce de casulo"],
    ["Abelha", "Zumbe, faz mel e tem ferrão"],
    ["Formiga", "Pequena e trabalhadora, anda em fila"],
    ["Aranha", "Oito patas e teia"],
    ["Águia", "Ave de rapina de visão aguçada"],
    ["Coruja", "Ave noturna de olhos grandes"],
    ["Papagaio", "Ave colorida que repete o que ouve"],
    ["Tucano", "Ave de bico enorme e colorido"],
    ["Canguru", "Pula e leva o filhote na bolsa"],
    ["Coala", "Fofinho australiano que dorme em eucalipto"],
    ["Panda", "Urso preto e branco que come bambu"],
    ["Hipopótamo", "Enorme, passa o dia na água de rios africanos"],
    ["Rinoceronte", "Chifre no focinho e pele grossa"],
    ["Camelo", "Tem corcovas e atravessa desertos"],
    ["Polvo", "Oito tentáculos e solta tinta"],
    ["Caranguejo", "Anda de lado e tem pinças"],
    ["Morcego", "Mamífero que voa e dorme de cabeça para baixo"],
    ["Camaleão", "Muda de cor e tem língua comprida"]
  ],
  esportes: [
    ["Futebol", "Dois times, uma bola e gols"],
    ["Basquete", "Bola laranja e cesta no alto"],
    ["Vôlei", "Bola por cima da rede, jogada com as mãos"],
    ["Natação", "Estilos como crawl e borboleta numa piscina"],
    ["Tênis", "Raquete, rede e quadra de saibro ou grama"],
    ["Judô", "Luta de quimono e faixas"],
    ["Boxe", "Luvas e ringue"],
    ["Surfe", "Pranchas em cima das ondas"],
    ["Skate", "Rodinhas, manobras e pistas"],
    ["Ciclismo", "Pedalar por longas distâncias"],
    ["Corrida", "Vence quem chega primeiro a pé"],
    ["Ginástica", "Saltos, piruetas e barras"],
    ["Xadrez", "Rei e rainha num tabuleiro de 64 casas"],
    ["Handebol", "Jogo de mãos com gol e bola pequena"],
    ["Rúgbi", "Bola oval e muito contato físico"],
    ["Golfe", "Tacos e buraquinhos num gramado"],
    ["Beisebol", "Taco, luva e bases em losango"],
    ["Karatê", "Arte marcial com golpes e faixa preta"],
    ["Capoeira", "Luta disfarçada de dança, com berimbau"],
    ["Escalada", "Subir paredões com cordas e mãos firmes"],
    ["Esqui", "Deslizar na neve com varas"],
    ["Patinação", "Deslizar com lâminas no gelo ou rodinhas nos pés"],
    ["Remo", "Barco movido por pás"],
    ["Hóquei", "Taco e disco no gelo"],
    ["Futsal", "Futebol de salão em quadra pequena"],
    ["Atletismo", "Corridas, saltos e arremessos"],
    ["Salto com Vara", "O atleta usa um bastão flexível para passar por uma barra alta"],
    ["Arco e Flecha", "Mira num alvo de longe"],
    ["Esgrima", "Duelo com espadas e máscara"],
    ["Boliche", "Derrubar pinos com uma bola pesada"],
    ["Sinuca", "Taco e bolas coloridas na mesa de feltro"],
    ["Dardos", "Arremessar setinhas num alvo"],
    ["Pingue-Pongue", "Raquetinhas e bolinha numa mesa"],
    ["Badminton", "Raquetes e peteca de penas por cima da rede"],
    ["Maratona", "Corrida de mais de 40 km"],
    ["Triatlo", "Três modalidades seguidas: nadar, pedalar e correr"]
  ],
  paises: [
    ["Brasil", "País do carnaval, do café e do futebol"],
    ["Argentina", "Vizinho do sul, do tango e do mate"],
    ["Japão", "Terra do sol nascente, de samurais e animes"],
    ["Itália", "País em forma de bota, da pizza e da massa"],
    ["França", "País do queijo, do vinho e de uma torre de ferro famosa"],
    ["Egito", "Terra de pirâmides e faraós"],
    ["Canadá", "Terra da folha de bordo e de muito frio"],
    ["Austrália", "País-continente de cangurus"],
    ["Portugal", "País europeu que fala nossa língua"],
    ["México", "País dos tacos, mariachis e pirâmides astecas"],
    ["China", "País muito populoso com uma grande muralha"],
    ["Índia", "País de mais de um bilhão de pessoas, com Taj Mahal e curry"],
    ["Rússia", "Maior país do mundo, de inverno rigoroso"],
    ["Alemanha", "País da cerveja, de carros famosos e salsichas"],
    ["Espanha", "País de flamenco, touradas e paella"],
    ["Inglaterra", "Terra do chá das cinco e da realeza"],
    ["Estados Unidos", "País de 50 estados e uma estátua da liberdade"],
    ["Chile", "País comprido e estreito junto à Cordilheira"],
    ["Peru", "País andino das lhamas e de ruínas incas"],
    ["Colômbia", "País do café e de Shakira"],
    ["Suíça", "País de chocolates, relógios e neutralidade"],
    ["Grécia", "Berço da filosofia, com muitas ilhas"],
    ["Turquia", "País entre dois continentes e de tapetes famosos"],
    ["Coreia do Sul", "País do K-pop e dos doramas"],
    ["África do Sul", "País do extremo sul da África, terra de Mandela"],
    ["Paris", "Capital da moda e do amor"],
    ["Londres", "Cidade de ônibus vermelhos e do Big Ben"],
    ["Nova York", "Cidade que nunca dorme, de arranha-céus"],
    ["Tóquio", "Capital super moderna do sol nascente"],
    ["Rio de Janeiro", "Cidade maravilhosa de morros e praias famosas"],
    ["São Paulo", "Maior metrópole brasileira, cidade da garoa"],
    ["Roma", "Cidade eterna do Coliseu"],
    ["Veneza", "Cidade de canais e gôndolas"],
    ["Dubai", "Cidade de arranha-céus no deserto"],
    ["Las Vegas", "Cidade de luzes e jogos de azar no deserto"],
    ["Hollywood", "Bairro do cinema americano, de letreiro famoso no morro"],
    ["Amazônia", "Maior floresta tropical do mundo"],
    ["Cataratas do Iguaçu", "Quedas de água enormes na fronteira do Brasil"],
    ["Machu Picchu", "Cidade inca no alto das montanhas"],
    ["Torre Eiffel", "Estrutura de ferro que simboliza uma capital europeia"]
  ],
  natureza: [
    ["Floresta", "Muitas árvores juntas"],
    ["Deserto", "Areia, calor e quase nenhuma água"],
    ["Ilha", "Terra cercada de água por todos os lados"],
    ["Montanha", "Elevação enorme de terra e pedra"],
    ["Rio", "Água doce que corre até o mar"],
    ["Lago", "Água parada rodeada de terra"],
    ["Oceano", "Enorme extensão de água salgada"],
    ["Cachoeira", "Água que despenca de um desnível"],
    ["Caverna", "Buraco escuro na rocha com estalactites"],
    ["Vulcão", "Montanha que solta lava"],
    ["Geleira", "Massa gigante de gelo que escorre devagar"],
    ["Pântano", "Terreno alagado e lamacento"],
    ["Savana", "Planície de capim com leões e zebras"],
    ["Selva", "Mata densa e úmida cheia de cipós"],
    ["Recife de Coral", "Paraíso colorido debaixo d'água"],
    ["Chuva", "Gotas que caem das nuvens"],
    ["Neve", "Flocos brancos e gelados que cobrem o chão"],
    ["Terremoto", "Chão que treme forte"],
    ["Furacão", "Vento giratório gigantesco sobre o mar"],
    ["Arco-íris", "Sete cores no céu depois da chuva com sol"],
    ["Trovão", "Estrondo no céu durante a tempestade"],
    ["Raio", "Clarão elétrico que corta o céu"],
    ["Neblina", "Nuvem baixa que atrapalha a visão"],
    ["Tsunami", "Onda gigante depois de um abalo no fundo do mar"],
    ["Tempestade", "Chuva forte com trovões e ventania"],
    ["Tornado", "Funil de vento que arranca tudo"],
    ["Seca", "Falta de água por muito tempo"],
    ["Enchente", "Água invade ruas e casas depois de muita chuva"],
    ["Sol", "Estrela que ilumina o dia"],
    ["Lua", "Satélite natural que brilha à noite"],
    ["Estrelas", "Pontinhos de luz no céu noturno"],
    ["Nuvem", "Algodão branco ou cinza no céu"],
    ["Vento", "Ar em movimento que sopra"],
    ["Orvalho", "Gotinhas de água nas folhas de manhã"],
    ["Areia", "Grãos finos de praia e deserto"],
    ["Pedra", "Dura e sólida, rocha pequena"],
    ["Cogumelo", "Cresce em lugar úmido e tem chapéu"],
    ["Girassol", "Flor amarela que vira o rosto para o astro-rei"],
    ["Rosa", "Flor de espinhos e perfume"],
    ["Cacto", "Planta espinhosa que vive em lugar seco"],
    ["Bambu", "Planta de caule oco e comprido, alimento do panda"],
    ["Palmeira", "Árvore de tronco alto e folhas só no topo, comum em praias"]
  ],
  tecnologia: [
    ["Wi-Fi", "Internet sem fio em casa"],
    ["Bluetooth", "Conexão sem fio de curta distância entre aparelhos"],
    ["Robô", "Máquina programada que faz tarefas sozinha"],
    ["Drone", "Aparelho voador sem piloto a bordo, com hélices"],
    ["Inteligência Artificial", "Máquinas que aprendem e conversam"],
    ["Videogame", "Console para jogar na TV"],
    ["Joystick", "Controle com botões e alavanca para jogos"],
    ["Teclado", "Teclas para digitar letras"],
    ["Mouse", "Apontador que clica na tela"],
    ["Monitor", "Tela ligada a um computador"],
    ["Impressora", "Passa o digital para o papel"],
    ["Câmera", "Registra fotos e vídeos"],
    ["Satélite", "Orbita a Terra e transmite sinais"],
    ["Antena", "Capta sinais de TV ou rádio"],
    ["Bateria", "Guarda a energia do celular"],
    ["Carregador", "Fio que recarrega aparelhos na tomada"],
    ["Pen Drive", "Pequeno dispositivo USB para guardar arquivos"],
    ["Aplicativo", "Programa instalado no celular"],
    ["Rede Social", "Lugar de curtidas, seguidores e posts"],
    ["Emoji", "Carinhas amarelas nas mensagens"],
    ["Senha", "Código secreto para entrar em contas"],
    ["Hacker", "Especialista que invade sistemas"],
    ["Vírus", "Programa que infecta computadores"],
    ["Site", "Página da internet com endereço"],
    ["E-mail", "Carta eletrônica com arroba"],
    ["Podcast", "Programa de áudio sob demanda sobre assuntos variados"],
    ["Streaming", "Filmes e séries pela internet, sem baixar"],
    ["Realidade Virtual", "Óculos que levam você para um mundo digital"],
    ["Smartwatch", "Relógio que recebe notificações"],
    ["Tablet", "Tela sensível ao toque, maior que um celular"],
    ["QR Code", "Quadradinho preto e branco que se escaneia"],
    ["GPS", "Ensina o caminho em tempo real"],
    ["Calculadora", "Faz contas matemáticas"],
    ["Servidor", "Computador potente que armazena dados na rede"],
    ["Código", "Linhas escritas por programadores"],
    ["Jogo Online", "Partida contra outros jogadores pela internet"]
  ],
  musica: [
    ["Violão", "Seis cordas e caixa de madeira"],
    ["Guitarra", "Cordas elétricas ligadas a um amplificador"],
    ["Bateria", "Pratos, caixas e baquetas"],
    ["Piano", "Teclas pretas e brancas e pedais"],
    ["Violino", "Cordas esfregadas com arco"],
    ["Flauta", "Instrumento de sopro fino e longo"],
    ["Saxofone", "Sopro curvo e dourado do jazz"],
    ["Trompete", "Sopro de metal com três pistos"],
    ["Acordeão", "Fole que abre e fecha, tocado em festas juninas"],
    ["Cavaquinho", "Pequeno, de quatro cordas"],
    ["Pandeiro", "Roda com platinelas que se bate com a mão"],
    ["Tambor", "Pele esticada que se bate com baquetas"],
    ["Microfone", "Amplifica a voz de quem canta"],
    ["Harpa", "Cordas verticais dedilhadas, de aparência celestial"],
    ["Xilofone", "Barras de madeira ou metal batidas com martelinhos"],
    ["Samba", "Ritmo brasileiro do carnaval"],
    ["Funk", "Batidão popular dos bailes"],
    ["Sertanejo", "Música de viola, caipira e de amor"],
    ["Rock", "Guitarras pesadas e atitude"],
    ["Pagode", "Roda de samba descontraída com cavaco"],
    ["Forró", "Dança de pé de serra com sanfona"],
    ["Rap", "Rimas faladas em cima de batidas"],
    ["Ópera", "Canto lírico dramático em teatro"],
    ["Orquestra", "Grande grupo de instrumentos clássicos com maestro"],
    ["Coral", "Várias vozes cantando juntas"],
    ["Karaokê", "Canta-se acompanhando a letra na tela"],
    ["DJ", "Faz mixagens com toca-discos e controladores"],
    ["Maestro", "Rege os músicos com batuta"],
    ["Banda", "Grupo musical com vocalista e instrumentos"],
    ["Disco de Vinil", "Bolacha preta que gira na vitrola"],
    ["Show de Rock", "Palco, guitarras e plateia pulando"]
  ],
  transporte: [
    ["Carro", "Quatro rodas e volante"],
    ["Ônibus", "Transporte coletivo com vários bancos e ponto de parada"],
    ["Metrô", "Corta a cidade debaixo da terra"],
    ["Trem", "Vagões que andam sobre trilhos"],
    ["Avião", "Voa com asas e turbinas"],
    ["Helicóptero", "Voa com hélices no teto e pousa em qualquer lugar"],
    ["Navio", "Grande embarcação que cruza oceanos"],
    ["Barco", "Pequena embarcação que flutua"],
    ["Bicicleta", "Duas rodas e pedais"],
    ["Moto", "Duas rodas, capacete e acelerador"],
    ["Caminhão", "Gigante que carrega carga pesada"],
    ["Ambulância", "Veículo com sirene que leva doentes"],
    ["Táxi", "Carro de aluguel que se chama na rua ou pelo app"],
    ["Patinete", "Plataforma com guidão, roda pequena e impulso com o pé"],
    ["Balão de Ar Quente", "Cesto pendurado numa bolha que flutua no céu"],
    ["Submarino", "Navega embaixo d'água"],
    ["Foguete", "Sobe ao espaço soltando fogo"],
    ["Jet Ski", "Moto que corre sobre a água"],
    ["Trator", "Veículo agrícola de rodas enormes"],
    ["Trenó", "Desliza na neve puxado por renas"],
    ["Carroça", "Veículo puxado por cavalo"],
    ["Teleférico", "Cabine pendurada em cabos que sobe montanhas"],
    ["Bonde", "Veículo antigo sobre trilhos nas ruas da cidade"],
    ["Van", "Veículo médio que leva grupos"],
    ["Caminhonete", "Carro com caçamba"],
    ["Kart", "Carrinho baixo de corrida em pista pequena"],
    ["Barco a Vela", "Embarcação movida pelo vento"],
    ["Lancha", "Embarcação rápida de motor"],
    ["Ônibus Espacial", "Nave reutilizável da NASA"],
    ["Carro de Bombeiro", "Veículo vermelho com escada e mangueiras"]
  ],
  roupas: [
    ["Camiseta", "Peça básica de malha com mangas curtas"],
    ["Calça Jeans", "Peça azul de tecido resistente"],
    ["Vestido", "Peça única que cobre o corpo todo, comum em festas"],
    ["Saia", "Peça que cobre da cintura para baixo, sem repartir as pernas"],
    ["Bermuda", "Calça curta até o joelho"],
    ["Moletom", "Blusa grossa e quentinha com capuz"],
    ["Jaqueta", "Casaco curto, de couro ou jeans"],
    ["Casaco", "Veste-se por cima para o frio"],
    ["Terno", "Roupa formal de paletó e calça"],
    ["Gravata", "Tira de pano no pescoço de roupa formal"],
    ["Meia", "Cobre os pés dentro do calçado"],
    ["Tênis", "Calçado esportivo com cadarço"],
    ["Chinelo", "Calçado aberto de borracha para o verão"],
    ["Sandália", "Calçado aberto com tiras"],
    ["Bota", "Calçado que cobre o tornozelo ou a perna"],
    ["Sapato", "Calçado fechado, de couro, para ocasiões formais"],
    ["Boné", "Cobre a cabeça e tem aba na frente"],
    ["Chapéu", "Cobre a cabeça e tem aba em volta"],
    ["Gorro", "Touca de lã para o frio"],
    ["Cachecol", "Tira de lã que aquece o pescoço"],
    ["Luvas", "Aquecem as mãos"],
    ["Cinto", "Segura a calça na cintura"],
    ["Óculos de Sol", "Protegem os olhos da luz forte"],
    ["Biquíni", "Traje de banho de duas peças"],
    ["Sunga", "Traje de banho masculino justo"],
    ["Pijama", "Roupa de dormir"],
    ["Uniforme", "Roupa igual para todos de um time ou escola"],
    ["Fantasia", "Roupa de personagem usada em festas e carnaval"],
    ["Avental", "Protege a roupa na cozinha"],
    ["Colar", "Enfeite pendurado no pescoço"],
    ["Pulseira", "Enfeite que enrola no punho"],
    ["Anel", "Enfeite que se coloca no dedo"],
    ["Brinco", "Enfeite que fica na orelha"],
    ["Lenço", "Pedaço de pano para o pescoço ou a cabeça"],
    ["Bolsa", "Acessório para carregar objetos pessoais no ombro"]
  ],
  casa: [
    ["Cozinha", "Cômodo de fogão, geladeira e panelas"],
    ["Banheiro", "Cômodo com pia, espelho e chuveiro"],
    ["Quarto", "Cômodo onde se dorme"],
    ["Sala de Estar", "Cômodo com sofá e TV para receber visitas"],
    ["Garagem", "Lugar de guardar o carro"],
    ["Quintal", "Área aberta atrás da casa, para brincar"],
    ["Varanda", "Sacada aberta com vista"],
    ["Sótão", "Espaço sob o telhado onde se guardam velharias"],
    ["Porão", "Parte subterrânea e escura da casa"],
    ["Escada", "Degraus que ligam andares"],
    ["Janela", "Abertura com vidro para olhar para fora"],
    ["Porta", "Abre e fecha entre cômodos"],
    ["Telhado", "Cobre a casa e protege da chuva"],
    ["Chuveiro", "Água cai de cima na hora do banho"],
    ["Privada", "Peça do banheiro que tem descarga"],
    ["Pia", "Bacia com torneira para lavar as mãos ou a louça"],
    ["Banheira", "Tanque para banho de imersão"],
    ["Fogão", "Bocas com chamas para cozinhar"],
    ["Máquina de Lavar", "Tambor que gira com sabão"],
    ["Aspirador de Pó", "Aparelho que suga a sujeira"],
    ["Sofá", "Assento grande e macio para várias pessoas"],
    ["Cama", "Lugar de deitar, com colchão"],
    ["Armário", "Móvel com portas para guardar roupas ou louças"],
    ["Estante", "Móvel com prateleiras para livros"],
    ["Mesa de Jantar", "Onde a família faz refeições"],
    ["Tapete", "Cobre o chão e esquenta os pés"],
    ["Cortina", "Tecido que cobre a janela"],
    ["Lustre", "Luminária pendurada no teto"],
    ["Campainha", "Toca quando alguém chega"],
    ["Portão", "Entrada da casa, com fechadura ou controle"],
    ["Churrasqueira", "Espaço de grelha e carvão"],
    ["Rede", "Tecido pendurado pelas pontas para balançar e descansar"],
    ["Varal", "Cordas para secar roupa ao sol"],
    ["Despensa", "Lugar de estocar mantimentos"],
    ["Lareira", "Fogo dentro de casa para aquecer no inverno"],
    ["Escrivaninha", "Mesa com gavetas para estudar ou trabalhar"]
  ],
  escola: [
    ["Matemática", "Números, contas e equações"],
    ["Português", "Gramática, redação e interpretação de texto"],
    ["História", "Estuda fatos e datas do passado"],
    ["Geografia", "Estuda mapas, países e relevo"],
    ["Ciências", "Estuda a natureza e o corpo humano"],
    ["Educação Física", "Aula de quadra, jogos e alongamento"],
    ["Inglês", "Aula de língua estrangeira falada em muitos países"],
    ["Artes", "Desenho, pintura e música nas aulas"],
    ["Química", "Tabela periódica e experimentos com reações"],
    ["Física", "Estuda movimento, força e energia"],
    ["Biologia", "Estuda seres vivos e células"],
    ["Recreio", "Hora de brincar e lanchar entre as aulas"],
    ["Prova", "Dia de tensão para mostrar o que aprendeu"],
    ["Lição de Casa", "Tarefa para fazer longe da sala"],
    ["Quadro Negro", "Superfície escura onde se escreve com pó branco"],
    ["Giz", "Pó branco que escreve no quadro"],
    ["Diretor", "Chefe de toda a escola"],
    ["Merenda", "Lanche servido na escola"],
    ["Formatura", "Cerimônia de beca e capelo ao final do curso"],
    ["Boletim", "Papel com as notas do bimestre"],
    ["Vestibular", "Prova disputada para entrar na faculdade"],
    ["Apostila", "Material impresso cheio de exercícios"],
    ["Lousa", "Superfície de escrever do professor, branca ou verde"],
    ["Sala de Aula", "Carteiras enfileiradas voltadas ao professor"],
    ["Intervalo", "Pausa entre uma aula e outra"],
    ["Trabalho em Grupo", "Tarefa dividida entre colegas e cartolina"],
    ["Nota", "Número que mede seu desempenho"],
    ["Reprovação", "Quando não se passa de ano"],
    ["Cola", "Papelzinho escondido que ninguém deve usar"],
    ["Excursão", "Passeio da turma fora da escola"],
    ["Gincana", "Competição divertida entre equipes"],
    ["Feira de Ciências", "Evento com maquetes e experimentos dos alunos"]
  ],
  festas: [
    ["Aniversário", "Parabéns, velinhas e bolo uma vez por ano"],
    ["Natal", "25 de dezembro com presentes e ceia"],
    ["Ano Novo", "Virada do calendário, com promessas"],
    ["Carnaval", "Festa de fantasias, blocos e desfiles"],
    ["Páscoa", "Época de coelho e chocolate"],
    ["Halloween", "Festa de abóboras, fantasias assustadoras e doces"],
    ["Festa Junina", "Bandeirinhas, fogueira e comidas de milho"],
    ["Casamento", "Cerimônia de alianças, noivos e padrinhos"],
    ["Chá de Bebê", "Festa para celebrar a chegada de um recém-nascido"],
    ["Dia dos Namorados", "12 de junho, data para casais"],
    ["Dia das Mães", "Segundo domingo de maio, de homenagens"],
    ["Dia dos Pais", "Segundo domingo de agosto, de homenagens a eles"],
    ["Réveillon", "Meia-noite com contagem regressiva e roupa branca"],
    ["Bolo de Aniversário", "Tem velas e se corta depois do parabéns"],
    ["Presente", "Embrulhado com laço para dar a alguém"],
    ["Confete", "Papeizinhos coloridos jogados em festas"],
    ["Serpentina", "Fita de papel enrolada que se joga"],
    ["Fogos de Artifício", "Explosões coloridas no céu"],
    ["Piñata", "Recipiente cheio de doces que se quebra com um bastão"],
    ["Quadrilha", "Dança de casais da festa de junho"],
    ["Fogueira", "Lenha em chamas à noite"],
    ["Papai Noel", "Velhinho de barba branca e roupa vermelha"],
    ["Árvore de Natal", "Pinheiro enfeitado com luzinhas e bolas"],
    ["Ovo de Páscoa", "Chocolate em formato oval e recheado"],
    ["Baile", "Evento de dança a rigor, em salão"],
    ["Balada", "Noitada com música alta e pista"],
    ["Piquenique", "Refeição ao ar livre sobre uma toalha"],
    ["Amigo Secreto", "Troca de presentes com sorteio de nomes"]
  ],
  corpo: [
    ["Coração", "Bate sem parar no peito"],
    ["Cérebro", "Comanda o corpo de dentro do crânio"],
    ["Pulmão", "Enche de ar quando respiramos"],
    ["Estômago", "Recebe a comida e faz barulho quando tem fome"],
    ["Fígado", "Grande órgão do lado direito que filtra toxinas"],
    ["Rim", "Filtra o sangue e produz xixi, são dois"],
    ["Osso", "Parte dura e branca que sustenta o corpo"],
    ["Músculo", "Cresce com treino e movimenta o corpo"],
    ["Pele", "Maior órgão, cobre todo o corpo"],
    ["Cabelo", "Fios na cabeça que crescem e podem ser cortados"],
    ["Unha", "Placa dura na ponta dos dedos"],
    ["Dente", "Branquinho e duro, usado para mastigar"],
    ["Língua", "Sente os sabores e ajuda a falar"],
    ["Olho", "Enxerga com pupila e íris"],
    ["Nariz", "Sente cheiros e respira"],
    ["Orelha", "Capta sons por fora"],
    ["Joelho", "Articulação que dobra a perna"],
    ["Cotovelo", "Articulação que dobra o braço"],
    ["Tornozelo", "Articulação entre perna e pé"],
    ["Umbigo", "Cicatriz no meio da barriga"],
    ["Barriga", "Parte da frente do tronco, perto do umbigo"],
    ["Costas", "Parte de trás do tronco"],
    ["Pescoço", "Liga a cabeça ao tronco"],
    ["Ombro", "Articulação entre braço e tronco"],
    ["Pé", "Parte final da perna, de cinco dedos"],
    ["Mão", "Parte final do braço, de cinco dedos"],
    ["Dedo", "Tem cinco em cada mão"],
    ["Sangue", "Líquido vermelho que circula nas veias"],
    ["Esqueleto", "Conjunto de ossos que sustenta o corpo"],
    ["Coluna", "Eixo de vértebras que sustenta as costas"]
  ],
  fantasia: [
    ["Dragão", "Réptil gigante que voa e cospe fogo"],
    ["Unicórnio", "Cavalo branco com chifre no meio da testa"],
    ["Fada", "Criaturinha com asas e pó mágico"],
    ["Bruxa", "Chapéu pontudo, caldeirão e vassoura voadora"],
    ["Mago", "Usa cajado e conhece feitiços poderosos"],
    ["Vampiro", "Dorme de dia em caixão e tem presas"],
    ["Lobisomem", "Vira fera peluda na lua cheia"],
    ["Zumbi", "Morto-vivo que anda devagar querendo cérebros"],
    ["Fantasma", "Espírito transparente que assombra"],
    ["Sereia", "Metade mulher, metade peixe"],
    ["Gigante", "Criatura enorme que faz o chão tremer"],
    ["Duende", "Ser pequeno e travesso de orelhas pontudas"],
    ["Elfo", "Ser de orelhas pontudas que vive em florestas"],
    ["Anão", "Pequeno, barbudo e ótimo com minas e machados"],
    ["Troll", "Monstro que vive debaixo de pontes"],
    ["Ogro", "Monstro grande e fedorento de clava"],
    ["Fênix", "Ave de fogo que renasce das cinzas"],
    ["Minotauro", "Meio homem, meio touro, preso num labirinto"],
    ["Centauro", "Metade homem, metade cavalo"],
    ["Gênio da Lâmpada", "Realiza três desejos depois de ser esfregado"],
    ["Varinha Mágica", "Bastão que lança feitiços"],
    ["Poção", "Líquido borbulhante com efeito mágico"],
    ["Espada", "Arma de lâmina de cavaleiros"],
    ["Escudo", "Proteção carregada no braço em batalhas"],
    ["Castelo Mal-Assombrado", "Construção antiga cheia de espíritos"],
    ["Tesouro", "Baú de moedas de ouro e joias escondido"],
    ["Pirata", "Navega com bandeira de caveira e tapa-olho"],
    ["Cavaleiro", "Veste armadura e monta a cavalo"],
    ["Princesa", "Filha do rei, de coroa e vestido"],
    ["Rei", "Governa com coroa e trono"],
    ["Rainha", "Esposa do rei ou soberana de coroa"],
    ["Ninja", "Guerreiro furtivo, vestido de preto"],
    ["Samurai", "Guerreiro japonês de katana"],
    ["Super-Herói", "Tem superpoderes e salva o dia, de capa"],
    ["Vilão", "Antagonista das histórias"],
    ["Alienígena", "Visitante de outro planeta"],
    ["Zeus", "Deus grego dos raios"],
    ["Hércules", "Herói grego de força incrível e doze trabalhos"]
  ],
  brasil: [
    ["Saci-Pererê", "Lenda de uma perna só, gorro vermelho e cachimbo"],
    ["Curupira", "Protetor da mata, de pés virados para trás"],
    ["Boto Cor-de-Rosa", "Lenda amazônica que vira homem bonito em festas"],
    ["Mula sem Cabeça", "Lenda do animal que solta fogo pelo pescoço"],
    ["Iara", "Mãe d'água que canta e atrai pescadores"],
    ["Cuca", "Vilã jacaré do Sítio do Picapau Amarelo"],
    ["Cristo Redentor", "Estátua de braços abertos no alto de um morro carioca"],
    ["Pão de Açúcar", "Morro famoso do Rio com bondinho"],
    ["Copacabana", "Praia de calçadão ondulado e orla famosa"],
    ["Pantanal", "Maior planície alagada do mundo, cheia de jacarés"],
    ["Lençóis Maranhenses", "Dunas brancas com lagoas de água da chuva"],
    ["Fernando de Noronha", "Arquipélago paradisíaco de golfinhos em Pernambuco"],
    ["Maracanã", "Estádio mais famoso do Rio"],
    ["Pelé", "Rei do futebol, tricampeão mundial"],
    ["Santos Dumont", "Pai da aviação, voou o 14-Bis"],
    ["Guaraná", "Fruto amazônico que vira refrigerante nacional"],
    ["Caipirinha", "Drinque de cachaça, limão e açúcar"],
    ["Chimarrão", "Bebida gaúcha tomada em cuia com bomba"],
    ["Jabuticaba", "Fruta preta que nasce no tronco da árvore"],
    ["Caju", "Fruta com a castanha do lado de fora"],
    ["Mandioca", "Raiz que vira farinha e tapioca"],
    ["Maracatu", "Ritmo e cortejo de Pernambuco com tambores e coroação"],
    ["Frevo", "Dança pernambucana com sombrinhas coloridas"],
    ["Berimbau", "Instrumento de um arco e cabaça que acompanha a capoeira"],
    ["Arraiá", "Festa caipira de junho com quadrilha"],
    ["Cangaceiro", "Bandoleiro do sertão de chapéu de couro"],
    ["Gaúcho", "Habitante do Sul de bombacha e chimarrão"],
    ["Jangada", "Embarcação simples de troncos usada no Nordeste"],
    ["Axé", "Música baiana animada com trios elétricos"],
    ["Lampião", "Rei do cangaço"],
    ["Literatura de Cordel", "Folhetos pendurados em barbante com versos do Nordeste"],
    ["Arara", "Ave colorida e barulhenta da selva"],
    ["Mico-Leão-Dourado", "Macaquinho de pelagem alaranjada ameaçado da Mata Atlântica"],
    ["Escola de Samba", "Agremiação que desfila na avenida no Carnaval"],
    ["Futebol de Várzea", "Jogo de campo de terra entre amigos"]
  ],
  espaco: [
    ["Marte", "Planeta vermelho"],
    ["Júpiter", "Maior planeta do sistema solar, com uma grande mancha"],
    ["Saturno", "Planeta dos anéis"],
    ["Vênus", "Planeta mais quente, vizinho da Terra"],
    ["Mercúrio", "Menor planeta e o mais próximo do Sol"],
    ["Netuno", "Planeta azul e distante, de ventos fortíssimos"],
    ["Urano", "Planeta gelado que gira deitado"],
    ["Plutão", "Antigo nono planeta, hoje considerado anão"],
    ["Via Láctea", "Nossa galáxia em espiral"],
    ["Galáxia", "Conjunto gigante de bilhões de estrelas"],
    ["Buraco Negro", "Região do espaço que engole até a luz"],
    ["Cometa", "Bola de gelo com cauda brilhante"],
    ["Asteroide", "Rocha que vaga pelo espaço"],
    ["Meteoro", "Risco de luz quando uma rocha entra na atmosfera"],
    ["Eclipse", "Quando um astro tapa outro"],
    ["Constelação", "Grupo de estrelas que forma desenho"],
    ["Telescópio", "Instrumento para observar o céu"],
    ["Estação Espacial", "Laboratório em órbita onde vivem astronautas"],
    ["OVNI", "Objeto voador não identificado"],
    ["Big Bang", "Teoria da explosão que originou o universo"],
    ["Gravidade", "Força que nos mantém no chão"],
    ["Átomo", "Partícula minúscula que forma a matéria"],
    ["Microscópio", "Instrumento que aumenta o que é minúsculo"],
    ["Laboratório", "Lugar de jalecos, tubos de ensaio e experimentos"],
    ["Fórmula", "Receita de símbolos e números da ciência"],
    ["DNA", "Molécula em hélice com o código da vida"],
    ["Dinossauro", "Réptil gigante que viveu há milhões de anos"],
    ["Fóssil", "Resto de ser vivo preso em rocha"],
    ["Eletricidade", "Corrente que passa pelos fios e acende lâmpadas"],
    ["Magnetismo", "Força de ímãs que atrai metais"],
    ["Bússola", "Agulha que aponta o norte"]
  ]
};

const CATS = {
  all: '🔀 Todas as Categorias',
  lugares: '🏙️ Lugares & Locais',
  comida: '🍕 Comidas & Bebidas',
  profissoes: '💼 Profissões & Trabalhos',
  pop: '🍿 Filmes & Pop Culture',
  objetos: '📦 Objetos do Dia a Dia',
  animais: '🐾 Animais',
  esportes: '⚽ Esportes & Jogos',
  paises: '🌍 Países & Cidades',
  natureza: '🌿 Natureza & Clima',
  tecnologia: '💻 Tecnologia & Internet',
  musica: '🎵 Música & Instrumentos',
  transporte: '🚗 Transportes & Veículos',
  roupas: '👕 Roupas & Acessórios',
  casa: '🏠 Casa & Cômodos',
  escola: '🎓 Escola & Matérias',
  festas: '🎉 Festas & Datas',
  corpo: '🧠 Corpo Humano',
  fantasia: '🧙 Fantasia & Mitologia',
  brasil: '🇧🇷 Cultura Brasileira',
  espaco: '🚀 Espaço & Ciência'
};

/* STUN + TURN: permite conectar aparelhos em redes diferentes (PC no Wi-Fi + celular no 4G/5G) */
const PEER_OPTS = {
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:global.stun.twilio.com:3478' },
      { urls: ['turn:openrelay.metered.ca:80', 'turn:openrelay.metered.ca:443', 'turn:openrelay.metered.ca:443?transport=tcp'],
        username: 'openrelayproject', credential: 'openrelayproject' }
    ],
    iceCandidatePoolSize: 4
  }
};

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

/* ---------- utilidades ---------- */
const $ = id => document.getElementById(id);
const rand = n => Math.floor(Math.random() * n);
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
const TOKEN = (() => {
  const mk = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
  try { let t = sessionStorage.getItem('impostor-token'); if (!t) { t = mk(); sessionStorage.setItem('impostor-token', t); } return t; }
  catch (e) { return mk(); }
})();
const cleanName = s => String(s || '').replace(/\s+/g, ' ').trim().slice(0, 16);

function genCode() {
  let c = '';
  for (let i = 0; i < 4; i++) c += CODE_CHARS[rand(CODE_CHARS.length)];
  return c;
}

/* quantidade de impostores: no máximo metade dos jogadores (menos 1), sempre pelo menos 1 */
const maxImp = n => Math.max(1, Math.floor((n - 1) / 2));
const effImp = (want, n) => Math.max(1, Math.min(want || 1, maxImp(n)));
function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const joinNames = a => a.length < 2 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1];
const impLabel = k => k + ' impostor' + (k > 1 ? 'es' : '');

/* sorteia uma palavra evitando repetir as últimas usadas neste aparelho */
function pickWord(category) {
  let pool = [];
  if (category === 'all') Object.values(WORD_DATABASE).forEach(c => pool.push(...c));
  else pool = WORD_DATABASE[category] || WORD_DATABASE.lugares;
  const seen = new Set();
  pool = pool.filter(e => { const k = e[0] + '|' + e[1]; if (seen.has(k)) return false; seen.add(k); return true; });
  let recent = [];
  try { recent = JSON.parse(store.get('impostor-recent') || '[]'); } catch (e) {}
  if (!Array.isArray(recent)) recent = [];
  const fresh = pool.filter(e => !recent.includes(e[0]));
  const src = fresh.length ? fresh : pool;
  const e = src[rand(src.length)];
  recent.push(e[0]);
  store.set('impostor-recent', JSON.stringify(recent.slice(-Math.max(1, Math.min(30, Math.floor(pool.length / 2))))));
  return { word: e[0], hint: e[1] };
}

let toastTimer = null;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

let cur = 's-home';
function show(id) {
  cur = id;
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('hidden', s.id !== id));
}

/* Mantém a tela acesa durante a partida (quando o navegador permite) */
let wakeLock = null;
async function keepAwake() {
  try { if (navigator.wakeLock && !wakeLock) wakeLock = await navigator.wakeLock.request('screen'); } catch (e) {}
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && mode) { wakeLock = null; keepAwake(); }
});

/* ---------- estado ---------- */
let mode = null;                       // 'local' | 'host' | 'guest'
let net = { peer: null, conn: null, active: false };
let G = null;                          // estado do anfitrião (autoridade)
let ME = freshME();                    // visão do cliente (vale para host e guest)
const L = { n: 4, idx: 0, imps: [], word: '', hint: '', hintOn: false };            // partida local
const LS = { category: 'all', time: 3, custom: '', customHint: '', impostors: 1, hint: false };                 // configurações do modo local
let revealDone = () => {};
let revealRole = null;                // papel exibido no cartão (jogadores adicionados no mesmo celular)
let revealQ = null;
let settingsUI = null;               // seletor de configurações do anfitrião (lobby)

function freshME() {
  return { id: null, code: '', role: null, players: [], hostId: null, phase: 'lobby',
           settings: { category: 'all', time: 3, impostors: 1, hint: false }, imps: 1, myVote: null, suggestions: 0, mySuggest: '', mySuggestHint: '',
           locals: [], votes: {}, voteAs: null };
}

/* ---------- configurações (categoria + tempo) ---------- */
function mountSettings(el, obj, onChange, getN) {
  getN = getN || (() => 3);
  el.innerHTML =
    '<div class="field"><label class="lbl">Categoria de palavras</label><select class="select">' +
    Object.entries(CATS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('') +
    '</select></div>' +
    '<div class="field" style="margin-top:1.25rem"><label class="lbl">Quantidade de impostores</label>' +
    '<div class="stepper">' +
    '<button type="button" class="step-btn" data-d="-1" aria-label="Menos impostores">−</button>' +
    '<div class="step-val"><strong class="imp-val">1</strong><small class="imp-hint muted small"></small></div>' +
    '<button type="button" class="step-btn" data-d="1" aria-label="Mais impostores">+</button>' +
    '</div></div>' +
    '<div class="field" style="margin-top:1.25rem"><label class="lbl">Dica para o impostor</label>' +
    '<div class="grid-hint">' +
    '<button type="button" class="timer-btn" data-hint="0">🚫 Sem dica</button>' +
    '<button type="button" class="timer-btn" data-hint="1">💡 Com dica</button>' +
    '</div><p class="muted small hint-note"></p></div>' +
    '<div class="field" style="margin-top:1.25rem"><label class="lbl">Tempo de discussão</label><div class="grid4">' +
    [[2, '2 min'], [3, '3 min'], [5, '5 min'], [0, 'Sem tempo']]
      .map(([v, l]) => `<button type="button" class="timer-btn" data-time="${v}">${l}</button>`).join('') +
    '</div></div>';
  const sel = el.querySelector('select');
  const btns = [...el.querySelectorAll('.timer-btn[data-time]')];
  const paint = () => btns.forEach(b => b.classList.toggle('active', +b.dataset.time === obj.time));
  sel.value = obj.category;
  sel.onchange = () => { obj.category = sel.value; if (onChange) onChange(); };
  btns.forEach(b => b.onclick = () => { obj.time = +b.dataset.time; paint(); if (onChange) onChange(); });
  paint();

  // modo com dica / sem dica (o impostor recebe uma pista sobre a palavra)
  const hbtns = [...el.querySelectorAll('.timer-btn[data-hint]')];
  const hnote = el.querySelector('.hint-note');
  const paintHint = () => {
    hbtns.forEach(b => b.classList.toggle('active', (b.dataset.hint === '1') === !!obj.hint));
    hnote.textContent = obj.hint
      ? 'O impostor recebe uma dica sobre a palavra secreta.'
      : 'Modo clássico: o impostor não recebe nenhuma pista.';
  };
  hbtns.forEach(b => b.onclick = () => { obj.hint = b.dataset.hint === '1'; paintHint(); if (onChange) onChange(); });
  paintHint();

  // quantidade de impostores (limitada pelo número de jogadores)
  const stepBtns = [...el.querySelectorAll('.step-btn')];
  const valEl = el.querySelector('.imp-val'), hintEl = el.querySelector('.imp-hint');
  const paintImp = () => {
    const n = getN(), max = maxImp(n), v = effImp(obj.impostors, n);
    valEl.textContent = v;
    hintEl.textContent = `Máximo de ${impLabel(max)} com ${n} jogadores`;
    stepBtns[0].disabled = v <= 1;
    stepBtns[1].disabled = v >= max;
  };
  stepBtns.forEach(b => b.onclick = () => {
    const n = getN();
    obj.impostors = effImp(effImp(obj.impostors, n) + (+b.dataset.d), n);
    paintImp();
    if (onChange) onChange();
  });
  paintImp();
  return { refresh: paintImp };
}

/* ---------- cronômetro ---------- */
const T = { enabled: false, remaining: 0, running: false, h: null };

function timerSet(enabled, remaining, running) {
  clearInterval(T.h);
  T.enabled = enabled; T.remaining = remaining; T.running = running;
  renderTimer();
  if (enabled && running && remaining > 0) T.h = setInterval(timerTick, 1000);
}
function timerStop() { clearInterval(T.h); T.running = false; }

function timerTick() {
  T.remaining--;
  if (T.remaining <= 0) {
    T.remaining = 0; T.running = false; clearInterval(T.h);
    try { if (navigator.vibrate) navigator.vibrate([200, 100, 200]); } catch (e) {}
  }
  renderTimer();
  // o anfitrião ressincroniza os convidados a cada 5s
  if (mode === 'host' && T.remaining % 5 === 0) broadcast({ t: 'timer', remaining: T.remaining, running: T.running }, true);
}

function renderTimer() {
  $('timer-box').classList.toggle('hidden', !T.enabled);
  const m = String(Math.floor(T.remaining / 60)).padStart(2, '0');
  const s = String(T.remaining % 60).padStart(2, '0');
  $('timer-display').textContent = `${m}:${s}`;
  $('timer-display').classList.toggle('danger', T.enabled && T.remaining === 0);
  $('timer-status').textContent =
    T.remaining === 0 ? '⏰ Tempo esgotado! Votem no impostor.' : (T.running ? 'Conversa liberada' : 'Tempo pausado');
  $('btn-toggle-timer').textContent = T.running ? 'Pausar tempo' : 'Continuar tempo';
  $('btn-toggle-timer').classList.toggle('hidden', !T.enabled || mode === 'guest');
  $('btn-toggle-timer').disabled = T.remaining === 0;
}

/* ---------- cartão do papel ---------- */
let cardShown = false;
function renderCard(visible) {
  cardShown = visible;
  const c = $('role-card'), r = revealRole || ME.role;
  const hl = $('card-hint');
  hl.classList.add('hidden');
  if (!visible || !r) {
    c.className = 'rolecard';
    $('card-icon').textContent = '🔒';
    $('card-text').textContent = 'Toque para ver';
    $('card-sub').textContent = 'Certifique-se de que ninguém está olhando.';
  } else if (r.impostor) {
    c.className = 'rolecard imp';
    $('card-icon').textContent = '🤫';
    $('card-text').textContent = 'VOCÊ É O IMPOSTOR!';
    $('card-sub').textContent = 'Tente descobrir a palavra sem que percebam!';
    if (r.hintOn) {
      hl.textContent = r.hint ? '🔎 Dica: ' + r.hint : '🔎 Esta palavra não tem dica.';
      hl.classList.remove('hidden');
    }
  } else {
    c.className = 'rolecard ok';
    $('card-icon').textContent = '💡';
    $('card-text').textContent = r.word;
    $('card-sub').textContent = 'Essa é a palavra secreta dos inocentes.';
  }
}
$('role-card').onclick = () => renderCard(!cardShown);
$('btn-reveal-done').onclick = () => { renderCard(false); revealDone(); };

/* ---------- resultado (comum) ---------- */
function showResult(m) {
  show('s-result');
  const box = $('result-box');
  const won = m.winner === 'inocentes';
  box.className = 'result center ' + (won ? 'win' : 'lose');
  const k = m.k || 1;
  const imps = m.impostors || [];
  const impTxt = k > 1 ? `Os impostores eram ${joinNames(imps)}` : `O Impostor era ${imps[0]}`;
  $('result-title').textContent = won
    ? '🎉 Os inocentes venceram!'
    : (k > 1 ? '😈 Os impostores venceram!' : '😈 O impostor venceu!');
  let d;
  if (won) d = k > 1 ? `Os ${k} impostores foram descobertos: ${joinNames(imps)}!` : `${imps[0]} era realmente o Impostor!`;
  else if (m.tie) d = (m.noVotes ? 'Ninguém votou.' : (k > 1 ? 'A votação terminou empatada ou sem votos suficientes.' : 'Houve empate na votação.')) + ` ${impTxt}.`;
  else if (k > 1) d = `O grupo acusou ${joinNames(m.accused || [])} e acertou ${m.hits || 0} de ${k}. ${impTxt}.`;
  else d = `${(m.accused || [])[0]} era inocente! O verdadeiro Impostor era ${imps[0]}.`;
  const by = (m.suggestedBy && m.suggestedBy.length) ? ` (tema sugerido por ${m.suggestedBy.join(', ')})` : '';
  $('result-desc').textContent = `${d} A palavra secreta era: "${m.word}"${by}.`;

  const ul = $('tally');
  ul.classList.toggle('hidden', !m.tally);
  ul.innerHTML = '';
  (m.tally || []).forEach(t => {
    const li = document.createElement('li');
    li.className = 'pitem' + (t.impostor ? ' imp' : '');
    const a = document.createElement('span');
    a.textContent = (t.impostor ? '🤫 ' : '') + t.name;
    const b = document.createElement('span');
    b.className = 'pstat';
    b.textContent = `${t.count} voto${t.count === 1 ? '' : 's'}`;
    li.append(a, b);
    ul.append(li);
  });

  $('btn-again').classList.toggle('hidden', mode === 'guest');
  $('result-guest').classList.toggle('hidden', mode !== 'guest');
  $('btn-exit').classList.toggle('hidden', mode === 'local');
}

/* =========================================================
   MODO LOCAL (um só celular)
   ========================================================= */
const localUI = mountSettings($('local-settings'), LS, null, () => L.n);

$('num-players').addEventListener('input', e => {
  L.n = parseInt(e.target.value, 10);
  $('num-players-val').textContent = L.n;
  localUI.refresh();
});

$('btn-local').onclick = () => { mode = 'local'; show('s-local'); };
$('btn-online').onclick = () => show('s-online');
$('btn-online-back').onclick = () => show('s-home');
$('btn-local-back').onclick = () => { mode = null; show('s-home'); };

/* palavra da rodada (modo local): quem a digita é o Jogador 1 e não é sorteado como impostor */
function renderLocalCustom() {
  const w = LS.custom;
  $('btn-lcustom-clear').classList.toggle('hidden', !w);
  $('lcustom-status').classList.toggle('hidden', !w);
  $('lcustom-status').textContent = w ? '✔ Palavra definida (oculta). Quem a digitou deve ser o Jogador 1, que não será sorteado como impostor.' : '';
  $('btn-lcustom-toggle').textContent = w ? '✍️ Alterar palavra da rodada' : '✍️ Definir palavra da rodada';
  if (w) $('lcustom-status').textContent += LS.customHint ? ' Dica definida.' : ' Sem dica.';
  $('in-lcustom-word').value = '';
  $('in-lcustom-hint').value = '';
}
$('btn-lcustom-toggle').onclick = () => {
  $('lcustom-panel').classList.toggle('hidden');
  if (!$('lcustom-panel').classList.contains('hidden')) $('in-lcustom-word').focus();
};
function saveLocalCustom() {
  const w = cleanWord($('in-lcustom-word').value);
  if (w.length < 2) return toast('Digite uma palavra com pelo menos 2 letras.');
  const h = cleanHint($('in-lcustom-hint').value);
  if (h && h.toLowerCase().includes(w.toLowerCase())) return toast('A dica não pode conter a própria palavra.');
  LS.custom = w;
  LS.customHint = h;
  renderLocalCustom();
  $('lcustom-panel').classList.add('hidden');
  toast('Palavra da rodada definida!');
}
$('btn-lcustom-save').onclick = saveLocalCustom;
$('in-lcustom-word').addEventListener('keydown', e => { if (e.key === 'Enter') saveLocalCustom(); });
$('in-lcustom-hint').addEventListener('keydown', e => { if (e.key === 'Enter') saveLocalCustom(); });
$('btn-lcustom-clear').onclick = () => {
  LS.custom = ''; LS.customHint = '';
  renderLocalCustom();
  $('lcustom-panel').classList.add('hidden');
  toast('Palavra removida. Será sorteada automaticamente.');
};

$('btn-local-start').onclick = () => {
  if (LS.custom) { L.word = LS.custom; L.hint = LS.customHint || ''; }
  else { const e = pickWord(LS.category); L.word = e.word; L.hint = e.hint; }
  L.hintOn = !!LS.hint;
  // com palavra definida pelo Jogador 1, ele não entra no sorteio de impostores
  const k = effImp(LS.impostors, L.n);
  const cand = [...Array(L.n).keys()].slice(LS.custom ? 1 : 0);
  L.imps = shuffle(cand).slice(0, k);
  L.idx = 0;
  keepAwake();
  localPass();
};

function localPass() {
  $('pass-name').textContent = `Jogador ${L.idx + 1}`;
  show('s-pass');
}

$('btn-pass-ok').onclick = () => {
  if (mode !== 'local') { showRevealStep(); return; }
  ME.role = { impostor: L.imps.includes(L.idx), word: L.word, hint: L.hint, hintOn: L.hintOn };
  $('reveal-label').textContent = `Jogador ${L.idx + 1}`;
  renderCard(true);
  revealDone = () => {
    ME.role = null;
    L.idx++;
    if (L.idx < L.n) localPass();
    else enterDiscussion({ enabled: LS.time > 0, remaining: LS.time * 60, running: LS.time > 0, first: 'Jogador ' + (1 + rand(L.n)), imps: L.imps.length });
  };
  show('s-reveal');
};

let localConfirm = null;
function enterLocalVote() {
  timerStop();
  show('s-vote');
  const k = L.imps.length;
  const sel = [];
  $('vote-progress').textContent = '';
  $('btn-end-vote').classList.add('hidden');
  $('vote-as').classList.add('hidden');
  const confirmBtn = $('btn-local-confirm');
  confirmBtn.classList.toggle('hidden', k < 2);
  const name = i => `Jogador ${i + 1}`;
  const finish = () => {
    const hits = sel.filter(i => L.imps.includes(i)).length;
    showResult({
      winner: hits === k ? 'inocentes' : 'impostor', tie: false,
      accused: sel.map(name), impostors: L.imps.slice().sort((a, b) => a - b).map(name),
      k, hits, word: L.word, tally: null
    });
  };
  localConfirm = () => { if (sel.length === k) finish(); };
  const list = $('vote-list');
  const btns = [];
  const paint = () => {
    $('vote-sub').textContent = k === 1
      ? 'Selecione quem o grupo acha que é o Impostor:'
      : `Há ${k} impostores. Selecione ${k} jogadores que o grupo acha que são os impostores (${sel.length}/${k}):`;
    btns.forEach((b, i) => {
      b.classList.toggle('selected', sel.includes(i));
      b.querySelector('small').textContent = sel.includes(i) ? '✔ escolhido' : 'Votar';
    });
    confirmBtn.disabled = sel.length !== k;
  };
  list.innerHTML = '';
  for (let i = 0; i < L.n; i++) {
    const b = document.createElement('button');
    b.className = 'votebtn';
    b.innerHTML = `<span>Jogador ${i + 1}</span><small>Votar</small>`;
    b.onclick = () => {
      if (k === 1) { sel.length = 0; sel.push(i); finish(); return; }
      const at = sel.indexOf(i);
      if (at >= 0) sel.splice(at, 1);
      else { sel.push(i); if (sel.length > k) sel.shift(); }
      paint();
    };
    btns.push(b);
    list.appendChild(b);
  }
  paint();
}
$('btn-local-confirm').onclick = () => { if (localConfirm) localConfirm(); };

/* =========================================================
   TELAS COMUNS (discussão / votação)
   ========================================================= */
function enterDiscussion(m) {
  show('s-disc');
  const nImp = m.imps || 1;
  $('disc-title').textContent = nImp > 1 ? 'Descubram os Impostores!' : 'Descubram o Impostor!';
  $('disc-sub').textContent = 'Façam perguntas sobre o assunto sem dar pistas óbvias.' + (nImp > 1 ? ` Há ${nImp} impostores entre vocês.` : '');
  const canControl = mode !== 'guest';
  $('btn-go-vote').classList.toggle('hidden', !canControl);
  $('disc-guest').classList.toggle('hidden', canControl);
  $('btn-peek').classList.toggle('hidden', mode === 'local');
  $('peek-card').classList.add('hidden');
  $('first-name').textContent = m.first || '';
  $('first-box').classList.toggle('hidden', !m.first);
  timerSet(m.enabled, m.remaining, m.running);
}

let peekTimer = null;
function showPeek(r, name) {
  const p = $('peek-card');
  p.className = 'peek' + (r.impostor ? ' imp' : '');
  const who = name ? name + ': ' : '';
  p.textContent = r.impostor
    ? `🤫 ${who}Você é o IMPOSTOR` + (r.hintOn ? (r.hint ? ` • Dica: ${r.hint}` : ' • Sem dica nesta palavra') : '')
    : `💡 ${who}Palavra: ${r.word}`;
  clearTimeout(peekTimer);
  peekTimer = setTimeout(() => p.classList.add('hidden'), 4000);
}
$('btn-peek').onclick = () => {
  const p = $('peek-card');
  if (!p.classList.contains('hidden')) { p.classList.add('hidden'); return; }
  const r = ME.role;
  if (!r) return;
  const loc = ME.locals || [];
  if (!loc.length) { p.classList.remove('hidden'); showPeek(r); return; }
  // há jogadores neste celular: cada um toca no próprio nome para ver o seu papel
  p.className = 'peek';
  p.innerHTML = '';
  [{ name: myName(), role: r }].concat(loc.map(l => ({ name: l.name, role: locRole(l) }))).forEach(it => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn ghost small';
    b.textContent = 'Ver papel de ' + it.name;
    b.onclick = e => { e.stopPropagation(); showPeek(it.role, it.name); };
    p.append(b);
  });
  clearTimeout(peekTimer);
  peekTimer = setTimeout(() => p.classList.add('hidden'), 8000);
};

$('btn-toggle-timer').onclick = () => {
  if (mode === 'guest' || T.remaining === 0) return;
  timerSet(true, T.remaining, !T.running);
  if (mode === 'host') broadcast({ t: 'timer', remaining: T.remaining, running: T.running }, true);
};

$('btn-go-vote').onclick = () => {
  if (mode === 'local') enterLocalVote();
  else if (mode === 'host') hostGoVote();
};

function enterVote(mine, imps) {
  timerStop();
  ME.imps = imps || 1;
  ME.votes = {};
  if (mine && typeof mine === 'object') Object.keys(mine).forEach(id => {
    ME.votes[id] = Array.isArray(mine[id]) ? mine[id] : [mine[id]];
  });
  ME.voteAs = ME.id;
  show('s-vote');
  $('vote-sub').textContent = ME.imps > 1 ? `Quem são os ${ME.imps} impostores?` : 'Quem é o Impostor? Escolha um jogador:';
  $('btn-end-vote').classList.toggle('hidden', mode !== 'host');
  renderVoteList();
  refreshLive();
}

function myIdentities() {
  return [{ id: ME.id, name: myName() }]
    .concat(ME.players.filter(p => p.owner === ME.id).map(p => ({ id: p.id, name: p.name })));
}

function renderVoteList() {
  const ids = myIdentities();
  const k = ME.imps || 1;
  if (!ids.some(x => x.id === ME.voteAs)) ME.voteAs = ME.id;
  const picked = ME.votes[ME.voteAs] || [];
  const as = $('vote-as');
  as.innerHTML = '';
  as.classList.toggle('hidden', ids.length < 2);
  const ask = k > 1 ? `Quem são os ${k} impostores? Escolha ${k} jogadores (${picked.length}/${k}).` : 'Quem é o Impostor? Escolha um jogador:';
  if (ids.length > 1) {
    ids.forEach(x => {
      const c = document.createElement('button');
      c.type = 'button';
      c.className = 'chip' + (ME.voteAs === x.id ? ' active' : '');
      c.textContent = x.name + ((ME.votes[x.id] || []).length >= k ? ' ✔' : '');
      c.onclick = () => { ME.voteAs = x.id; renderVoteList(); };
      as.appendChild(c);
    });
    const cur = ids.find(x => x.id === ME.voteAs);
    $('vote-sub').textContent = `Votando como ${cur ? cur.name : ''}. ${ask}`;
  } else {
    $('vote-sub').textContent = ask;
  }
  const list = $('vote-list');
  list.innerHTML = '';
  ME.players.filter(p => p.id !== ME.voteAs).forEach(p => {
    const on = picked.includes(p.id);
    const b = document.createElement('button');
    b.className = 'votebtn' + (on ? ' selected' : '');
    const n = document.createElement('span');
    n.textContent = p.name;
    const s = document.createElement('small');
    s.textContent = !p.connected ? 'offline' : (on ? '✔ seu voto' : 'Votar');
    b.append(n, s);
    b.onclick = () => castVote(p.id);
    list.appendChild(b);
  });
}

function castVote(targetId) {
  const as = ME.voteAs || ME.id;
  const k = ME.imps || 1;
  let arr = (ME.votes[as] || []).slice();
  const at = arr.indexOf(targetId);
  if (k === 1) arr = [targetId];
  else if (at >= 0) arr.splice(at, 1);
  else { arr.push(targetId); if (arr.length > k) arr.shift(); }
  ME.votes[as] = arr;
  if (mode === 'host') hostVote(as, arr);
  else if (net.conn && net.conn.open) net.conn.send({ t: 'vote', targets: arr, as });
  // quando este jogador completa o voto, passa para o próximo jogador deste celular que ainda não votou
  if (arr.length >= k) {
    const next = myIdentities().find(x => (ME.votes[x.id] || []).length < k);
    if (next) ME.voteAs = next.id;
  }
  renderVoteList();
}

$('btn-end-vote').onclick = () => { if (mode === 'host') hostFinishVote(); };

/* =========================================================
   ONLINE — mensagens recebidas pelo cliente (host e guest)
   ========================================================= */
function handleClientMsg(m) {
  if (!m || typeof m !== 'object') return;
  switch (m.t) {
    case 'welcome':
      ME.id = m.you;
      rejoin.tries = 0; setBanner('');
      break;
    case 'players': {
      const first = ME.players.length === 0;
      ME.players = m.list; ME.hostId = m.hostId; ME.phase = m.phase; ME.settings = m.settings; ME.suggestions = m.suggestions || 0;
      if (first && m.phase === 'lobby') showLobby();
      refreshLive();
      break;
    }
    case 'mysuggest':
      ME.mySuggest = m.word || '';
      ME.mySuggestHint = m.hint || '';
      renderSuggest();
      break;
    case 'lobby':
      ME.role = null; ME.locals = []; ME.votes = {}; ME.voteAs = null; ME.mySuggest = ''; ME.mySuggestHint = ''; timerStop();
      showLobby();
      break;
    case 'role':
      ME.role = { impostor: !!m.impostor, word: m.word, hint: m.hint || '', hintOn: !!m.hintOn };
      ME.locals = Array.isArray(m.locals) ? m.locals : [];
      if (!m.silent) openReveal();
      break;
    case 'wait':
      showWaiting();
      break;
    case 'discussion':
      enterDiscussion(m);
      break;
    case 'timer':
      timerSet(true, m.remaining, m.running);
      break;
    case 'vote':
      enterVote(m.mine, m.imps);
      break;
    case 'result':
      showResult(m);
      break;
    case 'toast':
      toast(m.msg || '');
      break;
    case 'localok':
      $('in-local-name').value = '';
      toast('Jogador adicionado!');
      break;
    case 'error':
      leave(m.msg || 'Erro na sala.');
      break;
  }
}

const locRole = l => ({ impostor: l.impostor, word: l.word, hint: l.hint || '', hintOn: !!l.hintOn });

function myName() {
  const p = ME.players.find(x => x.id === ME.id);
  return p ? p.name : '';
}

function renderPlayerList(ul, list, statusFn) {
  ul.innerHTML = '';
  list.forEach(p => {
    const li = document.createElement('li');
    li.className = 'pitem';
    const a = document.createElement('span');
    a.textContent = (p.owner ? '📱 ' : '') + p.name + (p.id === ME.hostId ? ' 👑' : '') + (p.id === ME.id ? ' (você)' : '');
    const b = document.createElement('span');
    b.className = 'pstat';
    b.textContent = statusFn(p);
    li.append(a, b);
    ul.append(li);
  });
}

function renderLobbyList(list) {
  const ul = $('lobby-list');
  ul.innerHTML = '';
  list.forEach(p => {
    const li = document.createElement('li');
    li.className = 'pitem';
    const a = document.createElement('span');
    a.textContent = (p.owner ? '📱 ' : '') + p.name + (p.id === ME.hostId ? ' 👑' : '') + (p.id === ME.id ? ' (você)' : '');
    const b = document.createElement('span');
    b.className = 'pstat';
    if (p.owner) {
      const o = list.find(x => x.id === p.owner);
      b.textContent = 'no celular de ' + (o ? (o.id === ME.id ? 'você' : o.name) : '?');
      if (p.owner === ME.id || mode === 'host') {
        const x = document.createElement('button');
        x.type = 'button'; x.className = 'rm'; x.textContent = '✕';
        x.setAttribute('aria-label', 'Remover ' + p.name);
        x.onclick = () => removeLocal(p.id);
        b.append(x);
      }
    } else b.textContent = p.connected ? '' : 'offline';
    li.append(a, b);
    ul.append(li);
  });
}

function addLocal() {
  const name = cleanName($('in-local-name').value);
  if (!name) return toast('Digite o nome do jogador.');
  if (mode === 'host') hostAddLocal('p0', name);
  else if (net.conn && net.conn.open) net.conn.send({ t: 'addlocal', name });
}
function removeLocal(id) {
  if (mode === 'host') hostRemoveLocal('p0', id);
  else if (net.conn && net.conn.open) net.conn.send({ t: 'rmlocal', id });
}
$('btn-local-add').onclick = addLocal;
$('in-local-name').addEventListener('keydown', e => { if (e.key === 'Enter') addLocal(); });

function refreshLive() {
  const list = ME.players;
  const online = list.filter(p => p.connected);

  $('lobby-count').textContent = list.length;
  renderLobbyList(list);

  const ready = online.filter(p => p.ready).length;
  $('wait-count').textContent = `${ready} de ${online.length} prontos`;
  renderPlayerList($('wait-list'), list, p => !p.connected ? '⚠️ offline' : (p.ready ? '✅ pronto' : '⏳ lendo…'));

  const voted = online.filter(p => p.voted).length;
  $('vote-progress').textContent = `${voted} de ${online.length} votaram`;

  const s = ME.settings;
  const kImp = effImp(s.impostors, Math.max(online.length, 1));
  const tm = s.time ? s.time + ' min de discussão' : 'sem tempo';
  const hm = s.hint ? '💡 com dica' : 'sem dica';
  $('lobby-settings-guest').textContent = ME.suggestions
    ? `💡 Tema sorteado entre as sugestões • ${impLabel(kImp)} • ${tm} • ${hm}`
    : `${CATS[s.category] || ''} • ${impLabel(kImp)} • ${tm} • ${hm}`;
  if (mode === 'host' && settingsUI) settingsUI.refresh();
  renderSuggest();

  if (mode === 'host') {
    $('btn-start-online').disabled = online.length < 3;
    $('lobby-hint').textContent = online.length < 3 ? 'Mínimo de 3 jogadores para começar.' : '';
  }
  if (cur === 's-vote' && mode !== 'local') renderVoteList();
}

function showLobby() {
  show('s-lobby');
  $('room-code').textContent = ME.code;
  const host = mode === 'host';
  $('lobby-settings-host').classList.toggle('hidden', !host);
  $('lobby-settings-guest').classList.toggle('hidden', host);
  $('btn-start-online').classList.toggle('hidden', !host);
  $('btn-leave-lobby').textContent = host ? 'Encerrar sala' : 'Sair da sala';
  if (host) settingsUI = mountSettings($('lobby-settings-host'), G.settings, () => pushPlayers(), () => Math.max(ME.players.filter(p => p.connected).length, 1));
  else $('lobby-hint').textContent = 'Aguardando o anfitrião iniciar a partida…';
  refreshLive();
  keepAwake();
}

function openReveal() {
  const loc = ME.locals || [];
  revealQ = {
    i: 0,
    q: [{ name: myName(), role: ME.role }]
      .concat(loc.map(l => ({ name: l.name, role: locRole(l) })))
  };
  revealDone = () => {
    revealQ.i++;
    if (revealQ.i < revealQ.q.length) onlinePass();
    else { revealRole = null; revealQ = null; sendReady(); }
  };
  showRevealStep();
}
function showRevealStep() {
  const it = revealQ.q[revealQ.i];
  revealRole = it.role;
  $('reveal-label').textContent = it.name;
  renderCard(false);
  show('s-reveal');
}
function onlinePass() {
  $('pass-name').textContent = revealQ.q[revealQ.i].name;
  show('s-pass');
}

function sendReady() {
  if (mode === 'host') { setReady(G.players[0]); pushPlayers(); }
  else if (net.conn && net.conn.open) net.conn.send({ t: 'ready' });
  showWaiting();
}

function showWaiting() {
  show('s-wait');
  $('btn-start-disc').classList.toggle('hidden', mode !== 'host');
  $('wait-guest').classList.toggle('hidden', mode === 'host');
  refreshLive();
}

/* =========================================================
   ONLINE — lógica do anfitrião
   ========================================================= */
function playersMsg() {
  return {
    t: 'players', phase: G.phase, hostId: 'p0', settings: G.settings,
    suggestions: G.players.filter(p => p.connected && p.suggestion).length,
    list: G.players.map(p => ({ id: p.id, name: p.name, owner: p.owner || null, connected: p.connected, ready: !!p.ready, voted: Array.isArray(p.vote) && p.vote.length >= (G.impCount || 1) }))
  };
}
function sendTo(p, msg) {
  if (p.id === 'p0') handleClientMsg(msg);
  else if (p.conn && p.conn.open) { try { p.conn.send(msg); } catch (e) {} }
}
function broadcast(msg, skipHost) {
  if (!G) return;
  G.players.forEach(p => { if (!(skipHost && p.id === 'p0')) sendTo(p, msg); });
}
/* Agrupa atualizações da lista: com até 50 jogadores, votos e entradas simultâneas
   gerariam centenas de mensagens; assim sai no máximo 1 envio a cada ~80 ms. */
let pushTimer = null;
function pushPlayers() {
  if (!G || pushTimer) return;
  pushTimer = setTimeout(() => { pushTimer = null; if (G) broadcast(playersMsg()); }, 80);
}

/* jogadores adicionados no celular de outro jogador (owner = id do dono do aparelho) */
/* a dica só vai para quem é impostor (e só no modo com dica) */
const roleExtra = isImp => ({ hintOn: !!G.hintOn, hint: (isImp && G.hintOn) ? (G.hint || '') : '' });
const localRoles = p => G.players.filter(x => x.owner === p.id)
  .map(x => { const imp = G.impostorIds.includes(x.id); return Object.assign({ id: x.id, name: x.name, impostor: imp, word: G.word }, roleExtra(imp)); });
const votesOf = p => { const o = {}; G.players.forEach(x => { if ((x.id === p.id || x.owner === p.id) && x.vote != null) o[x.id] = x.vote; }); return o; };
const syncLocals = o => G.players.forEach(x => { if (x.owner === o.id) x.connected = o.connected; });
const setReady = p => { p.ready = true; G.players.forEach(x => { if (x.owner === p.id) x.ready = true; }); };

function hostAddLocal(ownerId, rawName) {
  if (!G) return;
  const owner = G.players.find(p => p.id === ownerId);
  if (!owner || owner.owner) return;
  const fail = msg => sendTo(owner, { t: 'toast', msg });
  if (G.phase !== 'lobby') return fail('Só dá para adicionar jogadores antes da partida começar.');
  const name = cleanName(rawName);
  if (!name) return fail('Nome inválido.');
  if (G.players.some(x => x.name.toLowerCase() === name.toLowerCase())) return fail('Já existe um jogador com esse nome na sala.');
  if (G.players.length >= MAX_PLAYERS) return fail(`Sala cheia (máx. ${MAX_PLAYERS} jogadores).`);
  G.players.push({ id: 'p' + G.nextId++, name, conn: null, connected: owner.connected, ready: false, vote: null, suggestion: null, owner: ownerId });
  sendTo(owner, { t: 'localok' });
  pushPlayers();
}
function hostRemoveLocal(requesterId, id) {
  if (!G || G.phase !== 'lobby') return;
  const p = G.players.find(x => x.id === id);
  if (!p || !p.owner) return;
  if (p.owner !== requesterId && requesterId !== 'p0') return;
  G.players = G.players.filter(x => x !== p);
  pushPlayers();
}

function sendStateTo(p) {
  sendTo(p, { t: 'welcome', you: p.id });
  sendTo(p, playersMsg());
  if (G.phase === 'lobby') { sendTo(p, { t: 'mysuggest', word: p.suggestion || '', hint: p.suggestionHint || '' }); return; }
  { const imp = G.impostorIds.includes(p.id); sendTo(p, Object.assign({ t: 'role', impostor: imp, word: G.word, silent: G.phase !== 'reveal', locals: localRoles(p) }, roleExtra(imp))); }
  if (G.phase === 'reveal' && p.ready) sendTo(p, { t: 'wait' });
  if (G.phase === 'discussion') sendTo(p, { t: 'discussion', enabled: T.enabled, remaining: T.remaining, running: T.running, first: G.first, imps: G.impCount });
  if (G.phase === 'vote') sendTo(p, { t: 'vote', mine: votesOf(p), imps: G.impCount });
  if (G.phase === 'result' && G.result) sendTo(p, G.result);
}

function createRoom(retry) {
  retry = retry || 0;
  const name = cleanName($('in-name').value);
  if (!name) return toast('Digite seu nome.');
  if (typeof Peer === 'undefined') return toast('Não foi possível carregar a biblioteca online. Verifique sua conexão.');
  store.set('impostor-name', name);

  const code = genCode();
  const peer = new Peer(PREFIX + code, PEER_OPTS);
  net.peer = peer;
  $('btn-create').disabled = true;

  peer.on('open', () => {
    $('btn-create').disabled = false;
    mode = 'host'; net.active = true;
    G = {
      code, phase: 'lobby', settings: { category: 'all', time: 3, impostors: 1, hint: false },
      players: [{ id: 'p0', name, conn: null, connected: true, ready: false, vote: null, suggestion: null }],
      nextId: 1, word: null, hint: '', hintOn: false, impostorIds: [], impCount: 1, result: null
    };
    ME = freshME();
    ME.code = code;
    sendTo(G.players[0], { t: 'welcome', you: 'p0' });
    pushPlayers();
    showLobby();
  });
  peer.on('connection', conn => {
    conn.on('data', m => hostRecv(conn, m));
    conn.on('close', () => hostDrop(conn));
    conn.on('error', () => hostDrop(conn));
  });
  peer.on('disconnected', () => { try { peer.reconnect(); } catch (e) {} });
  peer.on('error', err => {
    if (err.type === 'unavailable-id' && retry < 5 && !net.active) {
      peer.destroy(); net.peer = null; createRoom(retry + 1);
    } else if (!net.active) {
      $('btn-create').disabled = false;
      try { peer.destroy(); } catch (e) {}
      net.peer = null;
      toast('Não foi possível criar a sala (' + err.type + ').');
    } else if (err.type !== 'peer-unavailable') {
      toast('Instabilidade de conexão (' + err.type + ').');
    }
  });
}

function rejectConn(conn, msg) {
  try { conn.send({ t: 'error', msg }); } catch (e) {}
  setTimeout(() => { try { conn.close(); } catch (e) {} }, 500);
}

function hostRecv(conn, m) {
  if (!G || !m || typeof m !== 'object') return;
  const p = G.players.find(x => x.conn === conn);

  if (m.t === 'join') {
    if (p) return;
    const name = cleanName(m.name);
    if (!name) return rejectConn(conn, 'Nome inválido.');
    const ex = G.players.find(x => x.name.toLowerCase() === name.toLowerCase());
    if (ex) {
      if (ex.owner) return rejectConn(conn, 'Já existe um jogador com esse nome na sala.');
      const same = ex.token && m.token === ex.token;
      if (ex.connected && !same) return rejectConn(conn, 'Já existe um jogador com esse nome na sala.');
      const old = ex.conn;
      ex.conn = conn; ex.connected = true; syncLocals(ex);          // reconexão (assume o lugar da conexão antiga)
      if (old && old !== conn) {
        try { old.send({ t: 'error', msg: 'Sua vaga foi assumida por outra aba ou aparelho.' }); } catch (e) {}
        setTimeout(() => { try { old.close(); } catch (e) {} }, 300);
      }
      sendStateTo(ex); pushPlayers();
      return;
    }
    if (G.phase !== 'lobby') return rejectConn(conn, 'A partida já começou. Aguarde a próxima rodada.');
    if (G.players.length >= MAX_PLAYERS) return rejectConn(conn, `Sala cheia (máx. ${MAX_PLAYERS} jogadores).`);
    const np = { id: 'p' + G.nextId++, name, conn, connected: true, ready: false, vote: null, suggestion: null, token: m.token };
    G.players.push(np);
    sendStateTo(np); pushPlayers();
    return;
  }

  if (!p) return;
  if (m.t === 'ready') { setReady(p); pushPlayers(); }
  else if (m.t === 'vote') {
    const as = m.as && m.as !== p.id ? m.as : p.id;
    const v = G.players.find(x => x.id === as);
    const targets = Array.isArray(m.targets) ? m.targets : (m.target ? [m.target] : []);
    if (v && (as === p.id || v.owner === p.id)) hostVote(as, targets);
  }
  else if (m.t === 'addlocal') hostAddLocal(p.id, m.name);
  else if (m.t === 'rmlocal') hostRemoveLocal(p.id, m.id);
  else if (m.t === 'suggest') hostSuggest(p.id, m.word, m.hint);
}

function hostDrop(conn) {
  if (!G) return;
  const p = G.players.find(x => x.conn === conn);
  if (!p) return;
  if (G.phase === 'lobby') G.players = G.players.filter(x => x !== p && x.owner !== p.id);
  else { p.connected = false; p.conn = null; syncLocals(p); }
  pushPlayers();
  if (G.phase === 'vote') maybeFinishVote();
}

/* ---------- sugestão de tema (todos os jogadores) ---------- */
const cleanWord = s => String(s || '').replace(/\s+/g, ' ').trim().slice(0, 30);
const cleanHint = s => String(s || '').replace(/\s+/g, ' ').trim().slice(0, 60);

function renderSuggest() {
  const box = $('lobby-suggest');
  if (!box) return;
  const mine = ME.mySuggest, mh = ME.mySuggestHint;
  const online = ME.players.filter(p => p.connected).length;
  $('btn-suggest-clear').classList.toggle('hidden', !mine);
  $('btn-suggest').textContent = mine ? 'Alterar' : 'Enviar';
  let t = mine
    ? `✔ Sua sugestão: "${mine}"${mh ? ` • dica: "${mh}"` : ' • sem dica'} (os outros não veem). `
    : 'Sugira uma palavra (a dica é opcional) e ela entra no sorteio. ';
  if (mine && !mh && ME.settings && ME.settings.hint) t += 'O modo com dica está ligado: sem dica, o impostor não receberá pista. ';
  t += ME.suggestions
    ? `${ME.suggestions} de ${online} jogador${online === 1 ? '' : 'es'} já sugeriram.`
    : 'Sem sugestões, o tema sai da categoria escolhida pelo anfitrião.';
  $('suggest-status').textContent = t;
}

function sendSuggest(word, hint) {
  if (mode === 'host') hostSuggest('p0', word, hint);
  else if (net.conn && net.conn.open) net.conn.send({ t: 'suggest', word, hint });
}
function submitSuggest() {
  if (mode !== 'host' && mode !== 'guest') return;
  const w = cleanWord($('in-suggest').value);
  if (w.length < 2) return toast('Digite um tema com pelo menos 2 letras.');
  const h = cleanHint($('in-suggest-hint').value);
  if (h && h.toLowerCase().includes(w.toLowerCase())) return toast('A dica não pode conter a própria palavra.');
  sendSuggest(w, h);
  $('in-suggest').value = '';
  $('in-suggest-hint').value = '';
  toast('Sugestão enviada!');
}
$('btn-suggest').onclick = submitSuggest;
$('in-suggest').addEventListener('keydown', e => { if (e.key === 'Enter') submitSuggest(); });
$('in-suggest-hint').addEventListener('keydown', e => { if (e.key === 'Enter') submitSuggest(); });
$('btn-suggest-clear').onclick = () => { sendSuggest('', ''); toast('Sugestão removida.'); };

function hostSuggest(pid, word, hint) {
  if (!G || G.phase !== 'lobby') return;
  const p = G.players.find(x => x.id === pid);
  if (!p) return;
  const w = cleanWord(word);
  p.suggestion = w.length >= 2 ? w : null;
  let h = p.suggestion ? cleanHint(hint) : '';
  if (h && h.toLowerCase().includes(w.toLowerCase())) h = '';      // a dica não pode entregar a palavra
  p.suggestionHint = h;
  sendTo(p, { t: 'mysuggest', word: p.suggestion || '', hint: p.suggestionHint });
  pushPlayers();
}

function hostStart() {
  const online = G.players.filter(p => p.connected);
  if (online.length < 3) return toast('São necessários pelo menos 3 jogadores.');
  // sorteia UM tema entre as sugestões dos jogadores; sem sugestões, usa a categoria
  const sugg = online.filter(p => p.suggestion);
  const chosen = sugg.length ? sugg[rand(sugg.length)] : null;
  const picked = chosen ? null : pickWord(G.settings.category);
  G.word = chosen ? chosen.suggestion : picked.word;
  // quem sugeriu o tema sorteado já conhece a palavra: não pode ser o impostor
  const key = chosen ? chosen.suggestion.toLowerCase() : null;
  const authors = chosen ? online.filter(p => p.suggestion && p.suggestion.toLowerCase() === key) : [];
  // dica: a de quem sugeriu (ou de outro autor da mesma palavra); nas palavras do jogo, a dica da própria palavra
  G.hintOn = !!G.settings.hint;
  G.hint = chosen ? (chosen.suggestionHint || (authors.find(p => p.suggestionHint) || {}).suggestionHint || '') : picked.hint;
  G.suggestedBy = authors.map(p => p.name);
  const k = effImp(G.settings.impostors, online.length);
  G.impCount = k;
  let pool = shuffle(online.filter(p => !authors.includes(p)));
  if (pool.length < k) pool = pool.concat(shuffle(authors));      // só usa quem sugeriu se faltar gente
  G.impostorIds = pool.slice(0, k).map(p => p.id);
  G.phase = 'reveal';
  G.result = null;
  G.players.forEach(p => { p.ready = false; p.vote = null; });
  G.players.forEach(p => {
    if (p.connected && !p.owner) { const imp = G.impostorIds.includes(p.id); sendTo(p, Object.assign({ t: 'role', impostor: imp, word: G.word, silent: false, locals: localRoles(p) }, roleExtra(imp))); }
  });
  pushPlayers();
}
$('btn-start-online').onclick = hostStart;

function hostStartDiscussion() {
  const mins = G.settings.time;
  const online = G.players.filter(p => p.connected);
  G.first = online[rand(online.length)].name;     // sorteia só quem começa falando
  G.phase = 'discussion';
  broadcast({ t: 'discussion', enabled: mins > 0, remaining: mins * 60, running: mins > 0, first: G.first, imps: G.impCount });
  pushPlayers();
}
$('btn-start-disc').onclick = hostStartDiscussion;

function hostGoVote() {
  G.phase = 'vote';
  G.players.forEach(p => { p.vote = null; });
  broadcast({ t: 'vote', mine: null, imps: G.impCount });
  pushPlayers();
}

function hostVote(pid, targets) {
  if (!G || G.phase !== 'vote') return;
  const voter = G.players.find(p => p.id === pid);
  if (!voter) return;
  const k = G.impCount || 1;
  const clean = [];
  (Array.isArray(targets) ? targets : []).forEach(t => {
    if (t !== pid && G.players.some(p => p.id === t) && !clean.includes(t)) clean.push(t);
  });
  voter.vote = clean.length ? clean.slice(0, k) : null;
  pushPlayers();
  maybeFinishVote();
}

function maybeFinishVote() {
  const k = G.impCount || 1;
  const online = G.players.filter(p => p.connected);
  if (online.length && online.every(p => Array.isArray(p.vote) && p.vote.length >= k)) hostFinishVote();
}

function hostFinishVote() {
  if (!G || G.phase !== 'vote') return;
  G.phase = 'result';
  const k = G.impCount || 1;
  const counts = {};
  G.players.forEach(p => { (p.vote || []).forEach(t => { counts[t] = (counts[t] || 0) + 1; }); });
  const tally = G.players
    .map(p => ({ name: p.name, count: counts[p.id] || 0, impostor: G.impostorIds.includes(p.id) }))
    .sort((a, b) => b.count - a.count);
  // os k mais votados são os acusados; empate na fronteira (ou votos insuficientes) = ninguém é acusado
  const kth = tally[k - 1] ? tally[k - 1].count : 0;
  const next = tally[k] ? tally[k].count : -1;
  const noVotes = !tally[0] || tally[0].count === 0;
  const tie = kth === 0 || kth === next;
  const accusedList = tie ? [] : tally.slice(0, k);
  const hits = accusedList.filter(t => t.impostor).length;
  const caught = !tie && hits === k;
  const impNames = G.players.filter(p => G.impostorIds.includes(p.id)).map(p => p.name);
  G.result = {
    t: 'result', winner: caught ? 'inocentes' : 'impostor', tie, noVotes,
    accused: accusedList.map(t => t.name), impostors: impNames, k, hits, word: G.word, tally,
    suggestedBy: G.suggestedBy || []
  };
  broadcast(G.result);
  pushPlayers();
}

function hostNewGame() {
  G.players = G.players.filter(p => p.connected);
  G.phase = 'lobby';
  G.word = null; G.hint = ''; G.hintOn = false; G.impostorIds = []; G.impCount = 1; G.result = null; G.suggestedBy = [];
  G.players.forEach(p => { p.ready = false; p.vote = null; p.suggestion = null; p.suggestionHint = ''; });   // sugestões valem só para uma rodada
  timerStop();
  broadcast({ t: 'lobby' });
  pushPlayers();
}

$('btn-again').onclick = () => {
  if (mode === 'local') { LS.custom = ''; LS.customHint = ''; renderLocalCustom(); show('s-local'); }   // a palavra vale só para uma rodada
  else if (mode === 'host') hostNewGame();
};

/* =========================================================
   ONLINE — entrar em uma sala
   ========================================================= */
let session = null;                       // { name, code } do convidado atual
const rejoin = { tries: 0, timer: null };
const MAX_REJOIN = 6;

function setBanner(text) {
  const el = $('conn-banner');
  el.textContent = text || '';
  el.classList.toggle('hidden', !text);
}

function joinRoom() {
  const name = cleanName($('in-name').value);
  const code = ($('in-code').value || '').toUpperCase().replace(/[^A-Z]/g, '');
  if (!name) return toast('Digite seu nome.');
  if (code.length !== 4) return toast('Digite o código de 4 letras da sala.');
  if (typeof Peer === 'undefined') return toast('Não foi possível carregar a biblioteca online. Verifique sua conexão.');
  store.set('impostor-name', name);
  session = { name, code };
  rejoin.tries = 0;
  $('btn-join').disabled = true;
  connectGuest(false);
}

function connectGuest(retrying) {
  if (!session) return;
  const { name, code } = session;
  const peer = new Peer(undefined, PEER_OPTS);
  net.peer = peer;
  let opened = false;
  const fail = msg => {
    if (net.peer !== peer) return;
    if (retrying || net.active) lost(); else leave(msg);
  };

  peer.on('open', () => {
    const conn = peer.connect(PREFIX + code, { reliable: true });
    net.conn = conn;
    const to = setTimeout(() => { if (!opened) fail('Não foi possível entrar na sala. Confira o código.'); }, 12000);
    conn.on('open', () => {
      opened = true; clearTimeout(to);
      mode = 'guest'; net.active = true;
      if (!retrying) { ME = freshME(); ME.code = code; }
      $('btn-join').disabled = false;
      conn.send({ t: 'join', name, token: TOKEN });
    });
    conn.on('data', handleClientMsg);
    conn.on('close', () => { clearTimeout(to); fail('A sala foi encerrada ou a conexão caiu.'); });
  });
  peer.on('error', e => {
    fail(e.type === 'peer-unavailable' ? 'Sala não encontrada. Confira o código.' : `Erro de conexão (${e.type}).`);
  });
}

/* Conexão caiu (tela bloqueada, troca de rede, aba em segundo plano): tenta voltar sozinho */
function lost() {
  if (!session) return;
  if (rejoin.tries >= MAX_REJOIN) return leave('A sala foi encerrada ou a conexão caiu.');
  rejoin.tries++;
  setBanner(`Reconectando… (${rejoin.tries}/${MAX_REJOIN})`);
  const old = net.peer;
  net.peer = null; net.conn = null; net.active = true;
  try { if (old) old.destroy(); } catch (e) {}
  clearTimeout(rejoin.timer);
  rejoin.timer = setTimeout(() => connectGuest(true), Math.min(1000 * rejoin.tries, 4000));
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  if (mode === 'host' && net.peer && net.peer.disconnected) { try { net.peer.reconnect(); } catch (e) {} }
  if (mode === 'guest' && session && !(net.conn && net.conn.open)) {
    clearTimeout(rejoin.timer);
    rejoin.tries = Math.min(rejoin.tries, 2);
    rejoin.timer = setTimeout(() => { if (net.peer) { try { net.peer.destroy(); } catch (e) {} net.peer = null; } connectGuest(true); }, 200);
  }
});

function leave(msg) {
  session = null; clearTimeout(rejoin.timer); rejoin.tries = 0; setBanner('');
  net.active = false;
  clearInterval(T.h);
  const p = net.peer;
  const wasHost = mode === 'host';
  if (wasHost && G) broadcast({ t: 'error', msg: 'O anfitrião encerrou a sala.' }, true);
  net = { peer: null, conn: null, active: false };
  setTimeout(() => { try { if (p) p.destroy(); } catch (e) {} }, wasHost ? 400 : 0);
  G = null; mode = null; ME = freshME();
  $('btn-create').disabled = false; $('btn-join').disabled = false;
  show('s-online');
  if (msg) toast(msg);
}

function leaveWithConfirm() {
  if (mode === 'host' && !confirm('Encerrar a sala para todos os jogadores?')) return;
  leave();
}
$('btn-leave-lobby').onclick = leaveWithConfirm;
$('btn-exit').onclick = leaveWithConfirm;

/* ---------- compartilhar convite ---------- */
$('btn-share').onclick = async () => {
  const url = `${location.origin}${location.pathname}?sala=${ME.code}`;
  const text = `Entre na minha sala do Jogo do Impostor! Código: ${ME.code}`;
  if (navigator.share) {
    try { await navigator.share({ title: 'Jogo do Impostor', text, url }); return; }
    catch (e) { if (e && e.name === 'AbortError') return; }
  }
  try { await navigator.clipboard.writeText(url); toast('Link copiado!'); }
  catch (e) { window.prompt('Copie o link da sala:', url); }
};

/* ---------- início ---------- */
$('btn-create').onclick = () => createRoom(0);
$('btn-join').onclick = joinRoom;
$('in-code').addEventListener('input', e => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, ''); });
$('in-code').addEventListener('keydown', e => { if (e.key === 'Enter') joinRoom(); });
$('in-name').addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if ($('in-code').value.trim().length === 4) joinRoom(); else createRoom(0);
});

(function init() {
  $('in-name').value = store.get('impostor-name') || '';
  const sala = (new URLSearchParams(location.search).get('sala') || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
  if (sala) {
    $('in-code').value = sala;
    show('s-online');
    if (!$('in-name').value) $('in-name').focus();
  }
})();
