const players = [];
const roles = [];
const words = [];
const votes = [];
const points = [];
const p_words = [];
const events_v = [0, 0, 0, 0];
pPlus = [];
s_word = '';
votes_commences = 0;
fPlayer = '';
playing = false;
word = '';
amnes = 0;
vwed = 0;
re = 0;
j = 0;
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
        document.getElementById('joueurs').innerHTML = "Joueurs : "+players.length;
        j = players.length;
        document.getElementById('start').style.backgroundColor = "#F675A8";
    }
}

function plus() { 
    document.getElementById('joueurs').innerHTML = "Joueurs : "+(parseInt(document.getElementById('joueurs').innerHTML.split(" : ")[1])+1);
    j = parseInt(document.getElementById('joueurs').innerHTML.split(" : ")[1]);
    if (j) {
        document.getElementById('start').style.backgroundColor = "#F675A8";
    }
}

function moins() {
    j = parseInt(document.getElementById('joueurs').innerHTML.split(" : ")[1]) - 1;
    if (j >= 0) {
        document.getElementById('joueurs').innerHTML = "Joueurs : "+j;
    }
    if (j == 0) {
        document.getElementById('start').style.backgroundColor = "#FAB5D0";
    }
}

function start(first) {
    ev = -1;
    tot = 1;
    if (first) {
        j = parseInt(document.getElementById('joueurs').innerHTML.split(' : ')[1]);
        for (var i = 0; i < j; i++) {
            points[i] = 0;
        }
        tot = j;
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
        start_2(tot);
    } else {start_2(tot);}
}

function start_2(tot) {
    if (tot) {
        roles_tmp = [];
        roles_tmp.push("espion");
        roles_tmp.push("espion");
        nonCivils = 2;
        if (ev == 0) {
            roles_tmp.push("fdt");
            nonCivils = 3;
        }
        for (var i = 0; i < j-nonCivils; i++) {
            roles_tmp.push("detective");
        }
        roles_tmp = shuffle(roles_tmp);
        for (var i = 0; i < roles_tmp.length; i++) {
            roles[i] = roles_tmp[i];
        }
        console.log(roles);
        var httpRequest = getHttpRequest();
        httpRequest.open('GET', 'https://yann.wysigot.com/spy/insider/utils.php?rand=1', true);
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
                    word = rep[Math.floor(Math.random()*rep.length)];
                    console.log(word);
                    displayNameCard(1);
                }
            }
        }
    }
}

function change_word() {
    var httpRequest = getHttpRequest();
    httpRequest.open('GET', 'https://yann.wysigot.com/spy/insider/utils.php?rand=1', true);
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
                word = rep[Math.floor(Math.random()*rep.length)];
            }
        }
    }
}

function displayNameCard(j) {
    if (j < roles.length+1) {
        $('body').empty();
        if (!re) {
            app = `
                <div id="pop" class="pop">
                    <form onsubmit="return false;" style="display: flex; flex-direction: column; align-items: center;">
                        <input type="text" id="jInput" class="pseudoInput" placeholder="Entre ton pseudo" autocomplete="off" style="height: 45%;">
                        <input type="submit" class="okButton" onclick="ok(`+j+`)" value="Voir la carte" style="border: 0; width: min-content; font-size: 100%;">
                    </form>
                </div>
            `;
        } else {
            app = `<div id="pop" class="pop">
                <label class="lbl_pseudo">`+players[j-1]+`</label>
                <label class="okButton" onclick="ok(`+j+`)">Voir la carte</label>
            </div>`;
        }
        $('body').append(app);
    } else {
        playing = true;
        pl = '';
        for (var i = 0; i < players.length; i++) {
            votes[i] = '|||';
            pl += '<label class="lbl_player" onclick="vote(this)" id="'+i+'">'+players[i]+'</label>';
        }
        votes_commences = 0;
        rand = randomIntFromInterval(0,players.length-1);
        fPlayer = players[rand];
        $('body').empty();
        $('body').append(`
            <label onclick="displayMain()" class="backArrow">&larr;</label>
            <div class="outer" id="outer">
                <div class="players">`+pl+`</div>
                <label id="log">${fPlayer} commence</label>
                <div class="options">
                    <label class="vote" onclick="startvote()">Passer au vote</label>
                    <label onclick="newP()">&#128257;</label>
                </div>
            </div>
        `);
        for (label of document.getElementsByClassName('lbl_player')) {
            label.style.backgroundColor = "lightgray";
        }
    }
}

