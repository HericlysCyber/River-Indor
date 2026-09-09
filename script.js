const audio = document.getElementById("audio");

const botaoPlay = document.getElementById("play");
const botaoAnterior = document.getElementById("anterior");
const botaoProxima = document.getElementById("proxima");

const botaoAleatorio = document.getElementById("aleatorio");

botaoAleatorio.addEventListener(
    "click",
    function () {

        modoAleatorio =
            !modoAleatorio;

        if (modoAleatorio) {

            botaoAleatorio.textContent =
                "🔀";

            botaoAleatorio.classList.add(
                "ativo"
            );

        } else {

            botaoAleatorio.textContent =
                "🔀";

            botaoAleatorio.classList.remove(
                "ativo"
            );

        }

    }
);

// ============================================
// PUBLICIDADES
// ============================================

let publicidades = [];

let publicidadeAtual = 0;

let tocandoPublicidade = false;

// ============================================
// CONTROLE DE INTERVALO DE PUBLICIDADE
// ============================================

let quantidadeMusicasAntesPublicidade = 1;

let contadorMusicasPublicidade = 0;

// ============================================
// CARREGAR CONFIGURAÇÃO DE PUBLICIDADE
// ============================================

async function carregarConfiguracaoPublicidade() {

    try {

        if (!CLIENTE_ID) {

            console.log(
                "Nenhum cliente identificado para configuração de publicidade."
            );

            return;

        }


        console.log(
            "BUSCANDO CONFIGURAÇÃO DE PUBLICIDADE DO CLIENTE:",
            CLIENTE_ID
        );


        const {
            data,
            error
        } = await supabaseClient
            .from("clientes")
            .select(
                "musicas_antes_publicidades, ativo"
            )
            .eq(
                "id",
                CLIENTE_ID
            )
            .single();


        if (error) {

            console.error(
                "ERRO AO BUSCAR CONFIGURAÇÃO DE PUBLICIDADE:",
                error
            );

            return;

        }
// ============================================
// VERIFICAR STATUS DA RÁDIO
// ============================================

if (data.ativo === false) {

    console.log(
        "RÁDIO DESATIVADA PARA ESTE CLIENTE."
    );

    alert(
        "🚫 Esta rádio está temporariamente desativada."
    );

    return;

}

        if (
            data &&
            data.musicas_antes_publicidades
        ) {

            quantidadeMusicasAntesPublicidade =
                Number(
                    data.musicas_antes_publicidades
                );

        }


        console.log(
            "QUANTIDADE DE MÚSICAS ANTES DA PUBLICIDADE:",
            quantidadeMusicasAntesPublicidade
        );

    }

    catch (erro) {

        console.error(
            "ERRO INESPERADO AO CARREGAR CONFIGURAÇÃO:",
            erro
        );

    }

}

const volume = document.querySelector(".volume input");

const progresso = document.getElementById("progresso");
const barra = document.getElementById("barra");

const tempoAtual = document.getElementById("tempoAtual");
const duracao = document.getElementById("duracao");

const nomeMusica = document.getElementById("nomeMusica");
const artista = document.getElementById("artista");

const lista = document.getElementById("listaMusicas");

const nomeClienteRadio =
    document.getElementById("nomeClienteRadio");

    const nomePublicidadeRadio =
    document.getElementById("nomePublicidadeRadio");

const statusPublicidadeRadio =
    document.getElementById("statusPublicidadeRadio");

// ============================================
// CLIENTE DA RÁDIO
// ============================================

let CLIENTE_ID = null;

console.log(
    "Cliente da rádio ainda não identificado."
);



// ============================================
// PLAYLIST
// ============================================

let playlist = [];

let musicaAtual = 0;

let modoAleatorio = false;


// ============================================
// CARREGAR MÚSICAS DO CLIENTE
// ============================================

