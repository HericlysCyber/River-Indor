// ============================================
// RIVER TECH - ADMINISTRAÇÃO
// ============================================


// ============================================
// ELEMENTOS DO LOGIN
// ============================================

const loginArea =
    document.getElementById("loginArea");

const painelAdmin =
    document.getElementById("painelAdmin");

const botaoLogin =
    document.getElementById("botaoLogin");

const botaoLogout =
    document.getElementById("botaoLogout");

const email =
    document.getElementById("email");

const senha =
    document.getElementById("senha");

const mensagemLogin =
    document.getElementById("mensagemLogin");


// ============================================
// ELEMENTOS DA BIBLIOTECA
// ============================================

const botaoAdicionar =
    document.getElementById("botaoAdicionar");

const arquivoMusica =
    document.getElementById("arquivoMusica");

const bibliotecaPlaylist =
    document.getElementById("bibliotecaPlaylist");


// ============================================
// ELEMENTOS DO MODAL
// ============================================

const modalDistribuicao =
    document.getElementById("modalDistribuicao");

const musicaSelecionada =
    document.getElementById("musicaSelecionada");

const listaClientes =
    document.getElementById("listaClientes");

const botaoConfirmarDistribuicao =
    document.getElementById(
        "botaoConfirmarDistribuicao"
    );

const botaoFecharModal =
    document.getElementById(
        "botaoFecharModal"
    );

// ============================================
// MODAL DE DISTRIBUIÇÃO DE PUBLICIDADE
// ============================================

const modalDistribuicaoPublicidade =
    document.getElementById(
        "modalDistribuicaoPublicidade"
    );

const publicidadeSelecionada =
    document.getElementById(
        "publicidadeSelecionada"
    );

const listaClientesPublicidade =
    document.getElementById(
        "listaClientesPublicidade"
    );

const botaoConfirmarDistribuicaoPublicidade =
    document.getElementById(
        "botaoConfirmarDistribuicaoPublicidade"
    );

const botaoFecharModalPublicidade =
    document.getElementById(
        "botaoFecharModalPublicidade"
    );

let publicidadeParaDistribuir = null;
// ============================================
// VARIÁVEIS
// ============================================

let usuarioAdministrador = false;

let musicaParaDistribuir = null;


// ============================================
// INICIAR
// ============================================

console.log(
    "ADMIN.JS CARREGADO"
);

verificarUsuario();


// ============================================
// VERIFICAR USUÁRIO
// ============================================

async function verificarUsuario() {

    console.log(
        "VERIFICANDO LOGIN..."
    );

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();

    if (error) {

        console.log(
            "ERRO AO VERIFICAR SESSÃO:",
            error
        );

        mostrarLogin();

        return;

    }

    const session =
        data.session;

    if (session) {

        console.log(
            "SESSÃO ENCONTRADA:",
            session.user.email
        );

        await entrarNoPainel(
            session.user
        );

    }

    else {

        console.log(
            "Nenhum usuário conectado."
        );

        mostrarLogin();

    }

}


// ============================================
// MOSTRAR LOGIN
// ============================================

function mostrarLogin() {

    if (loginArea) {

        loginArea.style.display =
            "block";

    }

    if (painelAdmin) {

        painelAdmin.style.display =
            "none";

    }

}


// ============================================
// ENTRAR NO PAINEL
// ============================================

async function entrarNoPainel(usuario) {

    try {

        console.log(
            "ENTRANDO NO PAINEL:",
            usuario.email
        );


        // ========================================
        // VERIFICAR ADMINISTRADOR MASTER
        // ========================================

        const {
            data: souAdministrador,
            error: erroAdmin
        } = await supabaseClient
            .rpc("is_admin");


        if (erroAdmin) {

            console.log(
                "ERRO AO VERIFICAR ADMINISTRADOR:",
                erroAdmin
            );

            mensagemLogin.textContent =
                "Erro ao verificar acesso.";

            return;

        }


        usuarioAdministrador =
            souAdministrador === true;


        console.log(
            "É administrador?",
            usuarioAdministrador
        );


        // ========================================
        // ADMINISTRADOR MASTER
        // ========================================

        if (usuarioAdministrador) {

            loginArea.style.display =
                "none";

            painelAdmin.style.display =
                "block";

            console.log(
                "Administrador MASTER conectado."
            );

            carregarBiblioteca();

            return;

        }


        // ========================================
// USUÁRIO NÃO É ADMINISTRADOR
// ========================================

console.log(
    "USUÁRIO NÃO É ADMINISTRADOR."
);

console.log(
    "REDIRECIONANDO PARA A RÁDIO..."
);

await supabaseClient.auth.signOut();

window.location.href =
    "index.html";

return;


        carregarMusicasCliente();

    }

    catch (erro) {

        console.log(
            "ERRO AO ENTRAR:",
            erro
        );

    }

}


// ============================================
// LOGIN
// ============================================

if (botaoLogin) {

    botaoLogin.addEventListener(
        "click",
        async function () {

            console.log(
                "BOTÃO LOGIN CLICADO"
            );


            const emailDigitado =
                email.value.trim();

            const senhaDigitada =
                senha.value;


            if (
                !emailDigitado ||
                !senhaDigitada
            ) {

                mensagemLogin.textContent =
                    "Preencha o e-mail e a senha.";

                return;

            }


            mensagemLogin.textContent =
                "Entrando...";


            const {
                data,
                error
            } = await supabaseClient.auth
                .signInWithPassword({

                    email:
                        emailDigitado,

                    password:
                        senhaDigitada

                });


            if (error) {

                console.log(
                    "ERRO NO LOGIN:",
                    error
                );

                mensagemLogin.textContent =
                    "E-mail ou senha incorretos.";

                return;

            }


            console.log(
                "LOGIN REALIZADO:",
                data.user
            );


            mensagemLogin.textContent =
                "";


            await entrarNoPainel(
                data.user
            );

        }
    );

}


// ============================================
// LOGOUT
// ============================================

if (botaoLogout) {

    botaoLogout.addEventListener(
        "click",
        async function () {

            console.log(
                "SAINDO..."
            );


            await supabaseClient.auth.signOut();


            usuarioAdministrador =
                false;


            mostrarLogin();


            email.value =
                "";

            senha.value =
                "";

        }
    );

}


// ============================================
// CARREGAR BIBLIOTECA CENTRAL
// ============================================

async function carregarBiblioteca() {

    console.log(
        "CARREGANDO BIBLIOTECA..."
    );


    const {
        data,
        error
    } = await supabaseClient
        .from("biblioteca_musicas")
        .select("*")
        .order(
            "created_at",
            {
                ascending: true
            }
        );


    if (error) {

        console.log(
            "ERRO AO CARREGAR BIBLIOTECA:",
            error
        );


        bibliotecaPlaylist.innerHTML =
            "<p>Erro ao carregar biblioteca.</p>";


        return;

    }


    console.log(
        "BIBLIOTECA CENTRAL:",
        data
    );


    bibliotecaPlaylist.innerHTML =
        "";


    if (
        !data ||
        data.length === 0
    ) {

        bibliotecaPlaylist.innerHTML =
            "<p>A biblioteca ainda está vazia.</p>";

        return;

    }


    data.forEach(
        function (musica) {

            const item =
                document.createElement("div");


            item.classList.add(
                "admin-musica"
            );


            item.innerHTML = `

                <span>

                    🎵 ${musica.nome}

                    <br>

                    <small>
                        ${musica.artista || "Artista não informado"}
                    </small>

                </span>


                <div>

                    <button
                        class="botao-tocar-biblioteca"
                        data-caminho="${musica.caminho}">

                        ▶️

                    </button>


                    <button
    class="botao-distribuir"
    data-id="${musica.id}">

    📻 Distribuir

</button>

<button
    class="botao-excluir-musica"
    data-id="${musica.id}"
    data-caminho="${musica.caminho}">

    🗑️

</button>



                    <button
                        class="botao-excluir"
                        data-id="${musica.id}"
                        data-caminho="${musica.caminho}"
                        data-nome="${musica.nome}">

                        🗑️

                    </button>

                </div>

            `;


            bibliotecaPlaylist.appendChild(
                item
            );

        }
    );

}

// ============================================
// EXCLUIR MÚSICA DA BIBLIOTECA
// ============================================

async function excluirMusicaBiblioteca(
    id,
    caminho,
    nome
) {

    console.log(
        "SOLICITADA EXCLUSÃO DA MÚSICA:",
        id,
        nome
    );


    const confirmar =
        confirm(
            "⚠️ Excluir música?\n\n" +
            "Música: " +
            nome +
            "\n\n" +
            "Ela será removida da Biblioteca Central " +
            "e de todas as rádios que receberam essa música."
        );


    if (!confirmar) {

        console.log(
            "EXCLUSÃO CANCELADA."
        );

        return;

    }


    console.log(
        "EXCLUINDO DISTRIBUIÇÕES DA MÚSICA..."
    );


    // ========================================
    // 1. REMOVER DAS RÁDIOS
    // ========================================

    const {
        error: erroDistribuicoes
    } = await supabaseClient
        .from("radio_musicas")
        .delete()
        .eq(
            "musica_id",
            id
        );


    if (erroDistribuicoes) {

        console.error(
            "ERRO AO REMOVER DAS RÁDIOS:",
            erroDistribuicoes
        );


        alert(
            "Não foi possível remover a música das rádios."
        );


        return;

    }


    console.log(
        "DISTRIBUIÇÕES REMOVIDAS."
    );


    // ========================================
    // 2. REMOVER ARQUIVO DO STORAGE
    // ========================================

    const {
        error: erroStorage
    } = await supabaseClient
        .storage
        .from("musicas")
        .remove([
            caminho
        ]);


    if (erroStorage) {

        console.error(
            "ERRO AO REMOVER ARQUIVO:",
            erroStorage
        );


        alert(
            "A música saiu das rádios, " +
            "mas não foi possível apagar o arquivo do Storage."
        );


        return;

    }


    console.log(
        "ARQUIVO REMOVIDO DO STORAGE."
    );


    // ========================================
    // 3. REMOVER DA BIBLIOTECA
    // ========================================

    const {
        error: erroBiblioteca
    } = await supabaseClient
        .from("biblioteca_musicas")
        .delete()
        .eq(
            "id",
            id
        );


    if (erroBiblioteca) {

        console.error(
            "ERRO AO REMOVER DA BIBLIOTECA:",
            erroBiblioteca
        );


        alert(
            "O arquivo foi removido, " +
            "mas ocorreu um erro ao remover o registro da biblioteca."
        );


        return;

    }


    console.log(
        "MÚSICA EXCLUÍDA COM SUCESSO."
    );


    alert(
        "✅ Música excluída com sucesso!"
    );


    // ========================================
    // 4. ATUALIZAR BIBLIOTECA
    // ========================================

    await carregarBiblioteca();

}

// ============================================
// ABRIR MODAL DE DISTRIBUIÇÃO
// ============================================

