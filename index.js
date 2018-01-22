const library = [
    {
        filename: 'banana.svg',
        title: 'ба–нан',
    },
    {
        filename: 'burger.svg',
        title: 'бур–гер'
    },
    {
        filename: 'cabbage.svg',
        title: 'ка–пус–та'
    },
    {
        filename: 'carrot.svg',
        title: 'мор–ко–вь'
    },
    {
        filename: 'cheese.svg',
        title: 'сыр'
    },
    {
        filename: 'cherry.svg',
        title: 'виш–ня'
    },
    {
        filename: 'cola.svg',
        title: 'ко–ла'
    },
    {
        filename: 'cucumber.svg',
        title: 'о–гу–рец'
    },
    {
        filename: 'fish.svg',
        title: 'ры–ба'
    },
    {
        filename: 'fries.svg',
        title: 'кар–тош–ка'
    },
    {
        filename: 'icecream.svg',
        title: 'мо–ро–же–но–е'
    },
    {
        filename: 'juice.svg',
        title: 'сок'
    },
    {
        filename: 'kiwi.svg',
        title: 'ки–ви'
    },
    {
        filename: 'lemon.svg',
        title: 'ле–мон'
    },
    {
        filename: 'mushroom.svg',
        title: 'гри–б'
    },
    {
        filename: 'onion.svg',
        title: 'лук'
    },
    {
        filename: 'orange.svg',
        title: 'а–пе–ль–син'
    },
    {
        filename: 'pancaces.svg',
        title: 'бли–ны'
    },
    {
        filename: 'pizza.svg',
        title: 'пиц–ца'
    },
    {
        filename: 'pumpkin.svg',
        title: 'тык–ва'
    },
    {
        filename: 'raspberry.svg',
        title: 'ма–ли–на'
    },
    {
        filename: 'salad.svg',
        title: 'са–лат'
    },
    {
        filename: 'tomato.svg',
        title: 'по–ми–дор'
    },
];
console.log(library.length);

const N_PER_SLIDE = 12;
const IMAGE_WIDTH = 120;

const pick_n_random = (all, n) => all.slice().sort(() => 0.5 - Math.random()).slice(0, n);
const pick_random = (all) => all[~~(Math.random() * all.length)];

function generate_n_locations(container_width, container_height, n, size) {
    const locs = [];
    for (let i = 0; i < n; i++) {
        let tries;
        for (tries = 25; tries > 0; tries--) {
            let x = Math.random() * (container_width - size);
            let y = Math.random() * (container_height - size);
            locs[i] = {x, y};

            let intersects = false;
            for (let j = 0; j < i; j++)
                if (Math.abs(locs[j].x - x) <= size && Math.abs(locs[j].y - y) <= size) {
                    intersects = true;
                    break;
                }

            if (! intersects)
                break;
        }
        if (tries == 0)
            console.log('collision :(');
    }
    return locs;
}

function center_locs(container_width, container_height, locs, size) {
    let avg_x = 0, avg_y = 0;
    locs.forEach(loc  => { avg_x += loc.x; avg_y += loc.y; });

    avg_x /= locs.length;
    avg_y /= locs.length;

    const delta_x = (container_width - size) / 2 - avg_x;
    const delta_y = (container_height- size) / 2 - avg_y;

    return locs.map(loc => ({
        x: loc.x + delta_x,
        y: loc.y + delta_y
    }));
}

function run_slide(container) {
    $('#thumb-up').removeClass('visible');

    let items = pick_n_random(library, N_PER_SLIDE);
    let secret_no = ~~(Math.random() * items.length);

    const word_div = container.find('#word');
    const images_div = container.find('#images');

    word_div.text(items[secret_no].title);

    const locs = generate_n_locations(images_div.width(), images_div.height(), items.length, IMAGE_WIDTH*2);

    images_div.find('.image').remove();
    for (let i = 0; i < items.length; i++) {
        let img = $('<img>')
            .attr({
                class: 'image',
                src: `images/${items[i].filename}`,
            })
            .css({
                left: '50%',
                top: '50%'
            })
            .appendTo(images_div);

        setTimeout(function () {
            this.css({
                left: locs[i].x,
                top: locs[i].y
            })
        }.bind(img), 1);

        if (i == secret_no)
            img.click(() => {
                $('#tada').get(0).play();
                $('#thumb-up').addClass('visible');
                setTimeout(() => run_slide(container), 2000);
            });
        else {
            img.click(() => {
                img.addClass('nope');
                setTimeout(function () {this.removeClass('nope')}.bind(img), 600);
            });
        }
    }
}

$(() => {
    run_slide($(document.body));
})