async function carregarMusicasDoSupabase() {

    try {

        if (!CLIENTE_ID) {

    console.log(
        "Nenhum cliente identificado."
    );

    nomeMusica.textContent =
        "Faça login para acessar sua rádio";

    artista.textContent =
        "Cliente não identificado";

    if (lista) {

        lista.innerHTML = `
            <p>
                Faça login para acessar sua rádio.
            </p>
        `;

    }

    return;
}

// ========================================
// VERIFICAR SE A RÁDIO ESTÁ ATIVA
// ========================================

const {
    data: clienteStatus,
    error: erroStatus
} = await supabaseClient
    .from("clientes")
    .select("ativo")
    .eq("id", CLIENTE_ID)
    .single();

if (erroStatus) {

    console.error(
        "ERRO AO VERIFICAR STATUS DA RÁDIO:",
        erroStatus
    );

    return;
}

if (clienteStatus.ativo === false) {

    console.log(
        "RÁDIO DESATIVADA. PLAYLIST NÃO SERÁ CARREGADA."
    );

    playlist = [];

    nomeMusica.textContent =
        "Rádio desativada";

    artista.textContent =
        "Entre em contato com o administrador";

    if (lista) {

        lista.innerHTML = `
            <p>
                🚫 Esta rádio está temporariamente desativada.
            </p>
        `;

    }

    return;
}



        console.log(
            "Buscando músicas do cliente:",
            CLIENTE_ID
        );


        // ========================================
        // BUSCAR DISTRIBUIÇÕES
        // ========================================

        const {
    data: distribuicoes,
    error: erroDistribuicao
} = await supabaseClient
    .from("radio_musicas")
    .select(
        "id, cliente_id, musica_id, ordem"
    )
    .eq(
        "cliente_id",
        CLIENTE_ID
    )
    .order(
        "ordem",
        {
            ascending: true
        }
    );
    


        if (erroDistribuicao) {

            console.log(
                "Erro ao buscar distribuições:",
                erroDistribuicao
            );

            nomeMusica.textContent =
                "Erro ao carregar rádio";

            artista.textContent =
                "Verifique a conexão";

            return;

        }


        console.log(
            "Distribuições encontradas:",
            distribuicoes
        );


        // ========================================
        // NENHUMA MÚSICA
        // ========================================

        if (
            !distribuicoes ||
            distribuicoes.length === 0
        ) {

            playlist = [];

            nomeMusica.textContent =
                "Nenhuma música disponível";

            artista.textContent =
                "Aguardando músicas";

            if (lista) {

                lista.innerHTML = `
                    <p>
                        Nenhuma música foi distribuída
                        para esta rádio.
                    </p>
                `;

            }

            return;

        }


        // ========================================
        // PEGAR IDs DAS MÚSICAS
        // ========================================

        const idsMusicas =
            distribuicoes.map(
                function (item) {

                    return item.musica_id;

                }
            );


        console.log(
            "IDs das músicas:",
            idsMusicas
        );


        // ========================================
        // BUSCAR BIBLIOTECA
        // ========================================

        const {
            data: musicas,
            error: erroMusicas
        } = await supabaseClient
            .from("biblioteca_musicas")
            .select("*")
            .in(
                "id",
                idsMusicas
            );


        if (erroMusicas) {

            console.log(
                "Erro ao buscar biblioteca:",
                erroMusicas
            );

            nomeMusica.textContent =
                "Erro ao carregar músicas";

            return;

        }


        console.log(
            "Músicas da biblioteca:",
            musicas
        );


        // ========================================
        // MONTAR PLAYLIST
        // ========================================

        playlist = [];


        distribuicoes.forEach(
            function (distribuicao) {

                const musica =
                    musicas.find(
                        function (item) {

                            return (
                                item.id ===
                                distribuicao.musica_id
                            );

                        }
                    );


                if (musica) {

                    playlist.push({

                        id:
                            musica.id,

                        arquivo:
                            musica.caminho,

                        nome:
                            musica.nome,

                        artista:
                            musica.artista ||
                            "Rádio Indoor"

                    });

                }

            }
        );


        console.log(
            "PLAYLIST FINAL:",
            playlist
        );


        // ========================================
        // VERIFICAR PLAYLIST
        // ========================================

        if (!playlist.length) {

            nomeMusica.textContent =
                "Nenhuma música disponível";

            artista.textContent =
                "Aguardando músicas";

            if (lista) {

                lista.innerHTML = `
                    <p>
                        Nenhuma música encontrada.
                    </p>
                `;

            }

            return;

        }


        musicaAtual = 0;


        carregarMusica(
            musicaAtual
        );


        criarPlaylist();

    }

    catch (erro) {

        console.log(
            "Erro inesperado:",
            erro
        );

    }

}


