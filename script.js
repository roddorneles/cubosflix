const body = document.querySelector('body');
const btnTheme = document.querySelector('.btn-theme');

const moviesContainer = document.querySelector('.movies');
const input = document.querySelector('.input');
const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');

const highlight__info = document.querySelector('.highlight__info');
const highlight__video = document.querySelector('.highlight__video');
const highlight__title = document.querySelector('.highlight__title');
const highlight__rating = document.querySelector('.highlight__rating');
const highlight__genres = document.querySelector('.highlight__genres');
const highlight__launch = document.querySelector('.highlight__launch');
const highlight__description = document.querySelector('.highlight__description');
const highlight__videoLink = document.querySelector('.highlight__video-link');

const modal = document.querySelector('.modal');
const modal__close = document.querySelector('.modal__close');
const modal__title = document.querySelector('.modal__title');
const modal__img = document.querySelector('.modal__img');
const modal__description = document.querySelector('.modal__description');
const modal__genres = document.querySelector('.modal__genres');
const modal__average = document.querySelector('.modal__average');

let theme = 'light';

let filmesCatalago = [];

let indicePaginaAtual = 0;

function criaMovieDiv() {

    const divMovie = document.createElement('div');
    const divMovieInfo = document.createElement('div');
    const spanMovieTitle = document.createElement('span');
    const spanMovieRating = document.createElement('span');
    const imgEstrela = document.createElement('img');

    divMovie.classList.add('movie')
    divMovieInfo.classList.add('movie__info');
    spanMovieTitle.classList.add('movie__title');
    spanMovieRating.classList.add('movie__rating');
    imgEstrela.src = '/assets/estrela.svg';
    imgEstrela.alt = 'estrela';

    spanMovieRating.append(imgEstrela);
    divMovieInfo.append(spanMovieTitle, spanMovieRating);
    divMovie.append(divMovieInfo);

    return divMovie;
}

function preencherPagina() {
    for (let i = 0; i < 5; i += 1) {
        const divMovie = criaMovieDiv();

        divMovie.addEventListener('click', (event) => {
            abrirModal(i);
        });

        moviesContainer.append(divMovie);
    }

    atualizaPagina();
}

async function abrirModal(indiceFilme) {

    body.classList.add('scroll-hidden');

    const indiceFilmesCatalago = indicePaginaAtual * 5 + indiceFilme;
    const filme = filmesCatalago[indiceFilmesCatalago];
    const filmeId = filme.id;

    const dadosFilme = (await (await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${filmeId}?language=pt-BR`)).json());

    console.log(dadosFilme);

    modal__title.textContent = dadosFilme.title;
    modal__img.setAttribute('src', `${dadosFilme.backdrop_path}`);
    modal__description.textContent = dadosFilme.overview;

    modal__average.textContent = Math.round(dadosFilme.vote_average * 10) / 10;

    modal__genres.textContent = '';
    dadosFilme.genres.forEach((genre) => {
        const spanGenre = document.createElement('span');
        spanGenre.textContent = genre.name;
        spanGenre.classList.add('modal__genre');
        modal__genres.append(spanGenre);
        console.log(spanGenre);
    });

    modal.classList.remove('hidden');

}

function atualizaPagina() {

    const movies = document.querySelectorAll('.movie');

    for (let i = 0; i < 5; i += 1) {
        const divMovie = movies[i];
        const title = divMovie.querySelector('.movie__title');
        const rating = divMovie.querySelector('.movie__rating');

        const filmeDaDiv = filmesCatalago[indicePaginaAtual * 5 + i];

        const imgEstrela = document.createElement('img');
        imgEstrela.src = './assets/estrela.svg';
        imgEstrela.alt = 'estrela';

        rating.textContent = '';
        rating.append(imgEstrela);
        rating.append(Math.round(filmeDaDiv.vote_average * 10) / 10);
        title.textContent = filmeDaDiv.title;
        divMovie.style.backgroundImage = `url(${filmeDaDiv.poster_path})`;
    }

}

async function buscarFilme(nomeFilme) {

    let filmesDaBusca;

    if (nomeFilme === '' || nomeFilme.length === 0) {
        filmesDaBusca = await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');
    }
    else {
        filmesDaBusca = await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${nomeFilme}`);
    }

    const filmesEmJson = await filmesDaBusca.json();

    filmesCatalago = filmesEmJson.results;

    if (filmesCatalago.length === 0) {
        await buscarFilme('');
    }

    let i = 0;
    while (filmesCatalago.length < 20) {
        filmesCatalago.push(filmesCatalago[i]);
        i += 1;
    }

    console.log(filmesCatalago);
}

