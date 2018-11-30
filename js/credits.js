const tinyCredits = function() {

    gens.body.html(

        // O Container dos créditos
        $("<div>", { class: "credits container" }).append(
            $("<h2>").text("Créditos do Trabalho"),





            // Participantes
            $("<table>", { class: "table table-bordered" }).append(

                // Topo da tabela
                $("<thead>").append(
                    $("<tr>").append(
                        $("<td>").text("Aluno(a)"),
                        $("<td>").text("Função")
                    )
                ),

                // Lista do Grupo. Programe aqui a sua participação :D
                $("<tbody>").append(

                    // Yasmin
                    $("<tr>").append(
                        $("<td>").text("Yasmin Seidel"),
                        $("<td>").text("Ajudou a transformar a ideia do trabalho em projeto e desenvolveu o sistema base")
                    )

                )

            ),



            // Scripts Usados
            $("<table>", { class: "table table-bordered" }).append(

                // Topo da tabela
                $("<thead>").append(
                    $("<tr>").append(
                        $("<td>").text("Script"),
                        $("<td>").text("Página")
                    )
                ),

                // Lista do Grupo. Programe aqui a sua participação :D
                $("<tbody>").append(


                    $("<tr>").append(
                        $("<td>").text("jQuery"),
                        $("<td>").append($("<a>", { href: "https://jquery.com/", target: "_blnk" }).text("https://jquery.com/"))
                    ),

                    $("<tr>").append(
                        $("<td>").text("Live Query"),
                        $("<td>").append($("<a>", { href: "https://plugins.jquery.com/livequery/", target: "_blnk" }).text("https://plugins.jquery.com/livequery/"))
                    ),

                    $("<tr>").append(
                        $("<td>").text("Bootstrap 3"),
                        $("<td>").append($("<a>", { href: "https://getbootstrap.com/docs/3.3/", target: "_blnk" }).text("https://getbootstrap.com/docs/3.3/"))
                    ),

                    $("<tr>").append(
                        $("<td>").text("Fireworks"),
                        $("<td>").append($("<a>", { href: "https://jsfiddle.net/dtrooper/AceJJ/", target: "_blnk" }).text("https://jsfiddle.net/dtrooper/AceJJ/"))
                    ),

                    $("<tr>").append(
                        $("<td>").text("Font Awesome"),
                        $("<td>").append($("<a>", { href: "https://fontawesome.com/", target: "_blnk" }).text("https://fontawesome.com/"))
                    )

                )

            ),



            $("<button>", { class: "btn btn-primary btn-lg btn-block" }).text("Voltar").click(function() {
                gens.body.fadeOut(400, function() { gens.pages("mainMenu"); });
            })
        )

    );

    gens.loading(false);

};