async function abrirModalDistribuicao(musica) {

    console.log(
        "ABRINDO MODAL:",
        musica
    );


    musicaParaDistribuir =
        musica;


    musicaSelecionada.textContent =
        "🎵 " + musica.nome;


    modalDistribuicao.style.display =
        "flex";


    listaClientes.innerHTML =
        "<p>Carregando clientes...</p>";


    console.log(
        "BUSCANDO TODOS OS CLIENTES..."
    );


    const {
        data,
        error
    } = await supabaseClient
        .from("clientes")
        .select(
            "id, nome, user_id, ativo"
        )
        .order(
            "id",
            {
                ascending: true
            }
        );


    console.log(
        "CLIENTES RETORNADOS PELO SUPABASE:",
        data
    );


    console.log(
        "ERRO AO BUSCAR CLIENTES:",
        error
    );


    if (error) {

        console.log(
            "ERRO AO CARREGAR CLIENTES:",
            error
        );


        listaClientes.innerHTML =
            "<p>Erro ao carregar clientes.</p>";


        return;

    }


    listaClientes.innerHTML =
        "";


    if (
        !data ||
        data.length === 0
    ) {

        listaClientes.innerHTML =
            "<p>Nenhum cliente cadastrado.</p>";


        return;

    }


    console.log(
        "QUANTIDADE DE CLIENTES ENCONTRADOS:",
        data.length
    );


    data.forEach(
        function (cliente) {

            console.log(
                "CLIENTE ENCONTRADO:",
                cliente
            );


            const label =
                document.createElement(
                    "label"
                );


            label.style.display =
                "block";


            label.style.marginBottom =
                "10px";


            label.style.padding =
                "8px";


            label.innerHTML = `

                <input
                    type="checkbox"
                    class="cliente-selecionado"
                    value="${cliente.id}">

                <strong>
                    ${cliente.nome}
                </strong>

                <small>
                    (ID: ${cliente.id})
                </small>

            `;


            listaClientes.appendChild(
                label
            );

        }
    );

}


// ============================================
// CLIQUES NA BIBLIOTECA
// ============================================

if (bibliotecaPlaylist) {

    bibliotecaPlaylist.addEventListener(
        "click",
        async function (event) {

            console.log(
                "CLIQUE NA BIBLIOTECA"
            );

// ====================================
// BOTÃO EXCLUIR MÚSICA
// ====================================

const botaoExcluir =
    event.target.closest(
        ".botao-excluir-musica"
    );


if (botaoExcluir) {

    console.log(
        "BOTÃO EXCLUIR MÚSICA CLICADO"
    );


    const id =
        Number(
            botaoExcluir.dataset.id
        );


    const caminho =
        botaoExcluir.dataset.caminho;


    const item =
        botaoExcluir.closest(
            ".admin-musica"
        );


    let nome =
        "esta música";


    if (item) {

        const texto =
            item.querySelector(
                "span"
            );

        if (texto) {

            nome =
                texto.innerText
                    .split("\n")[0]
                    .replace(
                        "🎵 ",
                        ""
                    )
                    .trim();

        }

    }


    console.log(
        "ID DA MÚSICA:",
        id
    );

    console.log(
        "CAMINHO:",
        caminho
    );

    console.log(
        "NOME:",
        nome
    );


    if (!id || !caminho) {

        console.error(
            "ID OU CAMINHO DA MÚSICA NÃO ENCONTRADO."
        );

        return;

    }


    await excluirMusicaBiblioteca(
        id,
        caminho,
        nome
    );


    return;

}
            // ====================================
            // BOTÃO DISTRIBUIR
            // ====================================

            const botaoDistribuir =
                event.target.closest(
                    ".botao-distribuir"
                );


            if (botaoDistribuir) {

                console.log(
                    "BOTÃO DISTRIBUIR CLICADO"
                );


                const id =
                    Number(
                        botaoDistribuir.dataset.id
                    );


                console.log(
                    "ID DA MÚSICA:",
                    id
                );


                const {
                    data,
                    error
                } = await supabaseClient
                    .from("biblioteca_musicas")
                    .select("*")
                    .eq(
                        "id",
                        id
                    )
                    .single();


                if (
                    error ||
                    !data
                ) {

                    console.log(
                        "ERRO AO ENCONTRAR MÚSICA:",
                        error
                    );


                    return;

                }


                console.log(
                    "MÚSICA ENCONTRADA:",
                    data
                );


                await abrirModalDistribuicao(
                    data
                );


                return;

            }


            // ====================================
            // BOTÃO TOCAR
            // ====================================

            const botaoTocar =
                event.target.closest(
                    ".botao-tocar-biblioteca"
                );


            if (botaoTocar) {

                const caminho =
                    botaoTocar.dataset.caminho;


                if (!caminho) {

                    console.log(
                        "CAMINHO NÃO ENCONTRADO"
                    );

                    return;

                }


                const {
                    data
                } = supabaseClient
                    .storage
                    .from("musicas")
                    .getPublicUrl(
                        caminho
                    );


                if (
                    !data ||
                    !data.publicUrl
                ) {

                    console.log(
                        "URL NÃO ENCONTRADA"
                    );

                    return;

                }


                console.log(
                    "TOCANDO:",
                    data.publicUrl
                );


                const audio =
                    new Audio(
                        data.publicUrl
                    );


                audio.play()
                    .catch(
                        function (erro) {

                            console.log(
                                "ERRO AO TOCAR:",
                                erro
                            );

                        }
                    );

            }

        }
    );

}


// ============================================
// FECHAR MODAL
// ============================================

if (botaoFecharModal) {

    botaoFecharModal.addEventListener(
        "click",
        function () {

            console.log(
                "FECHANDO MODAL"
            );


            modalDistribuicao.style.display =
                "none";


            musicaParaDistribuir =
                null;

        }
    );

}


// ============================================
// CONFIRMAR DISTRIBUIÇÃO
// ============================================

if (botaoConfirmarDistribuicao) {

    botaoConfirmarDistribuicao.addEventListener(
        "click",
        async function () {

            console.log(
                "CONFIRMAR DISTRIBUIÇÃO CLICADO"
            );


            if (!musicaParaDistribuir) {

                console.log(
                    "NENHUMA MÚSICA SELECIONADA"
                );

                return;

            }


            const selecionados =
                document.querySelectorAll(
                    ".cliente-selecionado:checked"
                );


            console.log(
                "QUANTIDADE DE CLIENTES:",
                selecionados.length
            );


            if (
                selecionados.length === 0
            ) {

                alert(
                    "Selecione pelo menos um cliente."
                );

                return;

            }


            botaoConfirmarDistribuicao.disabled =
                true;


            let quantidadeDistribuida =
                0;


            for (
                const checkbox of selecionados
            ) {

                const clienteId =
                    Number(
                        checkbox.value
                    );


                console.log(
                    "DISTRIBUINDO PARA CLIENTE:",
                    clienteId
                );


                // ==================================
                // VERIFICAR SE JÁ EXISTE
                // ==================================

                const {
                    data: existente,
                    error: erroVerificacao
                } = await supabaseClient
                    .from("radio_musicas")
                    .select("id")
                    .eq(
                        "cliente_id",
                        clienteId
                    )
                    .eq(
                        "musica_id",
                        musicaParaDistribuir.id
                    );


                if (erroVerificacao) {

                    console.log(
                        "ERRO AO VERIFICAR DISTRIBUIÇÃO:",
                        erroVerificacao
                    );

                    continue;

                }


                if (
                    existente &&
                    existente.length > 0
                ) {

                    console.log(
                        "MÚSICA JÁ DISTRIBUÍDA PARA CLIENTE:",
                        clienteId
                    );

                    continue;

                }


                // ==================================
                // INSERIR DISTRIBUIÇÃO
                // ==================================

                const {
                    error: erroDistribuicao
                } = await supabaseClient
                    .from("radio_musicas")
                    .insert({

                        cliente_id:
                            clienteId,

                        musica_id:
                            musicaParaDistribuir.id

                    });


                if (erroDistribuicao) {

                    console.log(
                        "ERRO AO DISTRIBUIR MÚSICA:",
                        erroDistribuicao
                    );

                    continue;

                }


                quantidadeDistribuida++;


                console.log(
                    "MÚSICA DISTRIBUÍDA COM SUCESSO PARA:",
                    clienteId
                );

            }


            botaoConfirmarDistribuicao.disabled =
                false;


            modalDistribuicao.style.display =
                "none";


            musicaParaDistribuir =
                null;


            alert(
                quantidadeDistribuida +
                " distribuição(ões) realizada(s) com sucesso!"
            );

        }
    );

}


// ============================================
// ADICIONAR MÚSICA À BIBLIOTECA
// ============================================

if (botaoAdicionar) {

    botaoAdicionar.addEventListener(
        "click",
        function () {

            arquivoMusica.click();

        }
    );

}


// ============================================
// UPLOAD DA MÚSICA
// ============================================

if (arquivoMusica) {

    arquivoMusica.addEventListener(
        "change",
        async function () {

            const arquivo =
                arquivoMusica.files[0];


            if (!arquivo) {

                return;

            }


            if (!usuarioAdministrador) {

                alert(
                    "Somente o administrador pode adicionar músicas à biblioteca."
                );


                arquivoMusica.value =
                    "";

                return;

            }


            console.log(
                "ENVIANDO MÚSICA:",
                arquivo.name
            );


            const nomeArquivo =
                Date.now() +
                "-" +
                arquivo.name.replace(
                    /[^a-zA-Z0-9._-]/g,
                    "_"
                );


            const caminho =
                "biblioteca/" +
                nomeArquivo;


            // ==================================
            // UPLOAD STORAGE
            // ==================================

            const {
                error: erroUpload
            } = await supabaseClient
                .storage
                .from("musicas")
                .upload(
                    caminho,
                    arquivo
                );


            if (erroUpload) {

                console.log(
                    "ERRO NO UPLOAD:",
                    erroUpload
                );


                alert(
                    "Erro ao enviar a música."
                );


                return;

            }


            // ==================================
            // SALVAR NA BIBLIOTECA
            // ==================================

            const {
                error: erroBanco
            } = await supabaseClient
                .from("biblioteca_musicas")
                .insert({

                    nome:
                        arquivo.name,

                    artista:
                        "Rádio Indoor",

                    caminho:
                        caminho

                });


            if (erroBanco) {

                console.log(
                    "ERRO AO SALVAR BIBLIOTECA:",
                    erroBanco
                );


                await supabaseClient
                    .storage
                    .from("musicas")
                    .remove([
                        caminho
                    ]);


                alert(
                    "Erro ao registrar a música."
                );


                return;

            }


            console.log(
                "MÚSICA ADICIONADA À BIBLIOTECA!"
            );


            arquivoMusica.value =
                "";


            carregarBiblioteca();

        }
    );

}
// ============================================
// EXCLUIR MÚSICA DA BIBLIOTECA
// ============================================

async function excluirMusicaBiblioteca(id, caminho, nome) {

    console.log(
        "INICIANDO EXCLUSÃO DA MÚSICA:",
        id,
        nome
    );


    const confirmar =
        confirm(
            `Tem certeza que deseja excluir a música:\n\n${nome}\n\nEla será removida da biblioteca e de todas as rádios dos clientes.`
        );


    if (!confirmar) {

        console.log(
            "EXCLUSÃO CANCELADA."
        );

        return;

    }


    try {

        // ========================================
        // 1. REMOVER DAS RÁDIOS DOS CLIENTES
        // ========================================

        console.log(
            "REMOVENDO DISTRIBUIÇÕES..."
        );


        const {
            error: erroDistribuicoes
        } = await supabaseClient
            .from("radio_musicas")
            .delete()
            .eq(
                "musica_id",
                id
            );


        if (erroDistribuicoes) {

            console.error(
                "ERRO AO REMOVER DISTRIBUIÇÕES:",
                erroDistribuicoes
            );

            alert(
                "Não foi possível remover a música das rádios."
            );

            return;

        }


        console.log(
            "DISTRIBUIÇÕES REMOVIDAS."
        );


        // ========================================
// 2. REMOVER ARQUIVO DO STORAGE
// ========================================

console.log(
    "REMOVENDO ARQUIVO DO STORAGE:",
    caminho
);

const caminhoStorage =
    String(caminho).trim();

console.log(
    "CAMINHO ENVIADO AO STORAGE:",
    caminhoStorage
);

const resultadoStorage =
    await supabaseClient
        .storage
        .from("musicas")
        .remove([
            caminhoStorage
        ]);

console.log(
    "RESPOSTA COMPLETA DO STORAGE:",
    resultadoStorage
);

const erroStorage =
    resultadoStorage.error;

if (erroStorage) {

    console.error(
        "ERRO AO REMOVER ARQUIVO:",
        erroStorage
    );

    alert(
        "A música saiu das rádios, mas não foi possível remover o arquivo do Storage."
    );

    return;

}

console.log(
    "ARQUIVO REMOVIDO DO STORAGE COM SUCESSO!"
);



        // ========================================
        // 3. REMOVER DA BIBLIOTECA
        // ========================================

        console.log(
            "REMOVENDO DA BIBLIOTECA..."
        );


        const {
            error: erroBiblioteca
        } = await supabaseClient
            .from("biblioteca_musicas")
            .delete()
            .eq(
                "id",
                id
            );


        if (erroBiblioteca) {

            console.error(
                "ERRO AO REMOVER DA BIBLIOTECA:",
                erroBiblioteca
            );

            alert(
                "O arquivo foi removido, mas ocorreu um erro ao remover o registro da biblioteca."
            );

            return;

        }


        console.log(
            "MÚSICA EXCLUÍDA COMPLETAMENTE!"
        );


        alert(
            "Música excluída com sucesso!"
        );


        // ========================================
        // 4. ATUALIZAR BIBLIOTECA NA TELA
        // ========================================

        await carregarBiblioteca();

    }

    catch (erro) {

        console.error(
            "ERRO INESPERADO AO EXCLUIR MÚSICA:",
            erro
        );

        alert(
            "Ocorreu um erro inesperado ao excluir a música."
        );

    }

}