async function carregaFilmeDoDia() {

    const respostaFilmeDoDia = await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR');
    const filmeDoDia = await respostaFilmeDoDia.json();

    const respostaVideo = await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');
    const videoDoDia = await respostaVideo.json();

    highlight__videoLink.attributes.href.value = `https://www.youtube.com/watch?v=${videoDoDia.results[0].key}`;
    highlight__video.style.backgroundImage = `url(${filmeDoDia.backdrop_path})`;
    highlight__title.textContent = filmeDoDia.title;
    highlight__rating.textContent = Math.round(filmeDoDia.vote_average * 10) / 10;

    for (let i = 0; i < filmeDoDia.genres.length - 1; i += 1) {
        highlight__genres.append(filmeDoDia.genres[i].name.toUpperCase());
        highlight__genres.append(', ');
    }
    highlight__genres.append(filmeDoDia.genres[filmeDoDia.genres.length - 1].name.toUpperCase());

    highlight__launch.textContent = filmeDoDia.release_date;

    highlight__description.textContent = filmeDoDia.overview;

}

btnNext.addEventListener('click', (event) => {
    indicePaginaAtual = (indicePaginaAtual + 1) % 4;
    atualizaPagina();
});

btnPrev.addEventListener('click', (event) => {
    indicePaginaAtual = (indicePaginaAtual - 1 < 0 ? 3 : indicePaginaAtual - 1)
    console.log(indicePaginaAtual);
    atualizaPagina();
});

input.addEventListener('keydown', async (event) => {
    if (event.code === 'Enter') {
        console.log(event.target.value);
        await buscarFilme(event.target.value);
        indicePaginaAtual = 0;
        atualizaPagina();
        event.target.value = '';
    }
});

modal__close.addEventListener('click', (event) => {
    modal.classList.add('hidden');
    body.classList.remove('scroll-hidden');
});

modal.addEventListener('click', (event) => {

    if (event.target.classList.value !== 'modal') {
        return;
    }

    modal.classList.add('hidden');
    body.classList.remove('scroll-hidden');
});

btnTheme.addEventListener('click', (event) => {

    if (theme === 'light') {
        body.style.setProperty('--cor-background', '#242424');
        body.style.setProperty('--cor-texto-highlight', '#ffffff');
        body.style.setProperty('--cor-background-highlight', '#454545');
        highlight__info.classList.remove('box-shadow-preto');
        highlight__info.classList.add('box-shadow-branco');

        btnNext.attributes.src.value = "./assets/seta-direita-branca.svg";
        btnPrev.attributes.src.value = "./assets/seta-esquerda-branca.svg";

        console.log(btnTheme.attributes.src.value);

        btnTheme.attributes.src.value = "./assets/dark-mode.svg";

        theme = 'dark';
    }
    else {
        body.style.setProperty('--cor-background', '#ffffff');
        body.style.setProperty('--cor-texto-highlight', '#000000');
        body.style.setProperty('--cor-background-highlight', '#ffffff');
        highlight__info.classList.add('box-shadow-preto');
        highlight__info.classList.remove('box-shadow-branco');

        btnNext.attributes.src.value = "./assets/seta-direita-preta.svg";
        btnPrev.attributes.src.value = "./assets/seta-esquerda-preta.svg";

        console.log(btnTheme.attributes.src.value);

        btnTheme.attributes.src.value = "./assets/light-mode.svg";

        theme = 'light';
    }

});

buscarFilme('').then((response) => {
    preencherPagina();
    carregaFilmeDoDia();
});