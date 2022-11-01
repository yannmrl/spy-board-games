const players = [];
const roles = [];
const words = [];
const p_words = [];
const events_v = [0, 0, 0, 0];
const mots_u = [];
playing = false;
amnes = 0;
vwed = 0;
re = 0;
c = 0;
u = 0;
w = 0;
isPrank = false;
hasCon = true;
_events = false;
ev = -1;
wholeList = [];

function checkhttps() {
    if (window.location.href.slice(0,5) == "http:") {
        window.location.href = window.location.href.replace("http:", "https:");
    }
    data = window.location.href;
    if (localStorage['pl']) {
        pl = localStorage['pl'].split('&&');
        for (var i = 0; i < pl.length; i++) {
            players[i] = decodeURI(pl[i]);
        }
    }
    c = Math.round(players.length*0.75);
    u = players.length-c;
    if (u > 1) {u--; w = 1;} else {w = 0;}
    document.getElementById('civils').innerHTML = "Civils : "+c;
    document.getElementById('undernou').innerHTML = "Undernou : "+u;
    document.getElementById('white').innerHTML = "Mr. White : "+w;
    if (players.length) {
        document.getElementById('start').style.backgroundColor = "#F675A8";
    }
}

function plus(p) {
    if (p == 'c') {
        document.getElementById('civils').innerHTML = "Civils : "+(parseInt(document.getElementById('civils').innerHTML.split(" : ")[1])+1);
        c = parseInt(document.getElementById('civils').innerHTML.split(" : ")[1]);
    } else if (p == 'u') {
        document.getElementById('undernou').innerHTML = "Undernou : "+(parseInt(document.getElementById('undernou').innerHTML.split(" : ")[1])+1);
        u = parseInt(document.getElementById('undernou').innerHTML.split(" : ")[1]);
    } else if (p == 'w') {
        document.getElementById('white').innerHTML = "Mr. White : "+(parseInt(document.getElementById('white').innerHTML.split(" : ")[1])+1);
        w = parseInt(document.getElementById('white').innerHTML.split(" : ")[1]);
    }
    tot = parseInt(document.getElementById('civils').innerHTML.split(' : ')[1]) + parseInt(document.getElementById('undernou').innerHTML.split(' : ')[1]) + parseInt(document.getElementById('white').innerHTML.split(' : ')[1]);
    if (tot) {
        document.getElementById('start').style.backgroundColor = "#F675A8";
    }
}

function moins(p) {
    if (p == 'c') {
        newn = parseInt(document.getElementById('civils').innerHTML.split(" : ")[1]) - 1;
        if (newn >= 0) {
            document.getElementById('civils').innerHTML = "Civils : "+newn;
        }
    } else if (p == 'u') {
        newn = parseInt(document.getElementById('undernou').innerHTML.split(" : ")[1]) - 1;
        if (newn >= 0) {
            document.getElementById('undernou').innerHTML = "Undernou : "+newn;
        }
    } else if (p == 'w') {
        newn = parseInt(document.getElementById('white').innerHTML.split(" : ")[1]) - 1;
        if (newn >= 0) {
            document.getElementById('white').innerHTML = "Mr. White : "+newn;
        }
    }
    tot = parseInt(document.getElementById('civils').innerHTML.split(' : ')[1]) + parseInt(document.getElementById('undernou').innerHTML.split(' : ')[1]) + parseInt(document.getElementById('white').innerHTML.split(' : ')[1]);
    if (!tot) {
        document.getElementById('start').style.backgroundColor = "#FAB5D0";
    }
}