// ============================================
// FIM
// ============================================

console.log(
    "ADMIN.JS FINALIZADO COM SUCESSO"
);
// ============================================
// PROGRAMACAO - CARREGAR CLIENTES
// ============================================

const clienteProgramacao =
    document.getElementById("clienteProgramacao");


if (clienteProgramacao) {

    async function carregarClientesProgramacao() {

        console.log(
            "CARREGANDO CLIENTES PARA PROGRAMAÇÃO..."
        );


        const {
            data,
            error
        } = await supabaseClient
            .from("clientes")
            .select("id, nome, ativo")
            .order(
                "id",
                {
                    ascending: true
                }
            );


        if (error) {

            console.log(
                "ERRO AO CARREGAR CLIENTES PARA PROGRAMAÇÃO:",
                error
            );

            return;

        }


        clienteProgramacao.innerHTML = `
            <option value="">
                Selecione um cliente
            </option>
        `;


        data.forEach(
            function (cliente) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    cliente.id;


                option.textContent =
                    cliente.nome;


                clienteProgramacao.appendChild(
                    option
                );

            }
        );


        console.log(
            "CLIENTES DA PROGRAMAÇÃO CARREGADOS:",
            data
        );

    }


    carregarClientesProgramacao();

}
// ============================================
// PROGRAMACAO - CARREGAR MUSICAS DO CLIENTE
// ============================================

if (clienteProgramacao) {

    clienteProgramacao.addEventListener(
        "change",
        async function () {

            const clienteId =
                Number(
                    clienteProgramacao.value
                );

            const lista =
                document.getElementById(
                    "listaProgramacao"
                );


            if (!clienteId) {

                lista.innerHTML = `
                    <p>
                        Selecione um cliente para carregar
                        a programação.
                    </p>
                `;

                return;

            }


            lista.innerHTML = `
                <p>
                    Carregando programação...
                </p>
            `;


            console.log(
                "CARREGANDO PROGRAMAÇÃO DO CLIENTE:",
                clienteId
            );


            const {
                data,
                error
            } = await supabaseClient
                .from("radio_musicas")
                .select(`
                    id,
                    ordem,
                    musica_id,
                    biblioteca_musicas (
                        id,
                        nome
                    )
                `)
                .eq(
                    "cliente_id",
                    clienteId
                )
                .order(
                    "ordem",
                    {
                        ascending: true
                    }
                );


            if (error) {

                console.log(
                    "ERRO AO CARREGAR PROGRAMAÇÃO:",
                    error
                );

                lista.innerHTML = `
                    <p>
                        Erro ao carregar programação.
                    </p>
                `;

                return;

            }


            if (
                !data ||
                data.length === 0
            ) {

                lista.innerHTML = `
                    <p>
                        Nenhuma música distribuída
                        para este cliente.
                    </p>
                `;

                return;

            }


            lista.innerHTML = "";


            data.forEach(
    function (item, indice) {

        const musica =
            document.createElement(
                "div"
            );


        musica.className =
            "item-programacao";


        musica.innerHTML = `

            <span>

                ☰

                <strong>
                    ${indice + 1}.
                </strong>

                ${item.biblioteca_musicas.nome}

            </span>


            <span>

    <button
        class="botao-subir"
        data-id="${item.id}"
        ${indice === 0 ? "disabled" : ""}>

        ⬆️

    </button>


    <button
        class="botao-descer"
        data-id="${item.id}"
        ${indice === data.length - 1 ? "disabled" : ""}>

        ⬇️

    </button>


    <button
        class="botao-remover-musica-cliente"
        data-id="${item.id}"
        data-nome="${item.biblioteca_musicas.nome}">

        🗑️

    </button>

</span>

        `;


        lista.appendChild(
            musica
        );

    }
);


            console.log(
                "PROGRAMAÇÃO CARREGADA:",
                data
            );

        }
    );

}

// ============================================
// REMOVER MÚSICA DA PROGRAMAÇÃO DO CLIENTE
// ============================================

if (clienteProgramacao) {

    const listaProgramacao =
        document.getElementById(
            "listaProgramacao"
        );

    if (listaProgramacao) {

        listaProgramacao.addEventListener(
            "click",
            async function (event) {

                const botao =
                    event.target.closest(
                        ".botao-remover-musica-cliente"
                    );

                if (!botao) {
                    return;
                }

                const musicaId =
                    Number(
                        botao.dataset.id
                    );

                const nomeMusica =
                    botao.dataset.nome;

                console.log(
                    "REMOVENDO MÚSICA DA RÁDIO:",
                    musicaId,
                    nomeMusica
                );

                const confirmar =
                    confirm(
                        `Deseja remover a música "${nomeMusica}" desta rádio?`
                    );

                if (!confirmar) {
                    return;
                }

                botao.disabled = true;

                const {
                    error: erroRemocao
                } = await supabaseClient
                    .from("radio_musicas")
                    .delete()
                    .eq(
                        "id",
                        musicaId
                    );

                if (erroRemocao) {

                    console.error(
                        "ERRO AO REMOVER MÚSICA DA RÁDIO:",
                        erroRemocao
                    );

                    alert(
                        "Não foi possível remover a música da rádio."
                    );

                    botao.disabled = false;

                    return;
                }

                console.log(
                    "MÚSICA REMOVIDA DA RÁDIO COM SUCESSO."
                );

                alert(
                    "Música removida da rádio com sucesso!"
                );

                // Recarregar a programação
                clienteProgramacao.dispatchEvent(
                    new Event("change")
                );

            }
        );

    }

}

// ============================================
// REORDENAR PROGRAMAÇÃO
// ============================================

const listaProgramacao =
    document.getElementById("listaProgramacao");


if (listaProgramacao) {

    listaProgramacao.addEventListener(
        "click",
        async function (event) {

            const botaoSubir =
                event.target.closest(
                    ".botao-subir"
                );

            const botaoDescer =
                event.target.closest(
                    ".botao-descer"
                );


            if (
                !botaoSubir &&
                !botaoDescer
            ) {

                return;

            }


            const clienteId =
                Number(
                    clienteProgramacao.value
                );


            if (!clienteId) {

                return;

            }


            const musicaId =
                Number(
                    (
                        botaoSubir ||
                        botaoDescer
                    ).dataset.id
                );


            console.log(
                "REORDENANDO:",
                {
                    clienteId,
                    musicaId
                }
            );


            // ==================================
            // BUSCAR PROGRAMAÇÃO ATUAL
            // ==================================

            const {
                data,
                error
            } = await supabaseClient
                .from("radio_musicas")
                .select(
                    "id, ordem"
                )
                .eq(
                    "cliente_id",
                    clienteId
                )
                .order(
                    "ordem",
                    {
                        ascending: true
                    }
                );


            if (error) {

                console.log(
                    "ERRO AO BUSCAR ORDEM:",
                    error
                );

                return;

            }


            const indiceAtual =
                data.findIndex(
                    function (item) {

                        return (
                            item.id ===
                            musicaId
                        );

                    }
                );


            if (
                indiceAtual === -1
            ) {

                return;

            }


            let novoIndice;


            if (botaoSubir) {

                novoIndice =
                    indiceAtual - 1;

            } else {

                novoIndice =
                    indiceAtual + 1;

            }


            if (
                novoIndice < 0 ||
                novoIndice >= data.length
            ) {

                return;

            }


            // ==================================
            // TROCAR AS POSIÇÕES
            // ==================================

            const itemAtual =
                data[indiceAtual];

            const itemDestino =
                data[novoIndice];


            const ordemAtual =
                itemAtual.ordem;

            const ordemDestino =
                itemDestino.ordem;


            // ==================================
            // ATUALIZAR BANCO
            // ==================================

            const {
                error: erro1
            } = await supabaseClient
                .from("radio_musicas")
                .update({
                    ordem: -1
                })
                .eq(
                    "id",
                    itemAtual.id
                );


            if (erro1) {

                console.log(
                    "ERRO AO PREPARAR TROCA:",
                    erro1
                );

                return;

            }


            const {
                error: erro2
            } = await supabaseClient
                .from("radio_musicas")
                .update({
                    ordem: ordemAtual
                })
                .eq(
                    "id",
                    itemDestino.id
                );


            if (erro2) {

                console.log(
                    "ERRO AO ATUALIZAR DESTINO:",
                    erro2
                );

                return;

            }


            const {
                error: erro3
            } = await supabaseClient
                .from("radio_musicas")
                .update({
                    ordem: ordemDestino
                })
                .eq(
                    "id",
                    itemAtual.id
                );


            if (erro3) {

                console.log(
                    "ERRO AO ATUALIZAR MÚSICA:",
                    erro3
                );

                return;

            }


            console.log(
                "ORDEM ALTERADA COM SUCESSO"
            );


            // ==================================
            // RECARREGAR PROGRAMAÇÃO
            // ==================================

            clienteProgramacao.dispatchEvent(
                new Event("change")
            );

        }
    );

}
// ============================================
// PUBLICIDADES
// ============================================

const botaoAdicionarPublicidade =
    document.getElementById("botaoAdicionarPublicidade");

const arquivoPublicidade =
    document.getElementById("arquivoPublicidade");

const listaPublicidades =
    document.getElementById("listaPublicidades");


// ============================================
// CARREGAR PUBLICIDADES
// ============================================

async function carregarPublicidades() {

    if (!listaPublicidades) {

        return;

    }


    console.log(
        "CARREGANDO PUBLICIDADES..."
    );


    const {
        data,
        error
    } = await supabaseClient
        .from("publicidades")
        .select("*")
        .order(
            "created_at",
            {
                ascending: true
            }
        );


    if (error) {

        console.log(
            "ERRO AO CARREGAR PUBLICIDADES:",
            error
        );


        listaPublicidades.innerHTML = `
            <p>
                Erro ao carregar publicidades.
            </p>
        `;

        return;

    }


    console.log(
        "PUBLICIDADES ENCONTRADAS:",
        data
    );


    listaPublicidades.innerHTML =
        "";


    if (
        !data ||
        data.length === 0
    ) {

        listaPublicidades.innerHTML = `
            <p>
                Nenhuma publicidade cadastrada.
            </p>
        `;

        return;

    }


    data.forEach(
        function (publicidade) {

            const item =
                document.createElement("div");


            item.classList.add(
                "admin-musica"
            );


            item.innerHTML = `

                <span>

                    📢 ${publicidade.nome}

                    <br>

                    <small>
                        ${publicidade.ativo ? "Ativa" : "Inativa"}
                    </small>

                </span>


                <div>

    <button
        class="botao-ouvir-publicidade"
        data-caminho="${publicidade.caminho}">

        ▶️

    </button>


    <button
        class="botao-distribuir-publicidade"
        data-id="${publicidade.id}">

        📢

    </button>


    <button
        class="botao-ativar-publicidade"
        data-id="${publicidade.id}"
        data-ativo="${publicidade.ativo}">

        ${publicidade.ativo ? "🟢" : "🔴"}

    </button>


    <button
        class="botao-excluir-publicidade"
        data-id="${publicidade.id}"
        data-caminho="${publicidade.caminho}"
        data-nome="${publicidade.nome}">

        🗑️

    </button>

</div>

            `;


            listaPublicidades.appendChild(
                item
            );

        }
    );


    console.log(
        "PUBLICIDADES CARREGADAS COM SUCESSO."
    );

}