// ============================================
// CARREGAR MÚSICA
// ============================================

function carregarMusica(indice) {

    if (!playlist.length) {

        return;

    }


    musicaAtual =
        indice;


    const musica =
        playlist[musicaAtual];


    // ========================================
    // PEGAR URL PÚBLICA DO STORAGE
    // ========================================

    const {
        data
    } = supabaseClient
        .storage
        .from("musicas")
        .getPublicUrl(
            musica.arquivo
        );


    if (
        !data ||
        !data.publicUrl
    ) {

        console.log(
            "Não foi possível obter a URL:",
            musica.arquivo
        );

        return;

    }


    console.log(
        "Carregando:",
        data.publicUrl
    );


    audio.src =
        data.publicUrl;


    nomeMusica.textContent =
        musica.nome;


    artista.textContent =
        musica.artista;


    audio.load();

}


// ============================================
// CRIAR PLAYLIST NA TELA
// ============================================

function criarPlaylist() {

    if (!lista) {

        return;

    }


    lista.innerHTML =
        "";


    playlist.forEach(
        function (musica, indice) {

            const item =
                document.createElement("div");


            item.classList.add(
                "musica-item"
            );


            if (
                indice ===
                musicaAtual
            ) {

                item.classList.add(
                    "ativa"
                );

            }


            item.innerHTML = `

                <span class="numero">
                    ${indice + 1}
                </span>

                <span class="titulo">
                    ${musica.nome}
                </span>

            `;


            item.addEventListener(
                "click",
                function () {

                    carregarMusica(
                        indice
                    );


                    audio.play()
                        .then(
                            function () {

                                botaoPlay.textContent =
                                    "⏸";

                            }
                        )
                        .catch(
                            function (erro) {

                                console.log(
                                    "Erro ao tocar:",
                                    erro
                                );

                            }
                        );


                    criarPlaylist();

                }
            );


            lista.appendChild(
                item
            );

        }
    );

}


// ============================================
// PLAY / PAUSE
// ============================================

botaoPlay.addEventListener(
    "click",
    function () {

        if (!playlist.length) {

            return;

        }


        if (audio.paused) {

            audio.play()
                .then(
                    function () {

                        botaoPlay.textContent =
                            "⏸";

                    }
                )
                .catch(
                    function (erro) {

                        console.log(
                            "Erro ao tocar:",
                            erro
                        );

                    }
                );

        }

        else {

            audio.pause();

            botaoPlay.textContent =
                "▶️";

        }

    }
);


// ============================================
// PRÓXIMA
// ============================================

botaoProxima.addEventListener(
    "click",
    function () {

        if (!playlist.length) {

            return;

        }


        if (modoAleatorio) {

    let proximaMusica;

    do {

        proximaMusica =
            Math.floor(
                Math.random() *
                playlist.length
            );

    } while (
        playlist.length > 1 &&
        proximaMusica === musicaAtual
    );

    musicaAtual =
        proximaMusica;

} else {

    musicaAtual++;

    if (
        musicaAtual >=
        playlist.length
    ) {

        musicaAtual = 0;

    }

}


        carregarMusica(
            musicaAtual
        );


        criarPlaylist();


        audio.play()
            .then(
                function () {

                    botaoPlay.textContent =
                        "⏸";

                }
            )
            .catch(
                function (erro) {

                    console.log(
                        "Erro ao tocar:",
                        erro
                    );

                }
            );

    }
);


// ============================================
// ANTERIOR
// ============================================

botaoAnterior.addEventListener(
    "click",
    function () {

        if (!playlist.length) {

            return;

        }


        musicaAtual--;


        if (
            musicaAtual < 0
        ) {

            musicaAtual =
                playlist.length - 1;

        }


        carregarMusica(
            musicaAtual
        );


        criarPlaylist();


        audio.play()
            .then(
                function () {

                    botaoPlay.textContent =
                        "⏸";

                }
            )
            .catch(
                function (erro) {

                    console.log(
                        "Erro ao tocar:",
                        erro
                    );

                }
            );

    }
);