function start(first) {
    ev = -1;
    tot = 1;
    if (first) {
        c = parseInt(document.getElementById('civils').innerHTML.split(' : ')[1]);
        u = parseInt(document.getElementById('undernou').innerHTML.split(' : ')[1]);
        w = parseInt(document.getElementById('white').innerHTML.split(' : ')[1]);
        tot = c+u+w;
        console.log('check : tot = '+tot+" & p.len = "+players.length);
        if (players.length) {
            if (players.length == tot) {
                first = false;
                re = 1;
            } else {
                while (players.length) {
                    players.pop();
                }
                re = 0;
            }
        }
    } else {
        re = 1;
    }
    if (tot) {
        $('body').empty();
        $('body').append(`
            <div id="pop" class="pop"></div>
        `);
        if (_events) {
            l = [];
            for (var i = 0; i < events_v.length; i++) {
                for (var j = 0; j < events_v[i]; j++) {
                    l.push(i);
                }
            }
            el = (10 - events_v[0]) + (10 - events_v[1]) + (10 - events_v[2]) + (10 - events_v[3])
            for (var i = 0; i < el; i++) {
                l.push(-1);
            }
            ev = l[randomIntFromInterval(0,l.length-1)];
            console.log('event '+ev+' activated');
            if (ev == 1 || ev == 0) {
                var httpRequest = getHttpRequest();
                httpRequest.open('GET', 'https://yann.wysigot.com/spy/undernou/utils.php?rand='+u, true);
                httpRequest.send();
                httpRequest.onreadystatechange = function () {
                    if (httpRequest.readyState === 4) {
                        if (httpRequest.status === 200) {
                            rep = httpRequest.responseText;
                            rep = rep.split('&&');
                            for (var i = 0; i < rep.length-1; i++) {
                                rep[i] = rep[i].split('||//');
                                while (rep[i].indexOf('') != -1) {
                                    rep[i].splice(rep.indexOf(''), 1);
                                }
                                mots_u[i] = rep[i][Math.floor(Math.random()*rep[i].length)];
                                console.log('mot ui :'+rep[i][Math.floor(Math.random()*rep[i].length)]);
                            }
                        }
                    }
                }
                start_2(tot);
            } else {start_2(tot);}
        } else {start_2(tot);}
    }
}

function start_2(tot) {
    if (tot) {
        roles_tmp = [];
        if (ev == 2) {
            for (var i = 0; i < c+u+w-1; i++) {
                roles_tmp.push("white");
            }
            roles_tmp.push("civil");
        } else if (ev == 3) {
            for (var i = 0; i < c+u+w-1; i++) {
                roles_tmp.push("civil");
            }
            roles_tmp.push("solitaire");
        } else {
            for (var i = 0; i < c; i++) {
                roles_tmp.push("civil");
            }
            for (var i = 0; i < u; i++) {
                roles_tmp.push("undernou");
            }
            for (var i = 0; i < w; i++) {
                roles_tmp.push("white");
            }
        }
        roles_tmp = shuffle(roles_tmp);
        for (var i = 0; i < roles_tmp.length; i++) {
            roles[i] = roles_tmp[i];
        }
        civils = 0;
        infiltres = 0;
        for (role of roles) {
            if (role == "civil") {
                civils++;
            } else if (role == "undernou" || role == "white") {
                infiltres++;
            }
        }
        if (civils < infiltres || infiltres == 0) {
            isPrank = true;
        }
        console.log(roles);
        var httpRequest = getHttpRequest();
        httpRequest.open('GET', 'https://yann.wysigot.com/spy/undernou/utils.php?rand=1', true);
        httpRequest.send();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    rep = httpRequest.responseText.replace('&&', '');
                    rep = rep.split('||//');
                    while (rep.indexOf('') != -1) {
                        rep.splice(rep.indexOf(''), 1);
                    }
                    console.log(rep);
                    wholeList = rep;
                    words[0] = rep[Math.floor(Math.random()*rep.length)];
                    rep.splice(rep.indexOf(words[0]),1);
                    words[1] = rep[Math.floor(Math.random()*rep.length)];
                    console.log(words[0]+'   '+words[1]);
                    displayNameCard(1);
                }
            }
        }
    }
}

/*
<div id="pop" class="pop">
                <input type="text" id="jInput" class="pseudoInput" placeholder="Entre ton pseudo" autocomplete="off">
                <label class="okButton" onclick="ok(`+j+`)">Voir le mot</label>
            </div>
            */

