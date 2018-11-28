/* 

Todo o script do jogo vai ser escrito aqui para ficar mais organizado do restinho do sistema do aplicativo.
Está função de começar o jogo sempre vai ser chamada no momento exato que for clicado o botão "Jogar"

*/

const memoryGame = {

    // Relógio do jogo
    clock: {

        two_numbers: function(number) {

            if (number <= 9) {
                number = "0" + number;
            }

            return number;

        },

        // Transformar segundos em contador
        get: function(s) {

            var hour = memoryGame.clock.two_numbers(Math.round(s / 3600));
            var minute = memoryGame.clock.two_numbers(Math.round((s % 3600) / 60));
            var second = memoryGame.clock.two_numbers((s % 3600) % 60);

            var format = hour + ":" + minute + ":" + second;

            return { format: format, hour: Number(hour), minute: Number(minute), second: Number(second) };

        },

        // Contador
        interval: function() {
            setInterval(function() {
                if (memoryGame.clock.enabled == true) {

                    memoryGame.clock.count++;

                    memoryGame.clock.get(memoryGame.clock.count);

                }
            }, 1000);
        },

        // Contagem em segundos
        count: 0,

        // Se está ativado ou não
        enabled: false

    },

    // Aqui é onde o jogo salva a tabela de cartas
    cards: [],

    // Aqui é onde fica salvo quais cartas estão sendo viradas e revidas
    selected: {
        c1: null,
        c2: null
    },

    // Contador de clicks
    database: {
        sameClick: 0,
        click: 0,
        score: 0
    },

    // Checar situação do jogo. Ela é ativada a cada final de jogada
    // O valor done vai dizer se a jogada foi uma combinação perfeita ou não
    check: function(done) {

        // Aqui a gente vai obter o número de quantas cartas restam no jogo
        var countCards = gens.body.find(".cardlist").children().length;

        // Este é o marcador total de cliques
        memoryGame.database.sameClick++;

        // Este é o marcador de cliques até uma combinação perfeita de cartas ser atingida
        if (done == true) {

            // Vamos marcar os pontos antes de zerar o time

            // Ponto base
            var pointsSend = 1;

            // Multiplicador de pontos
            var multipoint = 25 - memoryGame.database.click;

            // Dependencia de cliques para duplicar o multiplicador
            if (memoryGame.database.sameClick < Number(memoryGame.cards.length * 2)) {
                multipoint = multipoint * 2;
            }

            // Se for possível multiplicar, faremos aqui agora
            if (multipoint > 0) {
                pointsSend = pointsSend * multipoint;
            }
            delete multipoint;

            // Adicionamos a pontuação
            memoryGame.database.score += pointsSend;

            // Finalizado e click resetado
            memoryGame.database.click = 0;
            delete pointsSend;

        } else {
            memoryGame.database.click++;
        }

        // Todas as cartas sumiram? Vamos enviar para a janelinha da vitória! :D
        if (countCards < 1) {

            // Primeiro limpar dados
            memoryGame.cards = [];

            memoryGame.selected = {
                c1: null,
                c2: null
            };

            // Enviar dados para o sistema de vencedor
            gens.pages("win", { clicks: memoryGame.database.sameClick, score: memoryGame.database.score, clock: memoryGame.clock.get(memoryGame.clock.count) });

            // Terminar de limpar dados
            memoryGame.clock.count = 0;
            memoryGame.clock.enabled = false;

            memoryGame.database = {
                sameClick: 0,
                click: 0,
                score: 0
            };

        }

        // Continuar o jogo
        else {

            console.log(memoryGame.database.click, memoryGame.database.sameClick, memoryGame.database.score, memoryGame.clock.get(memoryGame.clock.count));

        }

    },

    // Aqui é o sistema de validar cartas
    detector: {

        // Aqui fica registrado o temporizador de carta visivel
        timeout: null,

        // Aqui é a função
        action: function() {

            // As cartas são iguais? Então vamos contar o ponto
            if (
                (memoryGame.selected.c1 != null) &&
                (memoryGame.selected.c2 != null) &&
                (memoryGame.selected.c1.data("tinycard") == memoryGame.selected.c2.data("tinycard"))
            ) {

                // Vamos remover as duas cartas do jogo
                memoryGame.selected.c1.remove();
                memoryGame.selected.c2.remove();

                // Devolvemos o valor null para os slots
                memoryGame.selected.c1 = null;
                memoryGame.selected.c2 = null;

                // E depois checar se ainda a partida vai continuar ou terminar
                memoryGame.check(true);

            }

            // Não? Então volta tudo...
            else {

                if (memoryGame.selected.c1 != null) { memoryGame.selected.c1.css("background-image", ""); }
                if (memoryGame.selected.c2 != null) { memoryGame.selected.c2.css("background-image", ""); }
                memoryGame.selected.c1 = null;
                memoryGame.selected.c2 = null;

                // E depois checar se ainda a partida vai continuar ou terminar
                memoryGame.check();

            }

        }

    },

    // Quando a carta é clicada, está função vai ser executada
    click: function() {

        // Primeiro vamos checar se ela já foi selecionada em um dos dois slots
        if (
            (
                (memoryGame.selected.c1 == null) ||
                (memoryGame.selected.c1.data("tinycard") != $(this).data("tinycard")) ||
                (memoryGame.selected.c1.data("tinyposition") != $(this).data("tinyposition"))
            ) &&
            (
                (memoryGame.selected.c2 == null) ||
                (memoryGame.selected.c2.data("tinycard") != $(this).data("tinycard")) ||
                (memoryGame.selected.c2.data("tinyposition") != $(this).data("tinyposition"))
            )
        ) {

            // Agora podemos colocar ela em um dos slotes e mostrar
            if ((memoryGame.selected.c1 == null) || (memoryGame.selected.c2 == null)) {
                $(this).css("background-image", "url('./cards/" + $(this).data("tinycard") + ".jpeg')");
            }

            if (memoryGame.selected.c1 == null) {

                memoryGame.selected.c1 = $(this);

                // E depois checar se ainda a partida vai continuar ou terminar
                memoryGame.check();

            } else if (memoryGame.selected.c2 == null) {

                memoryGame.selected.c2 = $(this);

                // Quando for o segundo slot, a gente precisa comparar eles

                // O usuário precisa de alguns segundos para ver a carta antes de comparar
                memoryGame.detector.timeout = setTimeout(memoryGame.detector.action, 2000);

            }

            // Caso os dois exista. Vamos forçar o timeout
            else {

                if (memoryGame.detector.timeout) {
                    clearTimeout(memoryGame.detector.timeout);
                    memoryGame.detector.action();
                } else {
                    // E depois checar se ainda a partida vai continuar ou terminar
                    memoryGame.check();
                }

            }

        }

        // Caso já esteja selecionada, vamos apenas destampar ela
        else {

            // E checar se existe timeout para não deixar o sistema bugar
            if (memoryGame.detector.timeout) {
                clearTimeout(memoryGame.detector.timeout);
                memoryGame.detector.action();
            } else {

                $(this).css("background-image", "");

                if (memoryGame.selected.c1.data("tinyposition") == $(this).data("tinyposition")) {
                    memoryGame.selected.c1 = null;
                } else if (memoryGame.selected.c2.data("tinyposition") == $(this).data("tinyposition")) {
                    memoryGame.selected.c2 = null;
                }

                // E depois checar se ainda a partida vai continuar ou terminar
                memoryGame.check();

            }

        }

    },

    // O aplicativo do jogo está aqu
    app: function(data) {

        // Vamos converter o valor do input para número e em seguida usa-lo para formar a tabela de cartas do jogo
        data.cards = gens.getCards(Number(data.cards));

        memoryGame.cards = [];

        memoryGame.selected = {
            c1: null,
            c2: null
        };

        memoryGame.database = {
            sameClick: 0,
            click: 0,
            score: 0
        };

        memoryGame.clock.count = 0;

        // Vamos começat a gerar as cartas aqui. Cada carta vai ter sua ID salva dentro de si em uma variavel chamada tinycard
        for (var i = 0; i < data.cards.length; i++) {
            memoryGame.cards.push(
                $("<div>", { class: "card" }).data("tinyposition", i).data("tinycard", data.cards[i]).click(memoryGame.click)
            );
        }

        // Gerador da página
        gens.body.html(

            // O Container do jogo
            $("<div>", { class: "game container" }).append(

                // Nosso jogo está acontecendo aqui dentro
                $("<div>", { class: "cardlist" }).append(memoryGame.cards)

            )

        );


        // Quando a página terminar de aparecer e aparecer, alguma coisinha pode acontecer aqui
        gens.loading(false, function() {

            // Ativar o relógio da partida
            memoryGame.clock.enabled = true;

        });

    }

};

memoryGame.clock.interval();