// ============================================
// CARREGAR PUBLICIDADES DO CLIENTE
// ============================================

async function carregarPublicidadesDoSupabase() {

    try {

        if (!CLIENTE_ID) {

            console.log(
                "Nenhum cliente identificado para publicidade."
            );

            return;

        }

        console.log(
            "Buscando publicidades do cliente:",
            CLIENTE_ID
        );


        // ========================================
        // BUSCAR DISTRIBUIÇÕES
        // ========================================

        const {
            data: distribuicoes,
            error: erroDistribuicao
        } = await supabaseClient
            .from("radio_publicidades")
            .select(
                "id, cliente_id, publicidade_id, ordem"
            )
            .eq(
                "cliente_id",
                CLIENTE_ID
            )
            .order(
                "ordem",
                {
                    ascending: true
                }
            );


        if (erroDistribuicao) {

            console.error(
                "ERRO AO BUSCAR PUBLICIDADES:",
                erroDistribuicao
            );

            publicidades = [];

            return;

        }


        console.log(
            "Distribuições de publicidade:",
            distribuicoes
        );


        if (
            !distribuicoes ||
            distribuicoes.length === 0
        ) {

            publicidades = [];

            console.log(
                "Nenhuma publicidade distribuída para este cliente."
            );

            return;

        }


        // ========================================
        // PEGAR IDS DAS PUBLICIDADES
        // ========================================

        const idsPublicidades =
            distribuicoes.map(
                function (item) {

                    return item.publicidade_id;

                }
            );


        // ========================================
        // BUSCAR PUBLICIDADES
        // ========================================

        const {
            data: dadosPublicidades,
            error: erroPublicidades
        } = await supabaseClient
            .from("publicidades")
            .select("*")
            .in(
                "id",
                idsPublicidades
            )
            .eq(
                "ativo",
                true
            );


        if (erroPublicidades) {

            console.error(
                "ERRO AO BUSCAR DADOS DAS PUBLICIDADES:",
                erroPublicidades
            );

            publicidades = [];

            return;

        }


        // ========================================
        // MONTAR LISTA FINAL
        // ========================================

        publicidades = [];


        distribuicoes.forEach(
            function (distribuicao) {

                const publicidade =
                    dadosPublicidades.find(
                        function (item) {

                            return (
                                item.id ===
                                distribuicao.publicidade_id
                            );

                        }
                    );


                if (publicidade) {

                    publicidades.push({

                        id:
                            publicidade.id,

                        nome:
                            publicidade.nome,

                        arquivo:
                            publicidade.caminho,

                        ordem:
                            distribuicao.ordem

                    });

                }

            }
        );


        console.log(
            "PUBLICIDADES FINAIS:",
            publicidades
        );

    }

    catch (erro) {

        console.error(
            "ERRO INESPERADO AO CARREGAR PUBLICIDADES:",
            erro
        );

        publicidades = [];

    }

}

// ============================================
// PRÓXIMA AUTOMATICAMENTE
// COM PUBLICIDADE
// ============================================