carregarPublicidades();

// ============================================
// EXCLUIR PUBLICIDADE
// ============================================

async function excluirPublicidade(
    id,
    caminho,
    nome
) {

    console.log(
        "INICIANDO EXCLUSÃO DA PUBLICIDADE:",
        id,
        nome
    );

    console.log("CAMINHO RECEBIDO PARA EXCLUSÃO:", caminho);

    const confirmar =
        confirm(
            `Tem certeza que deseja excluir a publicidade:\n\n${nome}\n\nEla será removida da biblioteca e de todas as rádios dos clientes.`
        );


    if (!confirmar) {

        console.log(
            "EXCLUSÃO CANCELADA."
        );

        return;

    }


    try {

        // ========================================
        // 1. REMOVER DAS RÁDIOS
        // ========================================

        console.log(
            "REMOVENDO DISTRIBUIÇÕES DE PUBLICIDADE..."
        );


        const {
            error: erroDistribuicoes
        } = await supabaseClient
            .from("radio_publicidades")
            .delete()
            .eq(
                "publicidade_id",
                id
            );


        if (erroDistribuicoes) {

            console.error(
                "ERRO AO REMOVER DISTRIBUIÇÕES:",
                erroDistribuicoes
            );

            alert(
                "Não foi possível remover a publicidade das rádios."
            );

            return;

        }


        console.log(
            "DISTRIBUIÇÕES DE PUBLICIDADE REMOVIDAS."
        );


        // ========================================
        // 2. REMOVER ARQUIVO DO STORAGE
        // ========================================

        console.log(
            "REMOVENDO ARQUIVO DO STORAGE:",
            caminho
        );


        const {
            data: dadosStorage,
            error: erroStorage
        } = await supabaseClient
            .storage
            .from("publicidades")
            .remove([
                caminho
            ]);


        console.log(
            "RESPOSTA COMPLETA DO STORAGE:",
            {
                data: dadosStorage,
                error: erroStorage
            }
        );


        if (erroStorage) {

            console.error(
                "ERRO AO REMOVER ARQUIVO:",
                erroStorage
            );

            alert(
                "A publicidade saiu das rádios, mas não foi possível remover o arquivo do Storage."
            );

            return;

        }


        console.log(
            "ARQUIVO DE PUBLICIDADE REMOVIDO DO STORAGE!"
        );


        // ========================================
        // 3. REMOVER DA TABELA
        // ========================================

        console.log(
            "REMOVENDO PUBLICIDADE DA TABELA..."
        );


        const {
            error: erroPublicidade
        } = await supabaseClient
            .from("publicidades")
            .delete()
            .eq(
                "id",
                id
            );


        if (erroPublicidade) {

            console.error(
                "ERRO AO REMOVER PUBLICIDADE:",
                erroPublicidade
            );

            alert(
                "O arquivo foi removido, mas ocorreu um erro ao remover o registro da publicidade."
            );

            return;

        }


        console.log(
            "PUBLICIDADE EXCLUÍDA COMPLETAMENTE!"
        );


        alert(
            "Publicidade excluída com sucesso!"
        );


        // ========================================
        // 4. ATUALIZAR LISTA
        // ========================================

        await carregarPublicidades();

    }

    catch (erro) {

        console.error(
            "ERRO INESPERADO AO EXCLUIR PUBLICIDADE:",
            erro
        );

        alert(
            "Ocorreu um erro inesperado ao excluir a publicidade."
        );

    }

}

// ============================================
// ABRIR MODAL DE DISTRIBUIÇÃO DE PUBLICIDADE
// ============================================

async function abrirModalDistribuicaoPublicidade(publicidade) {

    console.log(
        "ABRINDO DISTRIBUIÇÃO DE PUBLICIDADE:",
        publicidade
    );

    publicidadeParaDistribuir =
        publicidade;

    publicidadeSelecionada.textContent =
        "📢 " + publicidade.nome;

    modalDistribuicaoPublicidade.style.display =
        "flex";

    listaClientesPublicidade.innerHTML =
        "<p>Carregando clientes...</p>";

    const {
        data,
        error
    } = await supabaseClient
        .from("clientes")
        .select(
            "id, nome, user_id, ativo"
        )
        .order(
            "id",
            {
                ascending: true
            }
        );

    if (error) {

        console.error(
            "ERRO AO CARREGAR CLIENTES:",
            error
        );

        listaClientesPublicidade.innerHTML =
            "<p>Erro ao carregar clientes.</p>";

        return;
    }

    listaClientesPublicidade.innerHTML =
        "";

    if (!data || data.length === 0) {

        listaClientesPublicidade.innerHTML =
            "<p>Nenhum cliente cadastrado.</p>";

        return;
    }

    data.forEach(
        function (cliente) {

            const label =
                document.createElement(
                    "label"
                );

            label.style.display =
                "block";

            label.style.marginBottom =
                "10px";

            label.style.padding =
                "8px";

            label.innerHTML = `

                <input
                    type="checkbox"
                    class="cliente-selecionado-publicidade"
                    value="${cliente.id}">

                <strong>
                    ${cliente.nome}
                </strong>

                <small>
                    (ID: ${cliente.id})
                </small>

            `;

            listaClientesPublicidade.appendChild(
                label
            );

        }
    );

}
// ============================================
// BOTÕES DE PUBLICIDADE
// ============================================

if (listaPublicidades) {

    listaPublicidades.addEventListener(
        "click",
        async function (event) {

// ========================================
// BOTÃO OUVIR PUBLICIDADE
// ========================================

const botaoOuvir =
    event.target.closest(
        ".botao-ouvir-publicidade"
    );

if (botaoOuvir) {

    const caminho =
        botaoOuvir.dataset.caminho;

    console.log(
        "OUVINDO PUBLICIDADE:",
        caminho
    );

    const urlAudio =
        "https://lseofiikzddefnyccirv.supabase.co/storage/v1/object/public/publicidades/" +
        caminho;

    const audio =
        new Audio(urlAudio);

    audio.play().catch(
        function (erro) {

            console.error(
                "ERRO AO REPRODUZIR PUBLICIDADE:",
                erro
            );

            alert(
                "Não foi possível reproduzir a publicidade."
            );

        }
    );

    return;
}

// ========================================
// BOTÃO ATIVAR / DESATIVAR PUBLICIDADE
// ========================================

const botaoAtivar =
    event.target.closest(
        ".botao-ativar-publicidade"
    );

if (botaoAtivar) {

    const id =
        Number(
            botaoAtivar.dataset.id
        );

    const ativo =
        botaoAtivar.dataset.ativo === "true";


    await alternarPublicidade(
        id,
        ativo
    );

    return;

}


            // ========================================
            // BOTÃO DISTRIBUIR PUBLICIDADE
            // ========================================

            const botaoDistribuir =
                event.target.closest(
                    ".botao-distribuir-publicidade"
                );


            if (botaoDistribuir) {

                const id =
                    Number(
                        botaoDistribuir.dataset.id
                    );


                console.log(
                    "BOTÃO DISTRIBUIR PUBLICIDADE CLICADO"
                );


                console.log(
                    "ID DA PUBLICIDADE:",
                    id
                );


                const {
                    data,
                    error
                } = await supabaseClient
                    .from("publicidades")
                    .select("*")
                    .eq(
                        "id",
                        id
                    )
                    .single();


                if (
                    error ||
                    !data
                ) {

                    console.error(
                        "ERRO AO ENCONTRAR PUBLICIDADE:",
                        error
                    );

                    return;

                }


                await abrirModalDistribuicaoPublicidade(
                    data
                );


                return;

            }

// ============================================
// ATIVAR / DESATIVAR PUBLICIDADE
// ============================================

async function alternarPublicidade(id, ativo) {

    console.log(
        "ALTERANDO PUBLICIDADE:",
        id,
        "ATUAL:",
        ativo
    );


    const novoStatus = !ativo;


    const {
        error
    } = await supabaseClient
        .from("publicidades")
        .update({
            ativo: novoStatus
        })
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(
            "ERRO AO ALTERAR PUBLICIDADE:",
            error
        );

        alert(
            "Não foi possível alterar o status da publicidade."
        );

        return;

    }


    console.log(
        "PUBLICIDADE ALTERADA PARA:",
        novoStatus
    );


    await carregarPublicidades();

}


            // ========================================
            // BOTÃO EXCLUIR PUBLICIDADE
            // ========================================

            const botaoExcluir =
                event.target.closest(
                    ".botao-excluir-publicidade"
                );


            if (botaoExcluir) {

                console.log(
                    "BOTÃO EXCLUIR PUBLICIDADE CLICADO"
                );


                const id =
                    Number(
                        botaoExcluir.dataset.id
                    );


                const caminho =
                    botaoExcluir.dataset.caminho;


                const nome =
                    botaoExcluir.dataset.nome;


                console.log(
                    "ID:",
                    id
                );


                console.log(
                    "CAMINHO:",
                    caminho
                );


                console.log(
                    "NOME:",
                    nome
                );


                await excluirPublicidade(
                    id,
                    caminho,
                    nome
                );


                return;

            }

        }
    );

}
// ============================================
// FECHAR MODAL DE PUBLICIDADE
// ============================================

if (botaoFecharModalPublicidade) {

    botaoFecharModalPublicidade.addEventListener(
        "click",
        function () {

            console.log(
                "FECHANDO MODAL DE PUBLICIDADE"
            );

            modalDistribuicaoPublicidade.style.display =
                "none";

            publicidadeParaDistribuir =
                null;

        }
    );

}


// ============================================
// CONFIRMAR DISTRIBUIÇÃO DE PUBLICIDADE
// ============================================

