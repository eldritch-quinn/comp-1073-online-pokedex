const e = {
  status: document.querySelector("header p"),
  btn: document.querySelector("header button"),
  txt: document.querySelector('header input[type="text"]'),
  out: document.querySelector("main > ul"),
  form: document.querySelector("form"),
  lucky: document.querySelector("#lucky"),
};

function captialize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function addCard(data) {
  //console.log(data)
  let newItem = document.createElement("li");
  let pokeCardHTML = `
  <article class="max-w-60 p-4 border rounded-lg bg-white shadow-xl relative bottom-0 group-hover:bottom-1 transition-all">
    <section class="flex justify-between">
      <div class="p-1">
        <h2 class="text-xl font-semibold pb-1">${captialize(data.species.name)}</h2>
        <ul class="flex gap-1">
          ${data.types
            .map((i) => {
              return `<li class="text-xs text-white px-1 py-1 bg-gray-700 rounded-md">${captialize(i.type.name)}</li>`;
            })
            .join("")}
        </ul>
      </div>
      <div>
          <img class="relative left-0 bottom-0 group-hover:left-1 group-hover:bottom-1 transition-all" src="${data.sprites.front_default}" alt="${data.species.name}" />
      </div>
    </section>
    <p>${data.flavor}</p>
    </article>`;

  newItem.classList = 'group peer flex justify-center'

  newItem.innerHTML = pokeCardHTML;

  newItem.classList.add("pokemon");

  e.out.prepend(newItem);
}

async function get(url) {
  return fetch(url, {
    method: "get",
    mode: "cors",
  })
  .then((response) => {
    return response.json();
  })
  .catch((err) => {
    e.status.textContent = `Cannot find the pokemon: ${e.txt.value}`;
  });
}

async function pokeQuery(pkmn) {
  let data = await get(`https://pokeapi.co/api/v2/pokemon/${pkmn}`);

  // make a seperate get request that gets the species' flavor text entry object
  // then filters it to find the one that is english.
  let specificData = (await get(data.species.url)).flavor_text_entries.filter(
    (entry) => {
      return entry.language.name == "en";
    }
  );

  // get the first english entry, and remove any whitespace
  data.flavor = specificData[0].flavor_text.replace("", " ");

  addCard(data);
}

e.form.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  await pokeQuery(e.txt.value.toLowerCase());
});

e.lucky.addEventListener("click", async () => {
  await pokeQuery(Math.floor(Math.random() * 1025));
});

pokeQuery("ditto");
for (let i = 0; i < 11; i++) {
  pokeQuery(Math.floor(Math.random() * 1025));
}/**/