audio.addEventListener(
    "ended",
    function () {

        // ========================================
        // SE ESTAVA TOCANDO PUBLICIDADE
        // ========================================

        if (tocandoPublicidade) {

            console.log(
                "PUBLICIDADE TERMINOU."
            );

            tocandoPublicidade =
                false;


            // Voltar para a música

            if (!playlist.length) {

                return;

            }


            // ====================================
            // ESCOLHER PRÓXIMA MÚSICA
            // ====================================

            if (modoAleatorio) {

                let proximaMusica;

                do {

                    proximaMusica =
                        Math.floor(
                            Math.random() *
                            playlist.length
                        );

                } while (
                    playlist.length > 1 &&
                    proximaMusica === musicaAtual
                );

                musicaAtual =
                    proximaMusica;

            } else {

                musicaAtual++;

                if (
                    musicaAtual >=
                    playlist.length
                ) {

                    musicaAtual = 0;

                }

            }


            carregarMusica(
                musicaAtual
            );

            criarPlaylist();


            audio.play()
                .then(
                    function () {

                        botaoPlay.textContent =
                            "⏸";

                    }
                )
                .catch(
                    function (erro) {

                        console.log(
                            "Erro ao voltar para música:",
                            erro
                        );

                    }
                );


            return;

        }


        // ========================================
        // MÚSICA TERMINOU
        // ========================================

        console.log(
            "MÚSICA TERMINOU."
        );


       // ========================================
// CONTADOR DE MÚSICAS
// ========================================

contadorMusicasPublicidade++;

console.log(
    "MÚSICAS DESDE A ÚLTIMA PUBLICIDADE:",
    contadorMusicasPublicidade
);


// ========================================
// VERIFICAR SE É HORA DA PUBLICIDADE
// ========================================

if (
    publicidades &&
    publicidades.length > 0 &&
    contadorMusicasPublicidade >=
    quantidadeMusicasAntesPublicidade
) {

    contadorMusicasPublicidade = 0;


    const publicidade =
        publicidades[
            publicidadeAtual
        ];


    publicidadeAtual++;


    if (
        publicidadeAtual >=
        publicidades.length
    ) {

        publicidadeAtual = 0;

    }


    console.log(
        "TOCANDO PUBLICIDADE:",
        publicidade.nome
    );


    // ====================================
    // PEGAR URL DO STORAGE
    // ====================================

    const {
        data
    } = supabaseClient
        .storage
        .from("publicidades")
        .getPublicUrl(
            publicidade.arquivo
        );


    if (
        data &&
        data.publicUrl
    ) {

        tocandoPublicidade =
            true;


        audio.src =
            data.publicUrl;


        nomeMusica.textContent =
            "📢 PUBLICIDADE";


        artista.textContent =
            publicidade.nome;


        if (nomePublicidadeRadio) {

            nomePublicidadeRadio.textContent =
                publicidade.nome;

        }


        if (statusPublicidadeRadio) {

            statusPublicidadeRadio.textContent =
                "▶️ Anúncio em reprodução";

        }


        audio.load();


        audio.play()
            .then(
                function () {

                    botaoPlay.textContent =
                        "⏸";

                }
            )
            .catch(
                function (erro) {

                    console.error(
                        "ERRO AO TOCAR PUBLICIDADE:",
                        erro
                    );

                    tocandoPublicidade =
                        false;

                }
            );


        return;

    }

}


        // ========================================
        // SEM PUBLICIDADE
        // CONTINUA NORMALMENTE
        // ========================================

        if (!playlist.length) {

            return;

        }


        if (modoAleatorio) {

            let proximaMusica;

            do {

                proximaMusica =
                    Math.floor(
                        Math.random() *
                        playlist.length
                    );

            } while (
                playlist.length > 1 &&
                proximaMusica === musicaAtual
            );

            musicaAtual =
                proximaMusica;

        } else {

            musicaAtual++;

            if (
                musicaAtual >=
                playlist.length
            ) {

                musicaAtual = 0;

            }

        }


        carregarMusica(
            musicaAtual
        );


        criarPlaylist();


        audio.play()
            .then(
                function () {

                    botaoPlay.textContent =
                        "⏸";

                }
            )
            .catch(
                function (erro) {

                    console.log(
                        "Erro ao tocar automaticamente:",
                        erro
                    );

                }
            );

    }
);


// ============================================
// VOLUME
// ============================================

if (volume) {

    volume.addEventListener(
        "input",
        function () {

            audio.volume =
                volume.value / 100;

        }
    );


    audio.volume =
        volume.value / 100;

}


// ============================================
// DURAÇÃO
// ============================================

audio.addEventListener(
    "loadedmetadata",
    function () {

        duracao.textContent =
            formatarTempo(
                audio.duration
            );

    }
);


// ============================================
// PROGRESSO
// ============================================

audio.addEventListener(
    "timeupdate",
    function () {

        if (!audio.duration) {

            return;

        }


        const porcentagem =
            (
                audio.currentTime /
                audio.duration
            ) * 100;


        barra.style.width =
            porcentagem + "%";


        tempoAtual.textContent =
            formatarTempo(
                audio.currentTime
            );

    }
);