if (botaoConfirmarDistribuicaoPublicidade) {

    botaoConfirmarDistribuicaoPublicidade.addEventListener(
        "click",
        async function () {

            console.log(
                "CONFIRMAR DISTRIBUIÇÃO DE PUBLICIDADE"
            );

            if (!publicidadeParaDistribuir) {

                console.log(
                    "NENHUMA PUBLICIDADE SELECIONADA"
                );

                return;

            }

            const selecionados =
                document.querySelectorAll(
                    ".cliente-selecionado-publicidade:checked"
                );

            console.log(
                "CLIENTES SELECIONADOS:",
                selecionados.length
            );

            if (selecionados.length === 0) {

                alert(
                    "Selecione pelo menos um cliente."
                );

                return;

            }

            botaoConfirmarDistribuicaoPublicidade.disabled =
                true;

            let quantidadeDistribuida =
                0;

            for (
                const checkbox of selecionados
            ) {

                const clienteId =
                    Number(
                        checkbox.value
                    );

                console.log(
                    "DISTRIBUINDO PUBLICIDADE PARA CLIENTE:",
                    clienteId
                );


                // ==================================
                // VERIFICAR SE JÁ EXISTE
                // ==================================

                const {
                    data: existente,
                    error: erroVerificacao
                } = await supabaseClient
                    .from("radio_publicidades")
                    .select("id")
                    .eq(
                        "cliente_id",
                        clienteId
                    )
                    .eq(
                        "publicidade_id",
                        publicidadeParaDistribuir.id
                    );


                if (erroVerificacao) {

                    console.error(
                        "ERRO AO VERIFICAR PUBLICIDADE:",
                        erroVerificacao
                    );

                    continue;

                }


                if (
                    existente &&
                    existente.length > 0
                ) {

                    console.log(
                        "PUBLICIDADE JÁ DISTRIBUÍDA PARA:",
                        clienteId
                    );

                    continue;

                }


                // ==================================
                // INSERIR DISTRIBUIÇÃO
                // ==================================

                const {
                    error: erroDistribuicao
                } = await supabaseClient
                    .from("radio_publicidades")
                    .insert({

                        cliente_id:
                            clienteId,

                        publicidade_id:
                            publicidadeParaDistribuir.id,

                        ordem:
                            quantidadeDistribuida + 1

                    });


                if (erroDistribuicao) {

                    console.error(
                        "ERRO AO DISTRIBUIR PUBLICIDADE:",
                        erroDistribuicao
                    );

                    continue;

                }


                quantidadeDistribuida++;

                console.log(
                    "PUBLICIDADE DISTRIBUÍDA COM SUCESSO PARA:",
                    clienteId
                );

            }


            botaoConfirmarDistribuicaoPublicidade.disabled =
                false;

            modalDistribuicaoPublicidade.style.display =
                "none";

            publicidadeParaDistribuir =
                null;


            alert(
                quantidadeDistribuida +
                " distribuição(ões) realizada(s) com sucesso!"
            );

        }
    );

}

// ============================================
// ADICIONAR PUBLICIDADE
// ============================================

if (botaoAdicionarPublicidade) {

    botaoAdicionarPublicidade.addEventListener(
        "click",
        function () {

            arquivoPublicidade.click();

        }
    );

}

// ============================================
// UPLOAD DA PUBLICIDADE
// ============================================

if (arquivoPublicidade) {

    arquivoPublicidade.addEventListener(
        "change",
        async function () {

            const arquivo =
                arquivoPublicidade.files[0];


            if (!arquivo) {

                return;

            }


            if (!usuarioAdministrador) {

                alert(
                    "Somente o administrador pode adicionar publicidade."
                );

                arquivoPublicidade.value =
                    "";

                return;

            }


            console.log(
                "ENVIANDO PUBLICIDADE:",
                arquivo.name
            );


            const nomeArquivo =
                Date.now() +
                "-" +
                arquivo.name.replace(
                    /[^a-zA-Z0-9._-]/g,
                    "_"
                );


            const caminho =
                nomeArquivo;


            // ==================================
// ENVIAR PARA O STORAGE
// ==================================

const {
    error: erroUpload
} = await supabaseClient
    .storage
    .from("publicidades")
    .upload(
        caminho,
        arquivo
    );


if (erroUpload) {

    console.error(
    "ERRO NO UPLOAD DA PUBLICIDADE:",
    JSON.stringify(erroUpload, null, 2)
);

    alert(
        "Erro ao enviar a publicidade."
    );

    return;

}


// ==================================
// SALVAR NO BANCO
// ==================================

const {
    error: erroBanco
} = await supabaseClient
    .from("publicidades")
    .insert({

        nome:
            arquivo.name,

        caminho:
            caminho,

        ativo:
            true

    });


if (erroBanco) {

    console.log(
        "ERRO AO SALVAR PUBLICIDADE:",
        erroBanco
    );


    // Remover arquivo se o banco falhar

    await supabaseClient
        .storage
        .from("publicidades")
        .remove([
            caminho
        ]);


    alert(
        "Erro ao registrar a publicidade."
    );

    return;

}


console.log(
    "PUBLICIDADE ADICIONADA COM SUCESSO!"
);


arquivoPublicidade.value =
    "";


alert(
    "Publicidade adicionada com sucesso!"
);


carregarPublicidades();

}
);

}

// ============================================
// ATUALIZAR INDICADORES DO DASHBOARD
// ============================================

async function atualizarIndicadoresDashboard() {

    console.log(
        "ATUALIZANDO INDICADORES DO DASHBOARD..."
    );


    try {

        // ========================================
        // TOTAL DE MÚSICAS
        // ========================================

        const {
            count: totalMusicas,
            error: erroMusicas
        } = await supabaseClient
            .from("biblioteca_musicas")
            .select(
                "id",
                {
                    count: "exact",
                    head: true
                }
            );


        if (erroMusicas) {

            console.error(
                "ERRO AO CONTAR MÚSICAS:",
                erroMusicas
            );

        }


        // ========================================
        // TOTAL DE RÁDIOS
        // ========================================

        const {
            count: totalRadios,
            error: erroRadios
        } = await supabaseClient
            .from("clientes")
            .select(
                "id",
                {
                    count: "exact",
                    head: true
                }
            );


        if (erroRadios) {

            console.error(
                "ERRO AO CONTAR RÁDIOS:",
                erroRadios
            );

        }


        // ========================================
        // TOTAL DE PUBLICIDADES
        // ========================================

        const {
            count: totalPublicidades,
            error: erroPublicidades
        } = await supabaseClient
            .from("publicidades")
            .select(
                "id",
                {
                    count: "exact",
                    head: true
                }
            );


        if (erroPublicidades) {

            console.error(
                "ERRO AO CONTAR PUBLICIDADES:",
                erroPublicidades
            );

        }


        // ========================================
        // MOSTRAR NA TELA
        // ========================================

        const elementoMusicas =
            document.getElementById(
                "totalMusicas"
            );


        const elementoRadios =
            document.getElementById(
                "totalRadios"
            );


        const elementoPublicidades =
            document.getElementById(
                "totalPublicidades"
            );


        if (elementoMusicas) {

            elementoMusicas.textContent =
                totalMusicas || 0;

        }


        if (elementoRadios) {

            elementoRadios.textContent =
                totalRadios || 0;

        }


        if (elementoPublicidades) {

            elementoPublicidades.textContent =
                totalPublicidades || 0;

        }


        console.log(
            "INDICADORES:",
            {
                musicas: totalMusicas,
                radios: totalRadios,
                publicidades: totalPublicidades
            }
        );

    }

    catch (erro) {

        console.error(
            "ERRO AO ATUALIZAR INDICADORES:",
            erro
        );

    }

}

atualizarIndicadoresDashboard();

// ============================================
// CLIENTES E RÁDIOS
// ============================================

async function carregarClientesAdmin() {

    const lista =
        document.getElementById("listaClientesAdmin");

    if (!lista) {
        return;
    }

    console.log(
        "CARREGANDO CLIENTES ADMIN..."
    );

    lista.innerHTML =
        "<p>Carregando clientes...</p>";

    try {

        // ========================================
        // BUSCAR CLIENTES
        // ========================================

        const {
            data: clientes,
            error: erroClientes
        } = await supabaseClient
            .from("clientes")
            .select(
                "id, nome, ativo, user_id"
            )
            .order(
                "id",
                {
                    ascending: true
                }
            );


        if (erroClientes) {

            console.error(
                "ERRO AO CARREGAR CLIENTES:",
                erroClientes
            );

            lista.innerHTML =
                "<p>Erro ao carregar clientes.</p>";

            return;

        }


        console.log(
            "CLIENTES ENCONTRADOS:",
            clientes
        );


        if (
            !clientes ||
            clientes.length === 0
        ) {

            lista.innerHTML =
                "<p>Nenhum cliente cadastrado.</p>";

            return;

        }


        lista.innerHTML =
            "";


        // ========================================
        // MONTAR CLIENTES
        // ========================================

        for (
            const cliente of clientes
        ) {

            // ====================================
            // CONTAR MÚSICAS
            // ====================================

            const {
                count: quantidadeMusicas,
                error: erroMusicas
            } = await supabaseClient
                .from("radio_musicas")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                )
                .eq(
                    "cliente_id",
                    cliente.id
                );


            if (erroMusicas) {

                console.error(
                    "ERRO AO CONTAR MÚSICAS:",
                    erroMusicas
                );

            }


            // ====================================
            // CONTAR PUBLICIDADES
            // ====================================

            const {
                count: quantidadePublicidades,
                error: erroPublicidades
            } = await supabaseClient
                .from("radio_publicidades")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                )
                .eq(
                    "cliente_id",
                    cliente.id
                );

                console.log("PUBLICIDADES DO CLIENTE:",quantidadePublicidades);
                console.log("ERRO AO CONTAR PUBLICIDADES:", erroPublicidades);


            if (erroPublicidades) {

                console.error(
                    "ERRO AO CONTAR PUBLICIDADES:",
                    erroPublicidades
                );

            }


            // ====================================
            // STATUS
            // ====================================

            const status =
                cliente.ativo
                    ? "🟢 Rádio ativa"
                    : "🔴 Rádio inativa";


            // ====================================
            // CRIAR CARD
            // ====================================

            const card =
                document.createElement("div");

            card.classList.add(
                "admin-cliente"
            );


           card.innerHTML = `

    <div class="cliente-info">

        <h3>
            📻 ${cliente.nome}
        </h3>

        <p class="cliente-status">
            ${status}
        </p>

    </div>


    <div class="cliente-estatisticas">

        <span>
            🎵
            ${quantidadeMusicas || 0}
            músicas
        </span>

        <span>
            📢
            ${quantidadePublicidades || 0}
            publicidades
        </span>

    </div>


    <button
    class="botao-gerenciar-cliente"
    data-id="${cliente.id}"
    data-nome="${cliente.nome}"
    data-user-id="${cliente.user_id}">
    
    ⚙️ Gerenciar

</button>

`;



            lista.appendChild(
                card
            );

        }


        console.log(
            "CLIENTES CARREGADOS COM SUCESSO!"
        );

    }

    catch (erro) {

        console.error(
            "ERRO INESPERADO AO CARREGAR CLIENTES:",
            erro
        );

        lista.innerHTML =
            "<p>Erro inesperado ao carregar clientes.</p>";

    }

}


// ============================================
// INICIAR CLIENTES
// ============================================

carregarClientesAdmin();

// ============================================
// GERENCIAR CLIENTE
// ============================================

const listaClientesAdmin =
    document.getElementById("listaClientesAdmin");

const gerenciamentoCliente =
    document.getElementById("gerenciamentoCliente");

const dadosClienteGerenciamento =
    document.getElementById(
        "dadosClienteGerenciamento"
    );

const botaoFecharGerenciamento =
    document.getElementById(
        "botaoFecharGerenciamento"
    );


// ============================================
// ABRIR GERENCIAMENTO
// ============================================

