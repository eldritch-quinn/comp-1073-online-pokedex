const e = {
    status: document.querySelector('header p'),
    btn: document.querySelector('header button'),
    txt: document.querySelector('header input[type="text"]'),
    out: document.querySelector('main > ul'),
    form: document.querySelector('form'),
    lucky: document.querySelector('#lucky')
}

function captialize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function addCard(data) {
    //console.log(data)
    let newItem = document.createElement('li');
    let pokeCardHTML = `<section>
        <h3>${captialize(data.species.name)}</h3>
        <p><small>Types: </small></p>
        <ul>
            ${data.types.map((i) => {
                return `<li><p>${captialize(i.type.name)}</p></li>`
            }).join('')}
        </ul>
    </section>
    <div>
        <img src="${data.sprites.front_default}" alt="${data.species.name}" />
    </div><p>${data.flavor}</p>`;
        
    newItem.innerHTML = pokeCardHTML;

    newItem.classList.add('pokemon');

    e.out.prepend(newItem);
}

async function get(url) {
    return fetch(url, {
        method: 'get',
        mode: 'cors'
    }).then((response) => {
        return response.json();
    }).catch(err => {
        e.status.textContent = `Cannot find the pokemon: ${e.txt.value}`;
    });
}

async function pokeQuery(pkmn) {
    let data = await get(`https://pokeapi.co/api/v2/pokemon/${pkmn}`);

    // make a seperate get request that gets the species' flavor text entry object
    // then filters it to find the one that is english.
    let specificData = (
        await get(data.species.url)
    )
    .flavor_text_entries
    .filter((entry) => {
        return entry.language.name == 'en';
    });

    // get the first english entry, and remove any whitespace
    data.flavor = specificData[0].flavor_text.replace('', '');;

    addCard(data)
}

e.form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    await pokeQuery(e.txt.value.toLowerCase());
})

e.lucky.addEventListener('click', async () => {
    await pokeQuery(Math.floor(Math.random() * 1025));
})

pokeQuery('ditto');
for (let i = 0; i < 11; i++) {
    pokeQuery(Math.floor(Math.random() * 1025));
}
