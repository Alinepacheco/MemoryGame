/* 

Todo o script do jogo vai ser escrito aqui para ficar mais organizado do restinho do sistema do aplicativo.
Está função de começar o jogo sempre vai ser chamada no momento exato que for clicado o botão "Jogar"

*/

// Modal Fechado
$(document).ready(function() {

    $('#theModal').on('hidden.bs.modal', function() {

        if (memoryGame.closed == false) {
            memoryGame.clock.enabled = true;
        }

        if (memoryGame.finalScore) {

            firework(false);

            // Enviar dados para o sistema de vencedor

            // Primeiro limpar dados
            memoryGame.cards = [];

            memoryGame.selected = {
                c1: null,
                c2: null
            };

            // Terminar de limpar dados
            memoryGame.clock.count = 0;
            memoryGame.cardsN = 0;
            memoryGame.clock.enabled = false;

            memoryGame.database = {
                sameClick: 0,
                click: 0,
                score: 0
            };

            memoryGame.perfect = 0;

            gens.pages("mainMenu");

            memoryGame.finalScore = null;

        }

    });

});

const memoryGame = {

    // Pontuação final
    finalScore: null,

    // Escrita
    text: {

        score: $("<span>", { class: "fas fa-star" })[0].outerHTML + " Pontuação: ",
        totalclicks: $("<span>", { class: "fas fa-times" })[0].outerHTML + " Total de Cliques: ",
        clicks: $("<span>", { class: "fas fa-hand-pointer" })[0].outerHTML + " Cliques: ",
        time: $("<span>", { class: "fas fa-clock" })[0].outerHTML + " Tempo: ",
        cards: $("<span>", { class: "fas fa-keyboard" })[0].outerHTML + " Total de Cartas Desafiadas: ",
        cardc: $("<span>", { class: "fas fa-keyboard" })[0].outerHTML + " Cartas Restantes: "

    },

    // Saber se o joguinho está ativo ou não
    closed: true,

    // Relógio do jogo
    clock: {

        // Transformar segundos em contador
        get: function(s) {

            var sec_num = parseInt(s, 10); // don't forget the second param
            var hours = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours < 10) { hours = "0" + hours; }
            if (minutes < 10) { minutes = "0" + minutes; }
            if (seconds < 10) { seconds = "0" + seconds; }

            return { format: hours + ':' + minutes + ':' + seconds, hour: Number(hours), minute: Number(minutes), second: Number(seconds) };

        },

        // Contador
        interval: function() {
            setInterval(function() {
                if (memoryGame.clock.enabled == true) {

                    memoryGame.clock.count++;
                    gens.body.find("#clock > a").html([memoryGame.text.time, memoryGame.clock.get(memoryGame.clock.count).format]);

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

    perfect: 0,

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

            if (memoryGame.clock.get(memoryGame.clock.count).minute <= 3) {
                multipoint = multipoint * 2;
            }

            if (memoryGame.database.click <= 2) {
                memoryGame.perfect++;
                multipoint = multipoint * memoryGame.perfect;
            } else {
                memoryGame.perfect = 0;
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

            memoryGame.closed = true;
            memoryGame.clock.enabled = false;
            memoryGame.perfect = 0;

            // Enviar Pontuação
            memoryGame.finalScore = {
                clicks: memoryGame.database.sameClick,
                score: memoryGame.database.score,
                clock: memoryGame.clock.get(memoryGame.clock.count).format,
                cards: memoryGame.cardsN
            };

            $("#theModal .modal-title").text("Parabéns! Você venceu!");
            $("#theModal .modal-body").html($("<center>").append(
                [
                    $("<h1>").append($("<span>").html([memoryGame.text.time, memoryGame.finalScore.clock])),
                    $("<h2>").append($("<span>").html([memoryGame.text.score, memoryGame.finalScore.score])),
                    $("<h3>").append($("<span>").html([memoryGame.text.clicks, memoryGame.finalScore.clicks])),
                    $("<br>"),
                    $("<h4>").append($("<span>").html([memoryGame.text.cards, memoryGame.finalScore.cards]))
                ]
            ));
            $("#theModal .modal-footer").empty().append(
                $("<button>", { type: "button", class: "btn btn-default" }).text("Confirmar").click(function() { $("#theModal").modal('hide'); })
            );

            firework(true);
            $("#theModal").modal();

        }

        // Continuar o jogo
        else {

            gens.body.find("#click > a").html([memoryGame.text.clicks, memoryGame.database.click]);
            gens.body.find("#totalclick > a").html([memoryGame.text.totalclicks, memoryGame.database.sameClick]);
            gens.body.find("#score > a").html([memoryGame.text.score, memoryGame.database.score]);
            gens.body.find("#tcards > a").html([memoryGame.text.cardc, countCards]);

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

        memoryGame.closed = false;

        // Vamos converter o valor do input para número e em seguida usa-lo para formar a tabela de cartas do jogo
        data.cards = gens.getCards(Number(data.cards));
        memoryGame.cardsN = data.cards.length;

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
        memoryGame.perfect = 0;

        // Vamos começat a gerar as cartas aqui. Cada carta vai ter sua ID salva dentro de si em uma variavel chamada tinycard
        for (var i = 0; i < data.cards.length; i++) {
            memoryGame.cards.push(
                $("<div>", { class: "card" }).data("tinyposition", i).data("tinycard", data.cards[i]).click(memoryGame.click)
            );
        }

        // Gerador da página
        gens.body.html(

            [

                // Painel do Topo
                $("<nav>", { class: "navbar navbar-default navbar-fixed-top" }).append(
                    $("<div>", { class: "container-fluid" }).append(

                        // Título
                        $("<div>", { class: "navbar-header" }).append(
                            $("<a>", { class: "navbar-brand" }).text("Memory Game")
                        ),

                        // Itens
                        $("<ul>", { class: "nav navbar-nav" }).append(

                            $("<li>", { id: "click" }).append($("<a>").html([memoryGame.text.clicks, "0"])),
                            $("<li>", { id: "totalclick" }).append($("<a>").html([memoryGame.text.totalclicks, "0"])),
                            $("<li>", { id: "score" }).append($("<a>").html([memoryGame.text.score, "0"])),
                            $("<li>", { id: "tcards" }).append($("<a>").html([memoryGame.text.cardc, memoryGame.cardsN]))

                        ),

                        // Itens Direita
                        $("<ul>", { class: "nav navbar-nav navbar-right" }).append(

                            $("<li>", { id: "clock" }).append($("<a>").html([memoryGame.text.time, "00:00:00"])),


                            $("<button>", { class: "btn btn-primary navbar-btn" }).text("Abandonar / Pause").click(function() {

                                memoryGame.clock.enabled = false;
                                $("#theModal .modal-title").text("Confirme sua ação");
                                $("#theModal .modal-body").text("Tem certeza que deseja sair? Todo o seu progresso será perdido para sempre!");
                                $("#theModal .modal-footer").empty().append(
                                    $("<button>", { type: "button", class: "btn btn-danger" }).text("Sim").click(function() {

                                        memoryGame.closed = true;
                                        $("#theModal").modal('hide');
                                        gens.body.fadeOut(400, function() {

                                            memoryGame.cards = [];

                                            memoryGame.selected = {
                                                c1: null,
                                                c2: null
                                            };

                                            memoryGame.clock.count = 0;
                                            memoryGame.clock.enabled = false;

                                            memoryGame.database = {
                                                sameClick: 0,
                                                click: 0,
                                                score: 0
                                            };

                                            memoryGame.cardsN = 0;
                                            memoryGame.perfect = 0;

                                            gens.pages("mainMenu");

                                        });

                                    }),
                                    $("<button>", { type: "button", class: "btn btn-default" }).text("Não").click(function() { $("#theModal").modal('hide'); })
                                );

                                $("#theModal").modal();

                            })

                        )

                    )
                ),

                // O Container do jogo
                $("<div>", { class: "game container" }).append(

                    // Nosso jogo está acontecendo aqui dentro
                    $("<div>", { class: "cardlist" }).append(memoryGame.cards)

                )

            ]

        );

        // Reajustar Tela
        setTimeout(function() {
            resizeWindow();


            // Quando a página terminar de aparecer, alguma coisinha pode acontecer aqui
            gens.loading(false, function() {

                // Ativar o relógio da partida
                memoryGame.clock.enabled = true;

            });

        }, 200);

    }

};

memoryGame.clock.interval();