if (listaClientesAdmin) {

    listaClientesAdmin.addEventListener(
        "click",
        async function (event) {

            const botao =
                event.target.closest(
                    ".botao-gerenciar-cliente"
                );

            if (!botao) {
                return;
            }

            const clienteId =
                Number(
                    botao.dataset.id
                );

            const clienteNome =
                botao.dataset.nome;

            const userId =
                botao.dataset.userId;

            console.log(
                "GERENCIANDO CLIENTE:",
                clienteId,
                clienteNome
            );

            if (gerenciamentoCliente) {

                gerenciamentoCliente.style.display =
                    "block";

            }

            if (dadosClienteGerenciamento) {

                dadosClienteGerenciamento.innerHTML = `

                    <h3>
                        📻 ${clienteNome}
                    </h3>

                    <p>
                        ID do cliente:
                        <strong>${clienteId}</strong>
                    </p>

                    <p>
                        Carregando informações da rádio...
                    </p>

                `;

            }


            // ====================================
            // BUSCAR MÚSICAS
            // ====================================

            const {
                count: quantidadeMusicas,
                error: erroMusicas
            } = await supabaseClient
                .from("radio_musicas")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                )
                .eq(
                    "cliente_id",
                    clienteId
                );


            // ====================================
            // BUSCAR PUBLICIDADES
            // ====================================

            const {
                count: quantidadePublicidades,
                error: erroPublicidades
            } = await supabaseClient
                .from("radio_publicidades")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                )
                .eq(
                    "cliente_id",
                    clienteId
                );


            // ====================================
            // BUSCAR CONFIGURAÇÃO DE PUBLICIDADE
            // ====================================

            const {
                data: dadosConfiguracao,
                error: erroConfiguracao
            } = await supabaseClient
                .from("clientes")
                .select(
                    "musicas_antes_publicidades, ativo"
                )
                .eq(
                    "id",
                    clienteId
                )
                .single();


            if (erroConfiguracao) {

                console.error(
                    "ERRO AO BUSCAR CONFIGURAÇÃO DE PUBLICIDADE:",
                    erroConfiguracao
                );

            }


            const quantidadeMusicasPublicidade =
                dadosConfiguracao?.musicas_antes_publicidades || 1;

            const estaAtivo =
                dadosConfiguracao?.ativo === true;


            if (erroMusicas) {

                console.error(
                    "ERRO AO CONTAR MÚSICAS:",
                    erroMusicas
                );

            }


            if (erroPublicidades) {

                console.error(
                    "ERRO AO CONTAR PUBLICIDADES:",
                    erroPublicidades
                );

            }


            // ====================================
            // MOSTRAR INFORMAÇÕES DO CLIENTE
            // ====================================

            if (dadosClienteGerenciamento) {

                dadosClienteGerenciamento.innerHTML = `

                    <h3 id="tituloNomeCliente">
                        📻 ${clienteNome}
                    </h3>

                    <div class="editar-nome-cliente">

                        <label for="nomeClienteEdicao">
                            Nome do cliente
                        </label>

                        <input
                            type="text"
                            id="nomeClienteEdicao"
                            placeholder="Digite o nome do cliente"
                        >

                        <button
                            id="salvarNomeCliente"
                            class="botao-adicionar"
                            type="button"
                        >
                            💾 Salvar nome
                        </button>

                    </div>

                    <p>
                        ID do cliente:
                        <strong>${clienteId}</strong>
                    </p>

                    <p>
                        Status da rádio:
                        <strong>
                            ${estaAtivo
                                ? "🟢 Ativa"
                                : "🔴 Desativada"}
                        </strong>
                    </p>

                    <button
                        type="button"
                        id="botaoAlterarStatusCliente"
                    >
                        ${estaAtivo
                            ? "🔴 Desativar rádio"
                            : "🟢 Ativar rádio"}
                    </button>

                    <div class="cliente-painel-info">

                        <div>
                            🎵
                            <strong>
                                ${quantidadeMusicas || 0}
                            </strong>
                            músicas
                        </div>

                        <div>
                            📢
                            <strong>
                                ${quantidadePublicidades || 0}
                            </strong>
                            publicidades
                        </div>

                    </div>

                    <hr>

<div class="acesso-cliente">

    <h4>
        🔐 Acesso do cliente
    </h4>

    <p>
        E-mail utilizado para entrar na Rádio Indoor:
    </p>

    <input
        type="email"
        id="emailClienteGerenciamento"
        placeholder="E-mail do cliente"
        readonly
    >

    <p>
        Para alterar a senha, informe uma nova senha:
    </p>

    <div class="campo-senha-cliente">

        <input
            type="password"
            id="novaSenhaCliente"
            placeholder="Digite a nova senha"
            autocomplete="new-password"
        >

        <button
            type="button"
            id="botaoMostrarSenhaCliente">
            👁️
        </button>

    </div>

    <button
        type="button"
        id="botaoAlterarSenhaCliente"
        class="botao-adicionar">

        🔑 Alterar senha

    </button>

    <p
        id="statusAcessoCliente">
    </p>

</div>
                    <hr>

                    <div class="configuracao-publicidade">

                        <h4>
                            🎵 Intervalo de publicidade
                        </h4>

                        <p>
                            Quantas músicas devem tocar antes
                            de uma publicidade?
                        </p>

                        <input
                            type="number"
                            id="musicasAntesPublicidade"
                            min="1"
                            value="${quantidadeMusicasPublicidade}"
                        >

                        <button
                            id="salvarMusicasAntesPublicidade"
                            type="button"
                        >
                            💾 Salvar configuração
                        </button>

                    </div>

                    <hr>

                    <div class="publicidades-cliente">

                        <h4>
                            📢 Publicidades desta rádio
                        </h4>

                        <div id="listaPublicidadesCliente">

                            <p>
                                Carregando publicidades...
                            </p>

                        </div>

                    </div>

                `;

                // ====================================
// BUSCAR E-MAIL / ACESSO DO CLIENTE
// ====================================

const campoEmailCliente =
    document.getElementById(
        "emailClienteGerenciamento"
    );

const statusAcessoCliente =
    document.getElementById(
        "statusAcessoCliente"
    );


if (campoEmailCliente && userId) {

    console.log(
        "BUSCANDO ACESSO DO CLIENTE:",
        clienteId,
        userId
    );


    try {

        // ====================================
        // PEGAR SESSÃO DO ADMIN
        // ====================================

        const {
            data: {
                session
            }
        } =
            await supabaseClient.auth.getSession();


        if (!session) {

            throw new Error(
                "Sessão do administrador não encontrada."
            );

        }


        // ====================================
        // CHAMAR EDGE FUNCTION
        // ====================================

        const resposta =
            await fetch(
                `${SUPABASE_URL}/functions/v1/smart-service`,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${session.access_token}`

                    },

                    body:
                        JSON.stringify({

                            acao:
                                "buscar_acesso",

                            user_id:
                                userId

                        })

                }
            );


        const resultado =
            await resposta.json();


        // ====================================
        // VERIFICAR ERRO
        // ====================================

        if (!resposta.ok) {

            console.error(
                "ERRO AO BUSCAR ACESSO:",
                resultado
            );

            throw new Error(
                resultado.erro ||
                "Não foi possível buscar o acesso do cliente."
            );

        }


        // ====================================
        // MOSTRAR E-MAIL
        // ====================================

        campoEmailCliente.value =
            resultado.email || "";


        console.log(
            "E-MAIL DO CLIENTE:",
            resultado.email
        );


        if (statusAcessoCliente) {

            statusAcessoCliente.textContent =
                "✅ Dados de acesso carregados.";

        }


    } catch (erro) {

        console.error(
            "ERRO AO BUSCAR E-MAIL DO CLIENTE:",
            erro
        );


        campoEmailCliente.value =
            "";


        campoEmailCliente.placeholder =
            "Não foi possível carregar o e-mail";


        if (statusAcessoCliente) {

            statusAcessoCliente.textContent =
                "❌ Não foi possível carregar os dados de acesso.";

        }

    }

}

// ====================================
// CONTROLE DE SENHA DO CLIENTE
// ====================================

const campoNovaSenhaCliente =
    document.getElementById(
        "novaSenhaCliente"
    );

const botaoMostrarSenhaCliente =
    document.getElementById(
        "botaoMostrarSenhaCliente"
    );

const botaoAlterarSenhaCliente =
    document.getElementById(
        "botaoAlterarSenhaCliente"
    );


// ====================================
// MOSTRAR / OCULTAR SENHA
// ====================================

if (
    campoNovaSenhaCliente &&
    botaoMostrarSenhaCliente
) {

    botaoMostrarSenhaCliente.addEventListener(
        "click",
        function () {

            if (
                campoNovaSenhaCliente.type ===
                "password"
            ) {

                campoNovaSenhaCliente.type =
                    "text";

                botaoMostrarSenhaCliente.textContent =
                    "🙈";

            } else {

                campoNovaSenhaCliente.type =
                    "password";

                botaoMostrarSenhaCliente.textContent =
                    "👁️";

            }

        }
    );

}


// ====================================
// ALTERAR SENHA
// ====================================

if (botaoAlterarSenhaCliente) {

    botaoAlterarSenhaCliente.addEventListener(
        "click",
        async function () {

            const novaSenha =
                campoNovaSenhaCliente
                    ? campoNovaSenhaCliente.value
                    : "";


            // ====================================
            // VALIDAR
            // ====================================

            if (!novaSenha) {

                alert(
                    "Digite a nova senha do cliente."
                );

                if (campoNovaSenhaCliente) {
                    campoNovaSenhaCliente.focus();
                }

                return;

            }


            if (novaSenha.length < 6) {

                alert(
                    "A nova senha deve ter pelo menos 6 caracteres."
                );

                if (campoNovaSenhaCliente) {
                    campoNovaSenhaCliente.focus();
                }

                return;

            }


            // ====================================
            // CONFIRMAR
            // ====================================

            const confirmar =
                confirm(
                    `Deseja realmente alterar a senha deste cliente?\n\n` +
                    `A nova senha será necessária para o próximo acesso.`
                );


            if (!confirmar) {

                return;

            }


            // ====================================
            // DESABILITAR BOTÃO
            // ====================================

            botaoAlterarSenhaCliente.disabled =
                true;

            botaoAlterarSenhaCliente.textContent =
                "⏳ Alterando...";


            if (statusAcessoCliente) {

                statusAcessoCliente.textContent =
                    "🔄 Alterando senha...";

            }


            try {

                // ====================================
                // PEGAR SESSÃO DO ADMIN
                // ====================================

                const {
                    data: {
                        session
                    }
                } =
                    await supabaseClient.auth.getSession();


                if (!session) {

                    throw new Error(
                        "Sessão do administrador não encontrada."
                    );

                }


                // ====================================
                // CHAMAR EDGE FUNCTION
                // ====================================

                const resposta =
                    await fetch(
                        `${SUPABASE_URL}/functions/v1/smart-service`,
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${session.access_token}`

                            },

                            body:
                                JSON.stringify({

                                    acao:
                                        "alterar_senha",

                                    user_id:
                                        userId,

                                    nova_senha:
                                        novaSenha

                                })

                        }
                    );


                const resultado =
                    await resposta.json();


                // ====================================
                // VERIFICAR ERRO
                // ====================================

                if (!resposta.ok) {

                    console.error(
                        "ERRO AO ALTERAR SENHA:",
                        resultado
                    );

                    throw new Error(
                        resultado.erro ||
                        "Não foi possível alterar a senha."
                    );

                }


                // ====================================
                // SUCESSO
                // ====================================

                console.log(
                    "SENHA ALTERADA COM SUCESSO:",
                    resultado
                );


                alert(
                    "Senha do cliente alterada com sucesso! ✅"
                );


                // ====================================
                // LIMPAR CAMPO
                // ====================================

                if (campoNovaSenhaCliente) {

                    campoNovaSenhaCliente.value = "";

                    campoNovaSenhaCliente.type =
                        "password";

                }


                if (botaoMostrarSenhaCliente) {

                    botaoMostrarSenhaCliente.textContent =
                        "👁️";

                }


                if (statusAcessoCliente) {

                    statusAcessoCliente.textContent =
                        "✅ Senha alterada com sucesso.";

                }


            } catch (erro) {

                console.error(
                    "ERRO AO ALTERAR SENHA DO CLIENTE:",
                    erro
                );


                if (statusAcessoCliente) {

                    statusAcessoCliente.textContent =
                        "❌ Erro ao alterar senha.";

                }


                alert(
                    erro.message ||
                    "Não foi possível alterar a senha."
                );

            } finally {

                botaoAlterarSenhaCliente.disabled =
                    false;

                botaoAlterarSenhaCliente.textContent =
                    "🔑 Alterar senha";

            }

        }
    );

}

                // ====================================
                // PREENCHER CAMPO DO NOME
                // ====================================

                const campoNomeCliente =
                    document.getElementById(
                        "nomeClienteEdicao"
                    );

                if (campoNomeCliente) {

                    campoNomeCliente.value =
                        clienteNome;

                }


                // ====================================
                // SALVAR NOME DO CLIENTE
                // ====================================

                const botaoSalvarNomeCliente =
                    document.getElementById(
                        "salvarNomeCliente"
                    );

                if (botaoSalvarNomeCliente) {

                    botaoSalvarNomeCliente.addEventListener(
                        "click",
                        async function () {

                            const novoNome =
                                campoNomeCliente.value.trim();


                            if (!novoNome) {

                                alert(
                                    "Digite um nome para o cliente."
                                );

                                return;

                            }


                            botaoSalvarNomeCliente.disabled =
                                true;

                            botaoSalvarNomeCliente.textContent =
                                "Salvando...";


                            const {
                                error: erroNome
                            } = await supabaseClient
                                .from("clientes")
                                .update({
                                    nome: novoNome
                                })
                                .eq(
                                    "id",
                                    clienteId
                                );


                            if (erroNome) {

                                console.error(
                                    "ERRO AO ALTERAR NOME:",
                                    erroNome
                                );

                                alert(
                                    "Não foi possível alterar o nome do cliente."
                                );

                                botaoSalvarNomeCliente.disabled =
                                    false;

                                botaoSalvarNomeCliente.textContent =
                                    "💾 Salvar nome";

                                return;

                            }


                            console.log(
                                "NOME ALTERADO COM SUCESSO:",
                                novoNome
                            );


                            alert(
                                "Nome do cliente alterado com sucesso! ✅"
                            );


                            const tituloNomeCliente =
                                document.getElementById(
                                    "tituloNomeCliente"
                                );

                            if (tituloNomeCliente) {

                                tituloNomeCliente.textContent =
                                    `📻 ${novoNome}`;

                            }


                            const botaoGerenciar =
                                document.querySelector(
                                    `.botao-gerenciar-cliente[data-id="${clienteId}"]`
                                );

                            if (botaoGerenciar) {

                                botaoGerenciar.dataset.nome =
                                    novoNome;

                            }


                            await carregarClientesAdmin();


                            botaoSalvarNomeCliente.disabled =
                                false;

                            botaoSalvarNomeCliente.textContent =
                                "💾 Salvar nome";

                        }
                    );

                }


                // ====================================
                // ALTERAR STATUS DA RÁDIO
                // ====================================

                const botaoAlterarStatusCliente =
                    document.getElementById(
                        "botaoAlterarStatusCliente"
                    );


                if (botaoAlterarStatusCliente) {

                    botaoAlterarStatusCliente.addEventListener(
                        "click",
                        async function () {

                            const novoStatus =
                                !estaAtivo;


                            console.log(
                                "ALTERANDO STATUS DA RÁDIO:",
                                clienteId,
                                novoStatus
                            );


                            const confirmar =
                                confirm(
                                    novoStatus
                                        ? "Deseja ativar esta rádio?"
                                        : "Deseja desativar esta rádio?"
                                );


                            if (!confirmar) {

                                return;

                            }


                            botaoAlterarStatusCliente.disabled =
                                true;


                            const {
                                error: erroStatus
                            } = await supabaseClient
                                .from("clientes")
                                .update({
                                    ativo: novoStatus
                                })
                                .eq(
                                    "id",
                                    clienteId
                                );


                            if (erroStatus) {

                                console.error(
                                    "ERRO AO ALTERAR STATUS DA RÁDIO:",
                                    erroStatus
                                );

                                alert(
                                    "Não foi possível alterar o status da rádio."
                                );

                                botaoAlterarStatusCliente.disabled =
                                    false;

                                return;

                            }


                            console.log(
                                "STATUS DA RÁDIO ALTERADO COM SUCESSO:",
                                novoStatus
                            );


                            alert(
                                novoStatus
                                    ? "Rádio ativada com sucesso!"
                                    : "Rádio desativada com sucesso!"
                            );


                            if (dadosClienteGerenciamento) {

                                const novoTextoStatus =
                                    novoStatus
                                        ? "🟢 Ativa"
                                        : "🔴 Desativada";


                                dadosClienteGerenciamento
                                    .querySelector(
                                        "p strong"
                                    )
                                    .textContent =
                                    novoTextoStatus;

                            }


                            botaoAlterarStatusCliente.textContent =
                                novoStatus
                                    ? "🔴 Desativar rádio"
                                    : "🟢 Ativar rádio";


                            botaoAlterarStatusCliente.disabled =
                                false;

                        }
                    );

                }


                // ====================================
                // SALVAR INTERVALO DE PUBLICIDADE
                // ====================================

                const campoMusicasPublicidade =
                    document.getElementById(
                        "musicasAntesPublicidade"
                    );


                const botaoSalvarPublicidade =
                    document.getElementById(
                        "salvarMusicasAntesPublicidade"
                    );


                if (
                    campoMusicasPublicidade &&
                    botaoSalvarPublicidade
                ) {

                    botaoSalvarPublicidade.addEventListener(
                        "click",
                        async function () {

                            const quantidade =
                                Number(
                                    campoMusicasPublicidade.value
                                );


                            if (
                                !quantidade ||
                                quantidade < 1
                            ) {

                                alert(
                                    "Digite uma quantidade válida de músicas."
                                );

                                return;

                            }


                            console.log(
                                "SALVANDO INTERVALO DE PUBLICIDADE:",
                                quantidade,
                                "músicas"
                            );


                            botaoSalvarPublicidade.disabled =
                                true;


                            const {
                                error
                            } = await supabaseClient
                                .from("clientes")
                                .update({

                                    musicas_antes_publicidades:
                                        quantidade

                                })
                                .eq(
                                    "id",
                                    clienteId
                                );


                            if (error) {

                                console.error(
                                    "ERRO AO SALVAR INTERVALO:",
                                    error
                                );

                                alert(
                                    "Não foi possível salvar a configuração."
                                );

                                botaoSalvarPublicidade.disabled =
                                    false;

                                return;

                            }


                            console.log(
                                "INTERVALO DE PUBLICIDADE SALVO:",
                                quantidade
                            );


                            alert(
                                `Configuração salva!\n\n${quantidade} música(s) antes da publicidade.`
                            );


                            botaoSalvarPublicidade.disabled =
                                false;

                        }
                    );

                }


                // ====================================
                // CARREGAR PUBLICIDADES DO CLIENTE
                // ====================================

                const listaPublicidadesCliente =
                    document.getElementById(
                        "listaPublicidadesCliente"
                    );


                if (listaPublicidadesCliente) {

                    console.log(
                        "CARREGANDO PUBLICIDADES DO CLIENTE:",
                        clienteId
                    );


                    const {
                        data: distribuicoesPublicidade,
                        error: erroDistribuicoesPublicidade
                    } = await supabaseClient
                        .from("radio_publicidades")
                        .select(
                            "id, ordem, publicidade_id"
                        )
                        .eq(
                            "cliente_id",
                            clienteId
                        )
                        .order(
                            "ordem",
                            {
                                ascending: true
                            }
                        );


                    if (erroDistribuicoesPublicidade) {

                        console.error(
                            "ERRO AO CARREGAR DISTRIBUIÇÕES:",
                            erroDistribuicoesPublicidade
                        );


                        listaPublicidadesCliente.innerHTML = `
                            <p>
                                Erro ao carregar publicidades.
                            </p>
                        `;

                    } else if (
                        !distribuicoesPublicidade ||
                        distribuicoesPublicidade.length === 0
                    ) {

                        listaPublicidadesCliente.innerHTML = `
                            <p>
                                Nenhuma publicidade distribuída
                                para esta rádio.
                            </p>
                        `;


                        console.log(
                            "NENHUMA PUBLICIDADE DISTRIBUÍDA PARA O CLIENTE."
                        );

                    } else {

                        console.log(
                            "DISTRIBUIÇÕES ENCONTRADAS:",
                            distribuicoesPublicidade
                        );


                        const idsPublicidades =
                            distribuicoesPublicidade.map(
                                function (item) {

                                    return item.publicidade_id;

                                }
                            );


                        console.log(
                            "IDS DAS PUBLICIDADES:",
                            idsPublicidades
                        );


                        const {
                            data: publicidades,
                            error: erroPublicidadesCliente
                        } = await supabaseClient
                            .from("publicidades")
                            .select(
                                "id, nome, ativo, caminho"
                            )
                            .in(
                                "id",
                                idsPublicidades
                            );


                        if (erroPublicidadesCliente) {

                            console.error(
                                "ERRO AO CARREGAR PUBLICIDADES:",
                                erroPublicidadesCliente
                            );


                            listaPublicidadesCliente.innerHTML = `
                                <p>
                                    Erro ao carregar publicidades.
                                </p>
                            `;

                        } else {

                            console.log(
                                "PUBLICIDADES ENCONTRADAS:",
                                publicidades
                            );


                            listaPublicidadesCliente.innerHTML =
                                "";


                            distribuicoesPublicidade.forEach(
                                function (
                                    distribuicao,
                                    indice
                                ) {

                                    const publicidade =
                                        publicidades.find(
                                            function (item) {

                                                return (
                                                    item.id ===
                                                    distribuicao.publicidade_id
                                                );

                                            }
                                        );


                                    if (!publicidade) {

                                        return;

                                    }


                                    const item =
                                        document.createElement(
                                            "div"
                                        );


                                    item.classList.add(
                                        "admin-musica"
                                    );


                                    item.innerHTML = `

    <span>

        📢
        ${indice + 1}.
        ${publicidade.nome}

        <br>

        <small>
            ${publicidade.ativo
                ? "Ativa"
                : "Inativa"}
        </small>

    </span>


    <div>

        <button
            type="button"
            class="botao-ouvir-publicidade-cliente"
            data-caminho="${publicidade.caminho}"
        >

            ▶️ Reproduzir

        </button>


        <button
            type="button"
            class="botao-remover-publicidade-cliente"
            data-id="${distribuicao.id}"
            data-nome="${publicidade.nome}"
        >

            🗑️ Remover

        </button>

    </div>

`;


                                    listaPublicidadesCliente.appendChild(
                                        item
                                    );

                                }
                            );


                            console.log(
                                "PUBLICIDADES DO CLIENTE CARREGADAS COM SUCESSO."
                            );

                        }

                    }

                }


                // ====================================
                // REMOVER PUBLICIDADE DA RÁDIO
                // ====================================

                if (listaPublicidadesCliente) {

                    listaPublicidadesCliente.addEventListener(
                        "click",
                        async function (event) {

                            // ========================================
// BOTÃO REPRODUZIR PUBLICIDADE
// ========================================

const botaoOuvir =
    event.target.closest(
        ".botao-ouvir-publicidade-cliente"
    );


if (botaoOuvir) {

    const caminho =
        botaoOuvir.dataset.caminho;


    console.log(
        "REPRODUZINDO PUBLICIDADE DO CLIENTE:",
        caminho
    );


    const urlAudio =
        "https://lseofiikzddefnyccirv.supabase.co/storage/v1/object/public/publicidades/" +
        caminho;


    const audio =
        new Audio(urlAudio);


    audio.play().catch(
        function (erro) {

            console.error(
                "ERRO AO REPRODUZIR PUBLICIDADE:",
                erro
            );


            alert(
                "Não foi possível reproduzir a publicidade."
            );

        }
    );


    return;

}

                            const botao =
                                event.target.closest(
                                    ".botao-remover-publicidade-cliente"
                                );


                            if (!botao) {

                                return;

                            }


                            const distribuicaoId =
                                Number(
                                    botao.dataset.id
                                );


                            const nomePublicidade =
                                botao.dataset.nome;


                            console.log(
                                "REMOVENDO PUBLICIDADE DA RÁDIO:",
                                distribuicaoId,
                                nomePublicidade
                            );


                            const confirmar =
                                confirm(
                                    `Deseja remover a publicidade "${nomePublicidade}" desta rádio?`
                                );


                            if (!confirmar) {

                                return;

                            }


                            botao.disabled =
                                true;


                            const {
                                error: erroRemocao
                            } = await supabaseClient
                                .from("radio_publicidades")
                                .delete()
                                .eq(
                                    "id",
                                    distribuicaoId
                                )
                                .eq(
                                    "cliente_id",
                                    clienteId
                                );


                            if (erroRemocao) {

                                console.error(
                                    "ERRO AO REMOVER PUBLICIDADE:",
                                    erroRemocao
                                );


                                alert(
                                    "Não foi possível remover a publicidade."
                                );


                                botao.disabled =
                                    false;

                                return;

                            }


                            console.log(
                                "PUBLICIDADE REMOVIDA DA RÁDIO COM SUCESSO."
                            );


                            alert(
                                "Publicidade removida da rádio com sucesso!"
                            );


                            const item =
                                botao.closest(
                                    ".admin-musica"
                                );


                            if (item) {

                                item.remove();

                            }

                        }
                    );

                }

            }


            // ====================================
            // ROLAR ATÉ O GERENCIAMENTO
            // ====================================

            gerenciamentoCliente.scrollIntoView({
                behavior: "smooth"
            });

        }
    );

}