function startvote() {
    if (!votes_commences) {
        document.getElementById('log').innerHTML = fPlayer+' vote';
        document.getElementsByClassName('vote')[0].innerHTML = "Suivant";
        votes_commences = 1;
    } else {
        next();
    }
}

function vote(him) {
    if (document.getElementById('log').innerHTML.includes('vote')) {
        voter = document.getElementById('log').innerHTML.replace(' vote', '');
        index = players.indexOf(voter);
        console.log('index'+index);
        if (him.style.backgroundColor == "lightgray") {
            v = votes[index].split('|||');
            if (!v[0]) {
                v[0] = him.innerHTML;
                him.style.backgroundColor = "black";
                him.style.color = "white";
            } else if (!v[1]) {
                v[1] = him.innerHTML;
                him.style.backgroundColor = "black";
                him.style.color = "white";
            }
            votes[index] = v[0]+'|||'+v[1];
        } else {
            him.style.backgroundColor = "lightgray";
            him.style.color = "black";
            v = votes[index].split('|||');
            if (v[0] == him.innerHTML) {
                v[0] = '';
            } else if (v[1] == him.innerHTML) {
                v[1] = '';
            }
            votes[index] = v[0]+'|||'+v[1];
        }
    }
}

function next() {
    current = document.getElementById('log').innerHTML.replace(' vote', '');
    index = players.indexOf(current);
    if (votes[index].split('|||')[0] && votes[index].split('|||')[1]) {
        for (label of document.getElementsByClassName('lbl_player')) {
            label.style.backgroundColor = "lightgray";
            label.style.color = "black";
        }
        ended = true;
        for (v of votes) {
            if (v == '|||') {
                ended = false;
            }
        }
        if (!ended) {
            if (players[index+1] && players[index+1] != fPlayer) {
                document.getElementById('log').innerHTML = players[index+1]+' vote';
            } else if (players[0] != fPlayer) {
                document.getElementById('log').innerHTML = players[0]+' vote';
            } else {
                guess();
            }
        } else {
            guess();
        }
    }
}

function guess() {
    espions = [players[roles.indexOf('espion')], players[roles.indexOf('espion',roles.indexOf('espion')+1)]];
    for (var i = 0; i < players.length; i++) {
        v = votes[i].split('|||');
        pPlus[i] = 0;
        if (v[0] == espions[0] || v[0] == espions[1]) {
            pPlus[i] = 2;
        }
        if (v[1] == espions[0] || v[1] == espions[1]) {
            if (pPlus[i]) {pPlus[i] = 6;}
            else {pPlus[i] = 2;}
        }
        if (pPlus[i] <= 2 && roles[i] == 'espion') {
            pPlus[i] = 1;
        }
    }
    console.log(pPlus[players.indexOf(espions[0])]);
    console.log(pPlus[players.indexOf(espions[1])]);
    if (pPlus[players.indexOf(espions[0])] < pPlus[players.indexOf(espions[1])]) {pPlus[players.indexOf(espions[1])] = 3;}
    else if (pPlus[players.indexOf(espions[0])] < pPlus[players.indexOf(espions[0])]) {pPlus[players.indexOf(espions[0])] = 3;}
    correct_guesses = [];
    for (var i = 0; i < pPlus.length; i++) {
        if (pPlus[i] == 6 && roles[i] == "detective") {
            correct_guesses.push(players[i]);
        }
    }
    tx = correct_guesses[0];
    if (correct_guesses.length > 1) {
        for (var i = 0; i < correct_guesses.length-2; i++) {
            tx += ', '+correct_guesses[i];
        }
        tx += ' et '+correct_guesses[correct_guesses.length-1]+' ont trouv&eacute; les espions, ils peuvent essayer de deviner le mot pour se partager 6 points';
        plur = 'z';
    } else {tx += ' a trouv&eacute; les espions, il peut essayer de deviner le mot pour gagner 6 points'; plur = '';}
    console.log('cg : '+correct_guesses)
    if (correct_guesses.length) {
        $('body').append(`
            <div class="pop" style="position: absolute; height: 60%;">
                <label style="
                    font-size: 80%;
                    padding: 10%;
                    text-align: center;
                ">${tx}</label>
                <form onsubmit="return false;">
                    <input type="text" class="pseudoInput" placeholder="Entre${plur} le mot" style="margin-top: 10%; height: 45%;">
                    <input type="submit" onclick="try_guessing(this.parentElement, '${correct_guesses}');" style="display: none;">
                </form>
            </div>
        `);
    } else {reveal();}
}