function displayNameCard(j) {
    if (j < roles.length+1) {
        $('body').empty();
        if (!re) {
            app = `
                <div id="pop" class="pop">
                    <form onsubmit="return false;" style="display: flex; flex-direction: column; align-items: center;">
                        <input type="text" id="jInput" class="pseudoInput" placeholder="Entre ton pseudo" autocomplete="off" style="height: 45%;">
                        <input type="submit" class="okButton neonText" onclick="ok(`+j+`)" value="Voir le mot" style="border: 0; width: min-content; font-size: 100%;">
                    </form>
                </div>
            `;
        } else {
            app = `<div id="pop" class="pop">
                <label class="lbl_pseudo">`+players[j-1]+`</label>
                <label class="okButton" onclick="ok(`+j+`)">Voir le mot</label>
            </div>`;
        }
        $('body').append(app);
    } else {
        playing = true;
        pl = '';
        for (var i = 0; i < players.length; i++) {
            pl += '<label class="lbl_player" onclick="kill(this)" id="'+i+'">'+players[i]+'</label>';
        }
        rand = randomIntFromInterval(0,players.length-1);
        if (roles.includes('civil') || roles.includes('undernou')) {
            while (roles[rand] == "white") {
                rand = randomIntFromInterval(0,players.length-1);
            }
        }
        fPlayer = players[rand];
        $('body').empty();
        $('body').append(`
            <label onclick="displayMain()" class="backArrow neonText">&larr;</label>
            <div class="outer" id="outer">
                <div class="players">`+pl+`</div>
                <label id="log" class="neonText">`+fPlayer+` commence</label>
                <div class="options">
                    <label onclick="newP()" style="margin-right: 5%">&#128257;</label>
                    <label onclick="forgot()">&#129318;</label>
                </div>
            </div>
        `);
    }
}

function ok(j) {
    try {
        jI = document.getElementById('jInput').value;
    } catch {
        jI = '//||';
    }
    if (jI && !players.includes(jI)) {
        try {players[players.length] = document.getElementById("jInput").value.trim();} catch {}
        $('#pop').empty();
        if (roles[j-1] == 'civil') {
            if (ev == 1) {
                word = wholeList[randomIntFromInterval(0,wholeList.length-1)];
            } else {
                word = words[0];
            }
            p_words[j-1] = word;
            pop = `
                <label style="text-align: center; padding: 5%;">`+players[j-1]+`, ton mot est `+word+`</label>
                <label class="okButton neonText" onclick="displayNameCard(`+(j+1)+`)">Ok</label>
            `;
            $('#pop').append(pop);
        } else if (roles[j-1] == 'undernou') {
            if (ev == 1 || ev == 0) {
                p_words[j-1] = mots_u[mots_u.length-1];
                mots_u.pop();
                pop = `
                    <label style="text-align: center; padding: 5%;">`+players[j-1]+`, ton mot est `+p_words[j-1]+`</label>
                    <label class="okButton neonText" onclick="displayNameCard(`+(j+1)+`)">Ok</label>
                `;
                $('#pop').append(pop);
            } else {
                p_words[j-1] = words[1];
                pop = `
                    <label style="text-align: center; padding: 5%;">`+players[j-1]+`, ton mot est `+words[1]+`</label>
                    <label class="okButton neonText" onclick="displayNameCard(`+(j+1)+`)">Ok</label>
                `;
                $('#pop').append(pop);
            }
        } else if (roles[j-1] == 'white') {
            p_words[j-1] = "Mr. White";
            pop = `
                <label style="text-align: center; padding: 5%;">`+players[j-1]+`, tu es Mr. White, tu n'as pas de mot secret</label>
                <label class="okButton neonText" onclick="displayNameCard(`+(j+1)+`)">Ok</label>
            `;
            $('#pop').append(pop);
        } else {
            p_words[j-1] = "Solitaire";
            pop = `
                <label style="text-align: center; padding: 5%;">`+players[j-1]+`, tu es un civil solitaire, tu dois &eacute;liminer tout le monde. Ton mot est `+words[0]+`</label>
                <label class="okButton neonText" onclick="displayNameCard(`+(j+1)+`)">Ok</label>
            `;
            $('#pop').append(pop);
        }
    } else {
        document.getElementById('jInput').style.border = "5px solid #F675A8";
    }
}