// ============================================
// FECHAR GERENCIAMENTO
// ============================================

if (botaoFecharGerenciamento) {

    botaoFecharGerenciamento.addEventListener(
        "click",
        function () {

            gerenciamentoCliente.style.display =
                "none";

        }
    );

}
// ============================================
// CADASTRAR NOVO CLIENTE - ABRIR FORMULÁRIO
// ============================================

const botaoCadastrarCliente =
    document.getElementById(
        "botaoCadastrarCliente"
    );

const cadastroNovoCliente =
    document.getElementById(
        "cadastroNovoCliente"
    );

const botaoCancelarCadastroCliente =
    document.getElementById(
        "botaoCancelarCadastroCliente"
    );


if (
    botaoCadastrarCliente &&
    cadastroNovoCliente
) {

    botaoCadastrarCliente.addEventListener(
        "click",
        function () {

            cadastroNovoCliente.style.display =
                "block";

            cadastroNovoCliente.scrollIntoView({
                behavior: "smooth"
            });

        }
    );

}


// ============================================
// CANCELAR CADASTRO
// ============================================

if (
    botaoCancelarCadastroCliente &&
    cadastroNovoCliente
) {

    botaoCancelarCadastroCliente.addEventListener(
        "click",
        function () {

            cadastroNovoCliente.style.display =
                "none";

        }
    );

}

