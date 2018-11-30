const gens = {};

// Este script vai clonar qualquer lista de objetos
// https://stackoverflow.com/questions/10240110/how-do-you-cache-an-image-in-javascript
gens.clone = function(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
};

// Colocar o jogo no modo loading
gens.loading = function(isLoad, callback) {

    if (typeof callback != "function") { callback = function() {}; }

    if (isLoad == false) {
        $("#loading").fadeOut(400);
        $("#game").fadeIn(400, callback);
    } else if (isLoad == true) {
        $("#game").fadeOut(400);
        $("#loading").fadeIn(400, callback);
    }

};

// Gerador de mesa de carts
gens.cardTable = function(cards, number) {

    // Criando sisteminha de limite de cartas
    if (typeof number == "number") {

        var countcards = number;
        if (countcards < 1) { countcards = 1; } else if (countcards > cards.length) { countcards = cards.length; }

        var tinyCards = [];
        for (var i = 0; i < countcards; i++) {
            tinyCards.push(cards[i]);
        }

        cards = tinyCards;
        delete tinyCards;

    }

    // Vamos inserir a array de imagens dentro do "cards" que vai ser inserido e depois clonado aqui dentro.
    var cardslist = [gens.clone(cards), gens.clone(cards)];

    // Os dados processados vão ser todos inseridos aqui dentro
    var cards_selected = [];

    do {

        // O sistema vai sortear um valor dentro da tabela normal e da tabela clonada
        var randomnumber1 = Math.floor(Math.random() * cardslist[0].length);
        var randomnumber2 = Math.floor(Math.random() * cardslist[1].length);

        // Estes números sorteados vão ser inseridos dentro do nosso jogo
        cards_selected.push(cardslist[0][randomnumber1], cardslist[1][randomnumber2])

        // Os valores usados agora vão ser descartados para um novo loop ser realizado com os valores restantes
        cardslist[0].splice(randomnumber1, 1);
        cardslist[1].splice(randomnumber2, 1);

        // O loop vai continuar até todos os valores serem sorteados, assim finalizando a criação da nova array com os dados que vão ser usados dentro do jogo
    } while (cardslist[0].length != 0);

    delete randomnumber1;
    delete randomnumber2;
    delete cardslist;

    // Agora vamos finalmente retornar o valor da nossa tabela de cartas gerada para ser usada dentro do do jogo
    return cards_selected;

};

// Aqui a gente vai fazer load de cache de imagens
// https://stackoverflow.com/questions/10240110/how-do-you-cache-an-image-in-javascript
gens.preloadImages = function(array, callback) {
    if (!gens.preloadImages.list) {
        gens.preloadImages.list = [];
    }
    var list = gens.preloadImages.list;
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        img.onload = function() {
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
                if ((list.length < 1) && (typeof callback == 'function')) { callback(); }
            }
        }
        img.onerror = function(err) {
            console.error("ESTE ARQUIVO NÃO É UMA IMAGEM VÁLIDA: ", err.srcElement, err);
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
                if ((list.length < 1) && (typeof callback == 'function')) { callback(); }
            }
        }
        list.push(img);
        img.src = array[i];
    }
}

// Preparar Leitor de cache
gens.loadImages = function(array, callback, noedit) {
    try {

        if (noedit != true) {

            var imgloading = [];
            for (var i = 0; i < array.length; i++) {
                imgloading.push("./img/" + String(array[i]));
            }

        } else {
            var imgloading = array;
        }

        // Começar aplicativo do jogo
        gens.preloadImages(imgloading, function() {
            delete imgloading;
            if (typeof callback == "function") { callback(); }
        });

    } catch (err) { if (typeof callback == "function") { callback(err); } else { console.log(err); } }
}

// Obter Cartas do jogo
gens.getCards = function(number) {
    return gens.cardTable(gens.game.cards, number);
};

// Menu System
gens.page = null;
gens.pages = function(value, data) {

    gens.body.empty();
    gens.page = value;

    if (typeof gens.game.pages[value] == "function") {
        gens.game.pages[value](data);
    } else {
        console.error("ESTE VALOR NÃO É UM MENU REGISTRADO!");
    }

};

// NÃO TIRE ISSO! DEIXE AQUI COMO ESTÁ!
gens.game = {};

// Esperar a página carregar completamente
$(document).ready(function() {

    // Game Body
    gens.body = $("body > #game");

    // Preparar Cache
    var imgloading = [];

    for (var i = 0; i < gens.game.cards.length; i++) {
        imgloading.push("./cards/" + String(gens.game.cards[i]) + ".jpeg");
    }

    for (var i = 0; i < gens.game.imgs.length; i++) {
        imgloading.push("./img/" + String(gens.game.imgs[i]));
    }

    // Ativar cache e abrir aplicativo
    gens.loadImages(imgloading, function(err) {
        delete imgloading;
        if (!err) {
            if (typeof startApp == "function") { startApp(); }
        } else {
            console.error("O APLICATIVO ENCONTROU UM DEFEITO E NÃO PODE SER INICIADO!", err);
        }
    }, true);


});

// Ajuste de Resize
const resizeWindow = function() {
    if (gens.page == "game") {

        var fixCard = gens.body.find(".cardlist");

        var itemsD = gens.body.find(".card").outerWidth(false);
        var checkD = fixCard.outerWidth(true);
        var itemsResult = itemsD;
        var result = false;

        do {
            if (itemsResult > checkD) {
                result = true;
                itemsResult -= itemsD;
                itemsResult = Number(checkD - itemsResult) / 2;
            } else {
                itemsResult += itemsD;
            }
        } while (result != true)

        if (checkD >= 1140) {
            fixCard.css({ 'margin-left': itemsResult });
        } else if (checkD <= 720) {
            fixCard.css({ 'margin-left': itemsResult * 3 });
        } else {
            fixCard.css({ 'margin-left': Number(itemsResult * 2) - 10 });
        }

    }
};

$(window).resize(resizeWindow);
resizeWindow();