function kill(him) {
    if (playing) {
        if (!amnes) {
            him.style = "text-decoration: line-through;";
            if (roles[him.id] == "undernou") {
                him.style.backgroundColor = "black";
                him.style.color = "white";
                document.getElementById('log').innerHTML = him.innerHTML+' &eacute;tait un undernou';
            } else if (roles[him.id] == "white") {
                him.style.backgroundColor = "white";
                document.getElementById('log').innerHTML = him.innerHTML+' &eacute;tait Mr. White';
                $('body').append(`
                    <div class="pop" style="position: absolute; height: 60%;">
                        <label style="
                            font-size: 80%;
                            padding: 10%;
                            text-align: center;
                        ">Mr. White peut essayer de deviner le mot</label>
                        <form onsubmit="return false;">
                            <input type="text" class="pseudoInput" placeholder="Entre le mot" style="margin-top: 10%; height: 45%;">
                            <input type="submit" onclick="white_try(this.parentElement);" style="display: none;">
                        </form>
                    </div>
                `);
            } else if (roles[him.id] == "solitaire") {
                him.style.backgroundColor = "#34B4A2";
                him.style.color = "white";
                document.getElementById('log').innerHTML = him.innerHTML+' &eacute;tait le civil solitaire, les civils ont gagn&eacute;';
                $('#outer').append('<label class="start flicker" onclick="newP()" style="background-color: #F675A8">Nouvelle partie</label>');
                $('.options').remove();
                end = 1;
            } else {
                document.getElementById('log').innerHTML = him.innerHTML+' &eacute;tait un civil';
            }
            roles[him.id] = "/";
            if (!isPrank && ev != 3) {
                civils = 0;
                infiltres = 0;
                for (role of roles) {
                    if (role == "civil") {
                        civils++;
                    } else if (role == "undernou" || role == "white") {
                        infiltres++;
                    }
                }
                end = 0;
                if ((infiltres > civils) || (infiltres == 1 && civils == 1)) {
                    document.getElementById('log').innerHTML = "Les infiltr&eacute;s ont gagn&eacute;";
                    $('#outer').append('<label class="start flicker" onclick="newP()" style="background-color: #F675A8">Nouvelle partie</label>');
                    $('.options').remove();
                    end = 1;
                } else if (infiltres == 0) {
                    document.getElementById('log').innerHTML = "Les civils ont gagn&eacute;";
                    $('#outer').append('<label class="start flicker" onclick="newP()" style="background-color: #F675A8">Nouvelle partie</label>');
                    $('.options').remove();
                    end = 1;
                }
                if (end) {
                    reveal();
                }
            } else if (ev == 3) {
                _pl = 0;
                _no = false;
                for (role of roles) {
                    if (role != '/') {
                        _pl++;
                    }
                    if (role == "solitaire") {
                        _no = true;;
                    }
                }
                if (_pl == 2 && _no) {
                    document.getElementById('log').innerHTML = "Le civil solitaire a gagn&eacute;";
                    him.style.backgroundColor = "#7D20B6";
                    him.style.color = "white";
                    $('#outer').append('<label class="start flicker" onclick="newP()" style="background-color: #F675A8">Nouvelle partie</label>');
                    $('.options').remove();
                    end = 1;                   
                }
            }
        } else {
            if (amnes == 1) {
                vwed = him.id;
                if (!him.style.textDecoration) {
                    amnes = 2;
                    him.innerHTML = p_words[him.id];
                    for (elem of document.getElementsByClassName('lbl_player')) {
                        if (elem != him) {
                            if (!elem.style.textDecoration) {
                                elem.style = '';
                            }
                        }
                    }
                }
            } else {
                him = document.getElementById(vwed);
                him.innerHTML = players[him.id];
                amnes = 0;
                for (elem of document.getElementsByClassName('lbl_player')) {if (!elem.style.textDecoration) {elem.style = "";}}
            }
        }
    }
}

