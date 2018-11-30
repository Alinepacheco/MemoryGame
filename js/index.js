// Configurações da engine do jogo

// Aqui é o object de valores do jogo que eu já escrevi um script para trabalhar com eles antes do startApp ser ativado


// Lista de Pages do jogo dentro de suas IDs para serem executadas.
gens.game.pages = {

    // O sistema do jogo está dentro do arquivo game.js
    game: memoryGame.app,

    // Tabela de Pontuações
    points: tinyPoints,

    // Página de Créditos
    credits: tinyCredits,

    // Menu Principal
    mainMenu: function() {

        // Configurador de Cartas para jogar. Este painel reconhece sozinho  quantas cartas estão instaladas no jogo
        var totalCards = $("<span>").text(String(gens.game.cards.length * 2) + " Cartas no total");
        var Cardsmount = $("<input>", { type: "number", min: 1, max: gens.game.cards.length, class: "form-control" })
            .val(gens.game.cards.length).change(function() {

                if (Number($(this).val()) > Number($(this).attr("max"))) {

                    $(this).val($(this).attr("max"));

                } else if (Number($(this).val()) < Number($(this).attr("min"))) {

                    $(this).val($(this).attr("min"));

                }

                totalCards.text(String(Number($(this).val()) * 2) + " Cartas no total");

            });

        // Gerar Menu dentro da página do jogo
        gens.body.html(

            // O Container do menu
            $("<div>", { class: "menu container" }).append(

                // Logo do Jogo
                $("<div>", { class: "logo", title: "Logo" }),

                // Painelzinho de Número de Cartas
                $("<div>", { class: "cardnumber" }).append([
                    $("<div>").text("Escolha uma quantidade de cartas"),
                    totalCards, Cardsmount
                ]),

                // Butão de iniciar o jogo
                $("<button>", { class: "btn btn-primary btn-lg btn-block" }).text("Jogar").click(function() {
                    gens.body.fadeOut(400, function() { gens.pages("game", { cards: $(Cardsmount).val() }); });
                }),

                // Lista de pontuações
                $("<button>", { class: "btn btn-default btn-lg btn-block" }).prop("disabled", true).text("Pontuações").click(function() {
                    gens.body.fadeOut(400, function() { gens.pages("points"); });
                }),

                // Créditos do Jogo
                $("<button>", { class: "btn btn-default btn-lg btn-block" }).text("Créditos").click(function() {
                    gens.body.fadeOut(400, function() { gens.pages("credits"); });
                })


            )

        );

        gens.loading(false);

    }

};


// Quando a página terminar de carregar. O aplicativo vai começar a executar os scripts aqui.
const startApp = function() {

    // Abrir o menu principal
    gens.pages("mainMenu");

};