function reveal(found = false) {
    for (var i = 0; i < pPlus.length; i++) {points[i] += pPlus[i];}
    $('body').empty();
    points_lbls = '';
    for (var i = 0; i < players.length; i++) {
        if (pPlus[i] >= 0) {
            points_lbls += '<label class="point_pl">'+players[i]+' : '+points[i]+' (+'+pPlus[i]+')</label>';
        } else {
            points_lbls += '<label class="point_pl">'+players[i]+' : '+points[i]+' (-'+Math.abs(pPlus[i])+')</label>';
        }
    }
    if (found) {
        add = ' et leur mot a &eacute;t&eacute; trouv&eacute;';
    } else {add='';}
    pop = `
        <label onclick="displayMain()" class="backArrow">&larr;</label>
        <div id="pop" class="pop">
            <label style="text-align: center; margin: 3%;">Les espions &eacute;taient ${espions[0]} et ${espions[1]}${add}</label>
            <div class="points">
                ${points_lbls}
            </div>
            <label class="start" onclick="newP()" style="background-color: #F675A8">Nouvelle partie</label>
        </div>
    `;
    $('body').append(pop);
}

function try_guessing(elem, cg) {
    cg = cg.split(',');
    console.log(cg)
    guess_ = elem.children[0].value.toLowerCase();
    match = s_word.toLowerCase();
    if (leven(guess_, match) < 3) {
        for (pl of cg) {
            pPlus[players.indexOf(pl)] += Math.round(6/cg.length);
        }
        reveal(true);
    } else {reveal();}
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
        if (roles[j-1] == 'detective') {
            pop = `
                <label style="text-align: center; padding: 5%;">D&eacute;tective</label>
                <label class="okButton" onclick="displayNameCard(`+(j+1)+`)">Ok</label>
            `;
            $('#pop').append(pop);
        } else if (roles[j-1] == 'espion') {
            p_words[j-1] = word;
            s_word = word;
            pop = `
                <label style="text-align: center; padding: 5%;">Espion</label>
                <label style="text-align: center; padding: 5%; margin-bottom: 2%">`+word+`</label>
                <label class="okButton" onclick="displayNameCard(`+(j+1)+`)">Ok</label>
            `;
            $('#pop').append(pop);    
        }
    } else {
        document.getElementById('jInput').style.border = "5px solid #F675A8";
    }
}

function newP() {
    re = 1;
    start(0);
}

function displayMain() {
    p = '';
    if (j) {
        p = " style='background-color: #F675A8;'"
    }
    $('body').empty();
    $('body').append(`
        <label onclick="backToMain()" class="backArrow">&larr;</label>
        <label onclick="displayMainInfo()" class="info">i</label>
        <div class="container" id="container">
            <div class="line">
                <label class="role n" onclick="moins()">-</label>
                <div class="role" style="
                    background-color: #554994;
                    color: white;
                ">
                    <label id="joueurs">Joueurs : ${j}</label>
                </div>
                <label class="role n" onclick="plus()">+</label>
            </div>
            <label class="start" id="start" onclick="start(1)"${p}>Lancer la partie</label>
            <!--<label class="addW" onclick="events()" style="background-color: #F29393;">&Eacute;v&egrave;nements al&eacute;atoires</label>-->
        </div>
    `);
}