function white_try(elem) {
    guess = elem.children[0].value.toLowerCase();
    match = words[0].toLowerCase();
    if (leven(guess, match) < 3) {
        document.getElementById('log').innerHTML = "Mr. White a gagn&eacute;";
        reveal();
    }
    $(document.getElementsByClassName('pop')[0]).remove();
}

function newP() {
    re = 1;
    start(0);
}

function forgot() {
    if (!amnes) {
        for (elem of document.getElementsByClassName('lbl_player')) {if (!elem.style.textDecoration) {elem.style = "background-color: purple; color: white;"}}
        amnes = 1;
    }
}

function reveal() {
    playing = false;
    for (lbl of document.getElementsByClassName('lbl_player')) {
        if (!lbl.style.textDecoration) {
            if (roles[players.indexOf(lbl.innerHTML)] == "undernou") {
                lbl.style = "background-color: black; color: white;";
            } else if (roles[players.indexOf(lbl.innerHTML)] == "white") {
                lbl.style = "background-color: white;";
            }
        }
    }
}

function addW() {
    $('#container').empty();
    $('#container').append(`
        <label onclick="displayMain()" class="backArrow neonText">&larr;</label>
        <label class="addM">Ajouter des mots</label>
        <input type="text" class="addWInput" autocomplete="off">
        <input type="text" class="addWInput" autocomplete="off">
        <input type="text" class="addWInput" autocomplete="off">
        <input type="text" class="addWInput" autocomplete="off">
        <input type="text" class="addWInput" autocomplete="off">
        <input type="submit" onclick="addWord()"class="addW" value="Ajouter" style="margin-top: 0; background-color: #FFCCB3">
        <label class="addC">Au d&eacute;but de la partie, 2 mots seront s&eacute;lectionn&eacute;s au hasard parmis cette liste</label>
    `);
}