// ============================================
// CADASTRAR NOVO CLIENTE
// ============================================

const botaoSalvarNovoCliente =
    document.getElementById(
        "botaoSalvarNovoCliente"
    );

const novoClienteNome =
    document.getElementById(
        "novoClienteNome"
    );

const novoClienteEmail =
    document.getElementById(
        "novoClienteEmail"
    );

const novoClienteSenha =
    document.getElementById(
        "novoClienteSenha"
    );


if (
    botaoSalvarNovoCliente &&
    novoClienteNome &&
    novoClienteEmail &&
    novoClienteSenha
) {

    botaoSalvarNovoCliente.addEventListener(
        "click",
        async function () {

            // ====================================
            // PEGAR DADOS DO FORMULÁRIO
            // ====================================

            const nome =
                novoClienteNome.value.trim();

            const email =
                novoClienteEmail.value.trim();

            const senha =
                novoClienteSenha.value;


            // ====================================
            // VALIDAR
            // ====================================

            if (!nome) {

                alert(
                    "Digite o nome do cliente."
                );

                novoClienteNome.focus();

                return;

            }


            if (!email) {

                alert(
                    "Digite o e-mail do cliente."
                );

                novoClienteEmail.focus();

                return;

            }


            if (!senha) {

                alert(
                    "Digite a senha do cliente."
                );

                novoClienteSenha.focus();

                return;

            }


            if (senha.length < 6) {

                alert(
                    "A senha deve ter pelo menos 6 caracteres."
                );

                novoClienteSenha.focus();

                return;

            }


            // ====================================
            // CONFIRMAR CADASTRO
            // ====================================

            const confirmar =
                confirm(
                    `Cadastrar o cliente "${nome}"?\n\nE-mail: ${email}`
                );


            if (!confirmar) {

                return;

            }


            // ====================================
            // DESABILITAR BOTÃO
            // ====================================

            botaoSalvarNovoCliente.disabled =
                true;

            botaoSalvarNovoCliente.textContent =
                "⏳ Cadastrando...";


            try {

                // =================================
                // PEGAR SESSÃO DO ADMIN
                // =================================

                const {
                    data: {
                        session
                    }
                } =
                    await supabaseClient.auth
                        .getSession();


                if (!session) {

                    throw new Error(
                        "Sessão do administrador não encontrada."
                    );

                }


                // =================================
                // CHAMAR EDGE FUNCTION
                // =================================

                const resposta =
                    await fetch(
                        `${SUPABASE_URL}/functions/v1/smart-service`,
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${session.access_token}`

                            },

                            body:
                                JSON.stringify({

                                    nome: nome,

                                    email: email,

                                    senha: senha

                                })

                        }
                    );


                const resultado =
                    await resposta.json();


                // =================================
                // VERIFICAR ERRO
                // =================================

                if (!resposta.ok) {

                    console.error(
                        "ERRO AO CADASTRAR CLIENTE:",
                        resultado
                    );

                    throw new Error(
                        resultado.erro ||
                        "Não foi possível cadastrar o cliente."
                    );

                }


                // =================================
                // SUCESSO
                // =================================

                console.log(
                    "CLIENTE CADASTRADO:",
                    resultado
                );


                alert(
                    `Cliente "${nome}" cadastrado com sucesso! ✅`
                );


                // =================================
                // LIMPAR FORMULÁRIO
                // =================================

                novoClienteNome.value =
                    "";

                novoClienteEmail.value =
                    "";

                novoClienteSenha.value =
                    "";


                // =================================
                // FECHAR FORMULÁRIO
                // =================================

                cadastroNovoCliente.style.display =
                    "none";


                // =================================
                // ATUALIZAR LISTA DE CLIENTES
                // =================================

                await carregarClientesAdmin();


            } catch (erro) {

                console.error(
                    "ERRO NO CADASTRO DO CLIENTE:",
                    erro
                );


                alert(
                    erro.message ||
                    "Erro ao cadastrar cliente."
                );

            }


            // ====================================
            // REATIVAR BOTÃO
            // ====================================

            botaoSalvarNovoCliente.disabled =
                false;

            botaoSalvarNovoCliente.textContent =
                "💾 Cadastrar cliente";

        }
    );

}// ============================================
// GERAR PUBLICIDADE COM PYTHON / PIPER
// ============================================

const botaoGerarPublicidade =
    document.getElementById("botaoGerarPublicidade");

const statusGerarPublicidade =
    document.getElementById("statusGerarPublicidade");

const previaPublicidade =
    document.getElementById("previaPublicidade");

const audioPublicidade =
    document.getElementById("audioPublicidade");


if (botaoGerarPublicidade) {

    botaoGerarPublicidade.addEventListener(
        "click",
        async function () {

            const nome =
                document
                    .getElementById("nomePublicidade")
                    .value
                    .trim();

            const voz =
                document
                    .getElementById("vozPublicidade")
                    .value;

                    const velocidade =
                document
                    .getElementById("velocidadePublicidade")
                    .value;
        
            const texto =
                document
                    .getElementById("textoPublicidade")
                    .value
                    .trim();


            if (!nome) {

                statusGerarPublicidade.textContent =
                    "⚠️ Digite o nome da publicidade.";

                return;
            }


            if (!texto) {

                statusGerarPublicidade.textContent =
                    "⚠️ Digite o texto da publicidade.";

                return;
            }


            statusGerarPublicidade.textContent =
                "🎙️ Gerando publicidade... Aguarde.";

            botaoGerarPublicidade.disabled = true;


            try {

                const resposta = await fetch(
                    "http://127.0.0.1:8765/gerar-publicidade",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            nome: nome,
                            texto: texto,
                            voz: voz,
                            velocidade: velocidade
                        })
                    }
                );


                const resultado =
                    await resposta.json();


                if (!resposta.ok) {

                    throw new Error(
                        resultado.erro ||
                        "Erro ao gerar publicidade."
                    );
                }


                // ====================================
                // PRÉVIA DO ÁUDIO
                // ====================================

                const caminhoAudio =
                    resultado.arquivo;


                const urlAudio =
                    "http://127.0.0.1:8765/audio/" +
                    encodeURIComponent(caminhoAudio);


                audioPublicidade.src =
                    urlAudio;


                previaPublicidade.style.display =
                    "block";


                // ====================================
                // ENVIAR PARA O SUPABASE
                // ====================================

                statusGerarPublicidade.textContent =
                    "☁️ Enviando publicidade para o Supabase...";


                const respostaAudio =
                    await fetch(urlAudio);


                if (!respostaAudio.ok) {

                    throw new Error(
                        "Não foi possível acessar o áudio gerado."
                    );

                }


                const blobAudio =
                    await respostaAudio.blob();


                // ====================================
                // NOME DO ARQUIVO
                // ====================================

                const nomeArquivo =
    nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[\\/:*?"<>|]/g, "")
        .replace(/\s+/g, "_")
        .trim();


                const caminhoSupabase =
                    "biblioteca/" +
                    Date.now() +
                    "_" +
                    nomeArquivo +
                    ".mp3";


                // ====================================
                // UPLOAD PARA STORAGE
                // ====================================

                const {
                    error: erroUpload
                } = await supabaseClient
                    .storage
                    .from("publicidades")
                    .upload(
                        caminhoSupabase,
                        blobAudio,
                        {
                            contentType: "audio/mpeg",
                            upsert: false
                        }
                    );


                if (erroUpload) {

                    throw new Error(
                        "Erro ao enviar para o Storage: " +
                        erroUpload.message
                    );

                }


                // ====================================
                // CADASTRAR NA TABELA PUBLICIDADES
                // ====================================

                const {
                    data: publicidadeCriada,
                    error: erroTabela
                } = await supabaseClient
                    .from("publicidades")
                    .insert({
                        nome: nome,
                        caminho: caminhoSupabase,
                        ativo: true
                    })
                    .select();


                if (erroTabela) {

                    throw new Error(
                        "Erro ao cadastrar publicidade: " +
                        erroTabela.message
                    );

                }


                statusGerarPublicidade.textContent =
                    "✅ Publicidade salva no Supabase com sucesso!";


                console.log(
                    "PUBLICIDADE SALVA:",
                    publicidadeCriada
                );

                await carregarPublicidades();

            } catch (erro) {

                console.error(
                    "ERRO AO GERAR PUBLICIDADE:",
                    erro
                );


                statusGerarPublicidade.textContent =
                    "❌ Não foi possível gerar/salvar a publicidade. " +
                    erro.message;


            } finally {

                botaoGerarPublicidade.disabled =
                    false;

            }

        }
    );

}

// ============================================
// STATUS DO SERVIDOR DE PUBLICIDADE
// ============================================

async function verificarServidorPublicidade() {

    const status =
        document.getElementById(
            "statusServidorPublicidade"
        );

    if (!status) return;

    try {

        const resposta = await fetch(
            "http://127.0.0.1:8765/status"
        );

        if (!resposta.ok) {
            throw new Error("Servidor offline");
        }

        const dados =
            await resposta.json();

        if (dados.online === true) {

            status.textContent =
                "🟢 Servidor de áudio: ONLINE";

            status.style.background =
                "#d4edda";

            status.style.color =
                "#155724";

        } else {

            throw new Error("Servidor offline");

        }

    } catch (erro) {

        status.textContent =
            "🔴 Servidor de áudio: OFFLINE";

        status.style.background =
            "#f8d7da";

        status.style.color =
            "#721c24";

    }

}


// Verificar ao abrir o painel
verificarServidorPublicidade();


// Verificar novamente a cada 10 segundos
setInterval(
    verificarServidorPublicidade,
    10000
);
