document.addEventListener("DOMContentLoaded", () => {

    /*VARIABLES*/
    const divTags = document.querySelector("#tags");
    const divFotos = document.querySelector("#fotos");
    const divImgGrande = document.querySelector('#imgGrande div');
    const pImgGrande = document.querySelector('#imgGrande p');
    const pMensaje = document.querySelector('#cantidadFotos');

    const arrayImagenes = [
        { url: 'viajes-1.jpg', titulo: 'Destino 1', alt: 'Imagen 1', tags: ['Mar', 'Agua', 'Personas', 'Cielo Despejado'] },
        { url: 'viajes-2.jpg', titulo: 'Destino 2', alt: 'Imagen 2', tags: ['Mar', 'Cabañas', 'Agua', 'Nubes'] },
        { url: 'viajes-3.jpg', titulo: 'Destino 3', alt: 'Imagen 3', tags: ['Nubes', 'Destinos'] },
        { url: 'viajes-4.jpg', titulo: 'Destino 4', alt: 'Imagen 4', tags: ['Agua', 'Cielo Despejado', 'Ciudad', 'Personas'] },
        { url: 'viajes-5.jpg', titulo: 'Destino 5', alt: 'Imagen 5', tags: ['Agua', 'Cielo Despejado', 'Farolas', 'Ciudad'] },
        { url: 'viajes-6.jpg', titulo: 'Destino 6', alt: 'Imagen 6', tags: ['Agua', 'Nubes', 'Montañas', 'Farolas'] },
        { url: 'viajes-7.jpg', titulo: 'Destino 7', alt: 'Imagen 7', tags: ['Cielo Despejado', 'Montañas', 'Ciudad',] }
    ];
    urlBase = '../viajes/';


    /*EVENTOS*/
    divTags.addEventListener('click', ({ target }) => {
        if (target.matches('BUTTON')) {
            mostrarImagenes(target.textContent);
        }
    })

    divFotos.addEventListener('click', ({ target }) => {
        cambiarImgGrande(target);
    })


    /*FUNCIONES*/

    /*Crea el array con las palabras claves*/
    const buscarTags = async () => {
        const arrayTags = [];
        arrayImagenes.forEach(({ tags }) => {
            tags.forEach(tag => {
                if (!arrayTags.includes(tag)) arrayTags.push(tag);
            })
        })
        return arrayTags;
    }


    /*Crea los botones*/
    const crearBotones = tags => {
        const fragment = document.createDocumentFragment();

        /*Crea botón COSA*/
        const btnCosa = document.createElement("BUTTON");
        btnCosa.textContent = "Aviones";
        fragment.append(btnCosa);

        /*Crea los botones 'reales'*/
        tags.forEach(tag => {
            const btnTag = document.createElement("BUTTON");
            btnTag.textContent = tag;
            fragment.append(btnTag);
        })

        /*Crea otro botón COSA*/
        const btnCosa2 = document.createElement("BUTTON");
        btnCosa2.textContent = "Tanques";
        fragment.append(btnCosa2);

        divTags.append(fragment);
    }


    /*Busca las imagenes que tienen un tag concrecto*/
    const buscarImgTags = async (tag) => {
        const arrayImgs = [];
        arrayImagenes.forEach(img => {
            if (img.tags.includes(tag)) {
                arrayImgs.push(img);
            }
        })
        return arrayImgs;
    }


    /*Crea la imagen grande*/
    const crearImgGrande = async (imagenes, tag) => {
        if (imagenes.length == 0) {
            divImgGrande.innerHTML = '';
            pMensaje.textContent = '';
            const error = new Error(`Lamentablemente, no se encontró ninguna imagen que coincida con '<span>${tag}</span>'`);
            error.name = 'custom';
            throw error;
        } else {
            pImgGrande.innerHTML = '';
        }

        const nroRnd = Math.floor(Math.random() * imagenes.length);

        const imgGrande = document.createElement("IMG");
        imgGrande.src = urlBase + imagenes[nroRnd].url;
        imgGrande.title = imagenes[nroRnd].titulo;
        imgGrande.alt = imagenes[nroRnd].alt;
        imgGrande.classList.add('magicImgGrande');

        divImgGrande.innerHTML = '';
        divImgGrande.append(imgGrande);

        imagenes.splice(nroRnd, 1)
        return imagenes;
    }


    /*Crea el resto de imagenes*/
    const crearImagenes = imagenes => {
        const fragment = document.createDocumentFragment();
        divFotos.innerHTML = '';

        imagenes.forEach(img => {
            const imgTag = document.createElement("IMG");
            imgTag.src = urlBase + img.url;
            imgTag.title = img.titulo;
            imgTag.alt = img.alt;
            imgTag.classList.add("magic");

            fragment.append(imgTag);
        })
        divFotos.append(fragment);
    }


    /*Intercambia la imagen grande por la relacionada que se ha clickado*/
    const cambiarImgGrande = imagen => {
        const imgGrande = document.querySelector('#imgGrande img');
        const imgGrandeSrc = imgGrande.src;

        imgGrande.src = imagen.src;
        imagen.src = imgGrandeSrc;
    }


    /*Muestra las imagenes que tienen un tag concreto*/
    const mostrarImagenes = async (tag) => {
        try {

            pImgGrande.innerHTML = '';

            const arrayImgs = await buscarImgTags(tag);
            const arrayImgsMenos1 = await crearImgGrande(arrayImgs, tag);
            crearImagenes(arrayImgsMenos1);

            if (arrayImgsMenos1.length > 1) {
                pMensaje.innerHTML = `Se encontraron ${arrayImgs.length} imágenes relacionadas con '<span>${tag}</span>'.`
            } else if (arrayImgsMenos1.length == 1) {
                pMensaje.innerHTML = `Se encontró sólo 1 imagen relacionada con '<span>${tag}</span>'.`
            } else {
                pMensaje.innerHTML = `Lamentablemente, no se encontró ninguna imagen relacionada que coincida con '<span>${tag}</span>'.`
            }

        } catch (error) {
            if (error.name == 'custom') {
                divFotos.innerHTML = '';
                pImgGrande.innerHTML = error.message;
            } else {
                alert('ERROR buscarImgTag: ' + error.message);
            }
        }
    }


    /*Comienza aquí*/
    const init = async () => {
        try {

            const arrayTags = await buscarTags();
            crearBotones(arrayTags);

        } catch (error) {
            alert('ERROR INIT: ' + error);
        }
    };

    init();

}) //Load