// ============================================
// CLICAR NA BARRA
// ============================================

progresso.addEventListener(
    "click",
    function (event) {

        if (!audio.duration) {

            return;

        }


        const largura =
            progresso.clientWidth;


        const posicao =
            event.offsetX;


        const porcentagem =
            posicao /
            largura;


        audio.currentTime =
            porcentagem *
            audio.duration;

    }
);


// ============================================
// FORMATAR TEMPO
// ============================================

function formatarTempo(segundos) {

    if (
        isNaN(segundos)
    ) {

        return "0:00";

    }


    const minutos =
        Math.floor(
            segundos / 60
        );


    const segundosRestantes =
        Math.floor(
            segundos % 60
        );


    return (
        minutos +
        ":" +
        String(
            segundosRestantes
        ).padStart(
            2,
            "0"
        )
    );

}


// ============================================
// INICIAR RÁDIO
// ============================================

console.log(
    "Iniciando Rádio Indoor..."
);

console.log(
    "Aguardando login para identificar o cliente."
);

// ============================================
// LOGIN DO CLIENTE NA RÁDIO
// ============================================

const botaoLoginRadio =
    document.getElementById("botaoLoginRadio");

const emailRadio =
    document.getElementById("emailRadio");

const senhaRadio =
    document.getElementById("senhaRadio");

const mensagemLoginRadio =
    document.getElementById("mensagemLoginRadio");


if (botaoLoginRadio) {

    botaoLoginRadio.addEventListener(
        "click",
        async function () {

            console.log(
                "BOTÃO ENTRAR NA RÁDIO CLICADO"
            );


            const emailDigitado =
                emailRadio.value.trim();

            const senhaDigitada =
                senhaRadio.value;


            if (
                !emailDigitado ||
                !senhaDigitada
            ) {

                mensagemLoginRadio.textContent =
                    "Digite o e-mail e a senha.";

                return;

            }


            mensagemLoginRadio.textContent =
                "Entrando na rádio...";


            botaoLoginRadio.disabled =
                true;


            // ========================================
            // FAZER LOGIN NO SUPABASE
            // ========================================

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
                    "ERRO NO LOGIN DA RÁDIO:",
                    error
                );


                mensagemLoginRadio.textContent =
                    "E-mail ou senha incorretos.";

                botaoLoginRadio.disabled =
                    false;

                return;

            }


            console.log(
                "LOGIN DA RÁDIO REALIZADO:",
                data.user
            );


            // ========================================
            // BUSCAR CLIENTE DO USUÁRIO
            // ========================================

            const {
                data: cliente,
                error: erroCliente
            } = await supabaseClient
                .from("clientes")
                .select("*")
                .eq(
                    "user_id",
                    data.user.id
                )
                .single();


            if (
                erroCliente ||
                !cliente
            ) {

                console.log(
                    "ERRO AO ENCONTRAR CLIENTE:",
                    erroCliente
                );


                mensagemLoginRadio.textContent =
                    "Este usuário não possui uma rádio cadastrada.";

                await supabaseClient.auth.signOut();

                botaoLoginRadio.disabled =
                    false;

                return;

            }


            console.log(
                "CLIENTE DA RÁDIO ENCONTRADO:",
                cliente
            );

            // ========================================
// MOSTRAR NOME DO CLIENTE NA RÁDIO
// ========================================

if (nomeClienteRadio) {

    nomeClienteRadio.textContent =
        cliente.nome;

}

console.log(
    "NOME DA RÁDIO:",
    cliente.nome
);


            // ========================================
// DEFINIR CLIENTE ATUAL
// ========================================

CLIENTE_ID =
    cliente.id;

console.log(
    "CLIENTE ID DEFINIDO PELO LOGIN:",
    CLIENTE_ID
);

// ========================================
// CARREGAR CONFIGURAÇÃO DE PUBLICIDADE
// ========================================

await carregarConfiguracaoPublicidade();


            // ========================================
            // VERIFICAR CLIENTE DA URL
            // ========================================

            const parametros =
                new URLSearchParams(
                    window.location.search
                );


            const clienteIdURL =
                Number(
                    parametros.get("cliente")
                );


            console.log(
                "CLIENTE DA URL:",
                clienteIdURL
            );


            console.log(
                "CLIENTE DO USUÁRIO:",
                cliente.id
            );


            if (
                clienteIdURL &&
                cliente.id !== clienteIdURL
            ) {

                console.log(
                    "USUÁRIO NÃO PERTENCE A ESTA RÁDIO."
                );


                mensagemLoginRadio.textContent =
                    "Este usuário não tem acesso a esta rádio.";

                await supabaseClient.auth.signOut();

                botaoLoginRadio.disabled =
                    false;

                return;

            }


            // ========================================
            // LOGIN OK
            // ========================================

            mensagemLoginRadio.textContent =
                "Acesso autorizado!";


            console.log(
                "ACESSO À RÁDIO AUTORIZADO!"
            );

            // ========================================
// MOSTRAR A RÁDIO
// ========================================

const paginaLogin =
    document.getElementById("loginRadio");

const paginaRadio =
    document.getElementById("radioCliente");

if (paginaLogin) {

    paginaLogin.style.display =
        "none";

}

if (paginaRadio) {

    paginaRadio.style.display =
        "block";

}

console.log(
    "PÁGINA DA RÁDIO EXIBIDA!"
);


            // ========================================
// CARREGAR MÚSICAS DO CLIENTE
// ========================================

await carregarMusicasDoSupabase();

            // ========================================
// CARREGAR PUBLICIDADES DO CLIENTE
// ========================================

await carregarPublicidadesDoSupabase();

            botaoLoginRadio.disabled =
                false;


            // ========================================
            // CARREGAR PLAYLIST DO CLIENTE
            // ========================================

            if (
                typeof carregarMusicasCliente ===
                "function"
            ) {

                await carregarMusicasCliente();

            }

        }
    );

}