function displayMainInfo() {
    $('body').empty();
    $('body').append(`
        <label onclick="displayMain()" class="backArrow">&larr;</label>
        <div id="pop" class="pop" style="padding: 5%; overflow-y: scroll;">
            <label style="margin-bottom: 3%; font-weight: bolder;">Encounter</label>
            <label class="desc">Deux espions doivent se rencontrer dans une foule de d&eacute;tectives.</label>
            <label class="desc">Les deux espions ont un mot commun qui va leur permettre de se reconna&icirc;tre. Les d&eacute;tectives n'ont aucun mot.</label>
            <label class="desc">Chacun leur tour, les joueurs disent un mot. Les espions vont dire un mot en rapport avec le leur pour que leur partenaire le reconnaisse, mais pas trop proche pour &eacute;viter d'attirer les soup&ccedil;ons des d&eacute;tectives.</label>
            <label class="desc">Une fois les deux tours termin&eacute;s, chaque joueur prend le t&eacute;l&eacute;phone et vote pour les deux joueurs qu'il pense &ecirc;tre espions.</label>
            <label class="desc">Si un d&eacute;tective a trouv&eacute; les deux espions, il peut essayer de trouver leur mot pour gagner des points suppl&eacute;mentaires.</label>
        </div>
    `);

}

function displayEventsInfo() {
    $('body').empty();
    $('body').append(`
        <label onclick="events(true)" class="backArrow">&larr;</label>
        <div id="pop" class="pop" style="padding: 5%;">
            <label>Fauteur de troubles</label>
            <label class="desc">Son but est de mener les civils sur de fausses pistes et ainsi les emp&ecirc;cher de trouver le mot dans le temps imparti. Il a une chance sur deux de conna&icirc;tre le mot recherch&eacute;.</label>
            <label></label>
            <label class="desc"></label>
            <label></label>
            <label class="desc"></label>
            <label></label>
            <label class="desc"></label>
        </div>
    `);
}

function events(fromInfo) {
    if (fromInfo) {
        $('body').empty();
        $('body').append('<div class="container" id="container"></div>');
    }
    if (_events) {
        style = "background-color: #348FDD; justify-content: flex-end;"
    } else {
        style = "background-color: #A6C4DE; justify-content: flex-start;"
    }
    $('#container').empty();
    $('#container').append(`
        <label onclick="displayMain()" class="backArrow">&larr;</label>
        <label onclick="displayEventsInfo()" class="info">i</label>
        <label class="addM" style="margin-bottom: 5%; text-align: center;">&Eacute;v&eacute;nements al&eacute;atoires</label>
        <div id="switch" class="switch_outer" style="`+style+`" onclick="events_toggle()"><div class="switch_inner"></div></div>
        <div class="event_div">
            <label class="event_lbl" id="1">Fauteur de troubles</label>
            <input type="range" oninput="event_value(0)" class="event_slider" id="event_0" min="0" max="10" step="1" value="0">
        </div>
        <div class="event_div">
            <label class="event_lbl" id="2">////////////////////</label>
            <input type="range" oninput="event_value(1)" class="event_slider" id="event_1" min="0" max="10" step="1" value="0">
        </div>
        <div class="event_div">
            <label class="event_lbl" id="3">////////////////////</label>
            <input type="range" oninput="event_value(2)" class="event_slider" id="event_2" min="0" max="10" step="1" value="0">
        </div>
        <div class="event_div">
            <label class="event_lbl" id="4">////////////////////</label>
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
        document.getElementById('switch').style = "background-color: #A6C4DE; justify-content: flex-start;"
    } else {
        _events = true;
        document.getElementById('switch').style = "background-color: #348FDD; justify-content: flex-end;"
    }
}

function event_value(e) {
    value = document.getElementById('event_'+e).value;
    events_v[e] = value;
}

function backToMain() {
    if (players.length) {
        pl = players[0];
        for (var i = 1; i < players.length; i++) {
            pl += '&&'+encodeURI(players[i]);
        }
        localStorage['pl'] = pl;
        window.location.href="https://yann.wysigot.com/spy/?"+pl;
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
Fauteur de troubles (rôle) :
    Son but est de mener les civils sur de fausses pistes et ainsi les empêcher de trouver le mot dans le temps imparti.
    Il a une chance sur deux de connaître le mot recherché.
*/