function addWord() {
    var httpRequest1 = getHttpRequest();
    httpRequest1.open('GET', 'https://yann.wysigot.com/spy/undernou/utils.php?ping=o', true);
    httpRequest1.send();
    httpRequest1.onreadystatechange = function () {
        if (httpRequest1.readyState === 4) {
            if (httpRequest1.status === 200) {
                wx = ['//'];
                checked = true;
                for (input of document.getElementsByClassName('addWInput')) {
                    v = $.trim(input.value.toLowerCase());
                    v = v.charAt(0).toUpperCase() + v.slice(1);
                    if (/[^a-z]'/i.test(v)) {checked = false; input.style.border = "3px solid red";} else {input.style.border = "";}
                    v = v.replace("'", "\'");
                    wx.push(v);
                }
                if (checked) {
                    for (input of document.getElementsByClassName('addWInput')) {input.value = '';}
                    var httpRequest2 = getHttpRequest();
                    httpRequest2.open('GET', 'https://yann.wysigot.com/spy/undernou/utils.php?add=true&w1='+wx[1]+'&w2='+wx[2]+'&w3='+wx[3]+'&w4='+wx[4]+'&w5='+wx[5], true);
                    httpRequest2.send();
                }
            }
        }
    }
}

function displayMain() {
    p = '';
    if (c+u+w) {
        p = "style = 'background-color: #F675A8'";
    }
    $('body').empty();
    $('body').append(`
    <div class="container" id="container">
        <label onclick="backToMain()" class="backArrow neonText">&larr;</label>
        <label onclick="displayMainInfo()" class="info neonText">i</label>
        <div class="line">
            <label class="role n neonText" onclick="moins('c')">-</label>
            <div class="role" style="
                background-color: #554994;
                color: white;
            ">
                <label id="civils">Civils : ${c}</label>
            </div>
            <label class="role n neonText" onclick="plus('c')">+</label>
        </div>
        <div class="line">
            <label class="role n neonText" onclick="moins('u')">-</label>
            <div class="role" style="
                color: white;
                background-color: black;
            ">
                <label id="undernou">Undernou : ${u}</label>
            </div>
            <label class="role n neonText" onclick="plus('u')">+</label>
        </div>
        <div class="line">
            <label class="role n neonText" onclick="moins('w')">-</label>
            <div class="role" style="
                border: 1px solid black;
            ">
                <label id="white">Mr. White : ${w}</label>
            </div>
            <label class="role n neonText" onclick="plus('w')">+</label>
        </div>
        <label class="start" id="start" onclick="start(1)"${p}>Lancer la partie</label>
        <label class="addW neonText" onclick="events()" style="background-color: #F29393;">&Eacute;v&egrave;nements al&eacute;atoires</label>
        <label class="addW neonText" onclick="addW()">Ajouter des mots</label>
    </div>

    `);
}

function displayMainInfo() {
    $('body').empty();
    $('body').append(`
        <label onclick="displayMain()" class="backArrow neonText">&larr;</label>
        <div id="pop" class="pop" style="padding: 5%; overflow-y: scroll;">
            <label style="margin-bottom: 3%; font-weight: bolder;">Undernou</label>
            <label class="desc">Les r&egrave;gles sont les m&ecirc;mes que celles du undercover. Les seuls diff&eacuterences sont :</label>
            <label class="desc"> - Les undercovers sont appel&eacute;s undernous</label>
            <label class="desc"> - L'utilisateur a plein contr&ocirc;le de la composition de la partie</label>
            <label class="desc"> - Les mots utilis&eacute;s ne sont pas par paire mais par groupe de 4 ou 5. Par exemple, quand le mot des civils est "Fraise", le mot de l'undernou ne sera pas forc&eacute;ment "Cerise", mais peut-&ecirc;tre "M&ucirc;re" ou "Groseille", ce qui ajoute une difficult&eacute; au jeu.</label>
            <label class="desc"> - Le jeu est gratuit et un grand nombre de groupes de mots vont &ecirc;tre ajout&eacute;s</label>
            <label class="desc"> - Il y a des &eacute;v&egrave;nements a&eacute;atoires, que l'on peut activer ou non avec un certain % de chances de se r&eacute;aliser. Ils pimentent la partie en changeant la composition des joueurs, ajoutant un r&ocirc;le, brouillant encore plus les pistes que d'habitude et les joueurs ne sont pas notifi&eacute;s lors de l'activation d'un &eacute;v&egrave;nement au d&eacute;but de la partie, ils s'en rendent compte &agrave, la fin apr&egrave;s un bon quart d'heure d'incompr&eacute;hension</label>
        </div>
    `);

}

function displayEventsInfo() {
    $('body').empty();
    $('body').append(`
        <label onclick="events(true)" class="backArrow neonText">&larr;</label>
        <div id="pop" class="pop" style="padding: 5%;">
            <label>Infiltr&eacute; pitoyable</label>
            <label class="desc">Le ou les undernou.s ont un mot provenant d'une autre liste (diff&egrave;re d'un undernou &agrave; l'autre)</label>
            <label>Confusion g&eacute;n&eacute;rale</label>
            <label class="desc">Tous les civils ont des mots diff&eacute;rents provenants d'une m&ecirc;me liste et le ou les undernou.s ont un mot provenant d'une autre liste (diff&egrave;re d'un undernou &agrave; l'autre)</label>
            <label>Tout blanc</label>
            <label class="desc">Un seul civil. Les autres sont des Mr. White</label>
            <label>Solitaire</label>
            <label class="desc">Il n'y a que des civils et un solitaire qui doit &eacute;liminer tout le monde (gagne quand il ne reste plus que lui et un civil)</label>
        </div>
    `);
}

function events(fromInfo) {
    if (fromInfo) {
        $('body').empty();
        $('body').append('<div class="container" id="container"></div>');
    }
    if (_events) {
        style = "background-color: #78DDA1; justify-content: flex-end;"
    } else {
        style = "background-color: #B2E0C5; justify-content: flex-start;"
    }
    $('#container').empty();
    $('#container').append(`
        <label onclick="displayMain()" class="backArrow neonText">&larr;</label>
        <label onclick="displayEventsInfo()" class="info neonText">i</label>
        <label class="addM" style="margin-bottom: 5%; text-align: center;">&Eacute;v&eacute;nements al&eacute;atoires</label>
        <div id="switch" class="switch_outer" style="`+style+`" onclick="events_toggle()"><div class="switch_inner"></div></div>
        <div class="event_div">
            <label class="event_lbl" id="1">Infiltr&eacute; pitoyable</label>
            <input type="range" oninput="event_value(0)" class="event_slider" id="event_0" min="0" max="10" step="1" value="0">
        </div>
        <div class="event_div">
            <label class="event_lbl" id="2">Confusion g&eacute;n&eacute;rale</label>
            <input type="range" oninput="event_value(1)" class="event_slider" id="event_1" min="0" max="10" step="1" value="0">
        </div>
        <div class="event_div">
            <label class="event_lbl" id="3">Tout blanc</label>
            <input type="range" oninput="event_value(2)" class="event_slider" id="event_2" min="0" max="10" step="1" value="0">
        </div>
        <div class="event_div">
            <label class="event_lbl" id="4">Solitaire</label>
            <input type="range" oninput="event_value(3)" class="event_slider" id="event_3" min="0" max="10" step="1" value="0">
        </div>
        <label class="addC"></label>
    `);
    for (var i = 0; i < events_v.length; i++) {
        document.getElementById('event_'+i).value = events_v[i];
    }
}

function events_toggle() {
    if (_events) {
        _events = false;
        document.getElementById('switch').style = "background-color: #B2E0C5; justify-content: flex-start;"
    } else {
        _events = true;
        document.getElementById('switch').style = "background-color: #78DDA1; justify-content: flex-end;"
    }
}

function event_value(e) {
    value = document.getElementById('event_'+e).value;
    events_v[e] = value;
}

function backToMain() {
    if (players.length) {
        pl = encodeURI(players[0]);
        for (var i = 1; i < players.length; i++) {
            pl += '&&'+encodeURI(players[i]);
        }
        localStorage['pl'] = pl;
        window.location.href="https://yann.wysigot.com/spy/";
    } else {
        window.location.href="https://yann.wysigot.com/spy/";
    }
}

window.addEventListener('online', () => {console.log('Became online'); hasCon = true;});
window.addEventListener('offline', () => {console.log('Became offline'); hasCon = false;});

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex != 0) {
  
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
  
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

var getHttpRequest = function () {
	var httpRequest = false;

	if (window.XMLHttpRequest) {
		httpRequest = new XMLHttpRequest();
		if (httpRequest.overrideMimeType) {
			httpRequest.overrideMimeType('text/xml');
		}
	}
	else if (window.ActiveXObject) {
		try {
			httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e) {
			try {
				httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e) {}
		}
	}
	if (!httpRequest) {
		return false;
	}
	return httpRequest;
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/*
Infiltré pitoyable :
    Le ou les undernou.s ont un mot provenant d'une autre liste (diffère d'un undernou à l'autre)

Confusion générale :
    Tous les civils ont des mots différents provenants d'une même liste et le/les undernou.s ont un mot provenant d'une autre liste (diffère d'un undernou à l'autre)

Tout blanc :
    Un civil. Les autres sont des Mr. White

Solitaire (rôle) :
    Il n'y a que des civils et un solitaire qui doit éliminer tout le monde (gagne quand il ne reste plus que lui et un civil)
*/