console.log(
    "LOGIN DA RÁDIO CONFIGURADO."
);
// ============================================
// SAIR DA RÁDIO
// ============================================

const botaoSairRadio =
    document.getElementById("botaoSairRadio");


if (botaoSairRadio) {

    botaoSairRadio.addEventListener(
        "click",
        async function () {

            console.log(
                "BOTÃO SAIR DA RÁDIO CLICADO"
            );


            botaoSairRadio.disabled =
                true;


            // ========================================
            // PARAR MÚSICA
            // ========================================

            if (audio) {

                audio.pause();

                audio.currentTime =
                    0;

                audio.src =
                    "";

            }


            // ========================================
            // ENCERRAR SESSÃO
            // ========================================

            const {
                error
            } = await supabaseClient.auth.signOut();


            if (error) {

                console.log(
                    "ERRO AO SAIR DA RÁDIO:",
                    error
                );

                botaoSairRadio.disabled =
                    false;

                return;

            }


            console.log(
                "SESSÃO ENCERRADA COM SUCESSO"
            );


            // ========================================
            // LIMPAR PLAYLIST
            // ========================================

            playlist =
                [];

            musicaAtual =
                0;


            // ========================================
            // ESCONDER RÁDIO
            // ========================================

            const paginaRadio =
    document.getElementById(
        "radioCliente"
    );

if (paginaRadio) {

    paginaRadio.style.setProperty(
        "display",
        "none",
        "important"
    );

}


// ========================================
// MOSTRAR LOGIN
// ========================================

const paginaLogin =
    document.getElementById(
        "loginRadio"
    );

if (paginaLogin) {

    paginaLogin.removeAttribute(
        "style"
    );

    paginaLogin.style.display =
        "block";

}


            // ========================================
            // LIMPAR CAMPOS
            // ========================================

            if (emailRadio) {

                emailRadio.value =
                    "";

            }


            if (senhaRadio) {

                senhaRadio.value =
                    "";

            }


            if (mensagemLoginRadio) {

                mensagemLoginRadio.textContent =
                    "";

            }


            botaoSairRadio.disabled =
                false;


            console.log(
                "RÁDIO ENCERRADA. LOGIN NOVAMENTE DISPONÍVEL."
            );

        }
    );

}


console.log(
    "BOTÃO SAIR DA RÁDIO CONFIGURADO."
);

