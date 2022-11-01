const players = [];
const roles = [];
const words = [];
const p_words = [];
const events_v = [0, 0, 0, 0];
playing = false;
esc_word = '';
word = '';
amnes = 0;
vwed = 0;
re = 0;
j = 0;
isPrank = false;
hasCon = true;
_esc = false;
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
    if (_esc) {
        var httpRequest = getHttpRequest();
        httpRequest.open('GET', 'https://yann.wysigot.com/spy/place/utils.php?rand=1', true);
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
                    esc_word = rep[Math.floor(Math.random()*rep.length)];
                    console.log(esc_word);
                    start_2(tot);
                }
            }
        }
    } else {start_2(tot);}
}

function start_2(tot) {
    if (tot) {
        roles_tmp = [];
        roles_tmp.push("espion");
        nonCivils = 1;
        if (ev == 0) {
            roles_tmp.push("fdt");
            nonCivils = 2;
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
        httpRequest.open('GET', 'https://yann.wysigot.com/spy/place/utils.php?rand=1', true);
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
            if (roles[i] == 'mdj') {
//                pl += '<label class="lbl_player mdj" id="'+i+'">'+players[i]+'</label>';
            } else {
                pl += '<label class="lbl_player" onclick="kill(this)" id="'+i+'">'+players[i]+'</label>';
            }
        }
        rand = randomIntFromInterval(0,players.length-1);
        fPlayer = players[rand];
        $('body').empty();
        $('body').append(`
            <label onclick="displayMain()" class="backArrow">&larr;</label>
            <div class="outer" id="outer">
                <div class="players">`+pl+`</div>
                <label id="log">${fPlayer} commence</label>
                <div class="options">
                    <label class="guess" onclick="guess()">Deviner l'endroit</label>
                    <label onclick="newP()" style="margin-right: 5%">&#128257;</label>
                </div>
            </div>
        `);
    }
}

function guess() {
    $('body').append(`
        <div class="pop" style="position: absolute; height: 60%;">
            <label style="
                font-size: 80%;
                padding: 10%;
                text-align: center;
            ">Les d&eacute;tectives se trouvent...</label>
            <form onsubmit="return false;">
                <input type="text" class="pseudoInput" placeholder="Entre le lieu" style="margin-top: 10%; height: 45%;">
                <input type="submit" onclick="try_guessing(this.parentElement);" style="display: none;">
            </form>
        </div>
    `);
}

function try_guessing(elem) {
    guess_ = elem.children[0].value;
    if (leven(guess_, word) <= 2) {
        $('body').empty();
        pop = `
            <label onclick="displayMain()" class="backArrow">&larr;</label>
            <div id="pop" class="pop">
                <label style="text-align: center; margin: 3%;">L'espion a trouv&eacute; la position des d&eacute;tectives</label>
                <label class="start" onclick="newP()" style="background-color: #F675A8">Nouvelle partie</label>
            </div>
        `;
        $('body').append(pop);
    } else {
        $('.pop').remove();
        him = document.getElementById(roles.indexOf('espion'));
        him.style = "text-decoration: line-through;";
        him.style.backgroundColor = "black";
        him.style.color = "white";
        document.getElementById('log').innerHTML = "Les d&eacute;tectives ont gagn&eacute;";
        $('#outer').append('<label class="start" onclick="newP()" style="background-color: #F675A8">Nouvelle partie</label>');
        $('.options').remove();
        reveal();
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
        if (roles[j-1] == 'espion') {
            if (_esc) {
                pop = `
                <label style="text-align: center; padding: 5%;">Tu es un d&eacute;tective. Rep&egrave;re tes alli&eacute;s et d&eacute;masque l'espion</label>
                <label style="text-align: center; padding: 5%; margin-bottom: 2%">Tu te trouves `+esc_word+`</label>
                <label class="okButton" onclick="displayNameCard(`+(j+1)+`)">Ok</label>
            `;
            } else {
                pop = `
                    <label style="text-align: center; padding: 5%;">Tu es l'espion, tu dois localiser les d&eacute;tectives</label>
                    <label class="okButton" onclick="displayNameCard(`+(j+1)+`)">Ok</label>
                `;
            }
            $('#pop').append(pop);
        } else if (roles[j-1] == 'detective') {
            p_words[j-1] = word;
            pop = `
                <label style="text-align: center; padding: 5%;">Tu es un d&eacute;tective. Rep&egrave;re tes alli&eacute;s et d&eacute;masque l'espion</label>
                <label style="text-align: center; padding: 5%; margin-bottom: 2%">Tu te trouves `+word+`</label>
                <label class="okButton" onclick="displayNameCard(`+(j+1)+`)">Ok</label>
            `;
            $('#pop').append(pop);    
        }
    } else {
        document.getElementById('jInput').style.border = "5px solid #F675A8";
    }
}

function kill(him) {
    if (playing) {
        him.style = "text-decoration: line-through;";
        if (roles[him.id] == "espion") {
            him.style.backgroundColor = "black";
            him.style.color = "white";
            document.getElementById('log').innerHTML = "Les d&eacute;tectives ont gagn&eacute;";
            $('#outer').append('<label class="start" onclick="newP()" style="background-color: #F675A8">Nouvelle partie</label>');
            $('.options').remove();
            reveal();
        } else {
            document.getElementById('log').innerHTML = him.innerHTML+' &eacute;tait un d&eacute;tective';
        }
        roles[him.id] = "/";
    }
}

function newP() {
    re = 1;
    start(0);
}

function reveal() {
    playing = false;
    for (lbl of document.getElementsByClassName('lbl_player')) {
        if (!lbl.style.textDecoration) {
            if (roles[players.indexOf(lbl.innerHTML)] == "traitre") {
                lbl.style = "background-color: black; color: white;";
            }
        }
    }
}

function displayMain() {
    p = '';
    if (j) {
        p = " style='background-color: #F675A8;'"
    }
    if (_esc) {s = "background-color: rgb(52, 143, 221); justify-content: flex-end;";} else {s = "background-color: rgb(166, 196, 222);justify-content: flex-start;";}
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
            <label style="
                margin-top: 10%;
                margin-bottom: 5%;
                font-size: 60%;
                padding: 3%;
                border-radius: 15px;
                background-color: cornflowerblue;
                color: white;
                font-weight: bolder;
            ">Espion sous couverture</label>            
            <div id="switch" class="switch_outer" style="${s}" onclick="esc_toggle()">
                <div class="switch_inner"></div>
            </div>
            <!--<label class="addW" onclick="events()" style="background-color: #F29393;">&Eacute;v&egrave;nements al&eacute;atoires</label>-->
        </div>
    `);
}

function displayMainInfo() {
    $('body').empty();
    $('body').append(`
        <label onclick="displayMain()" class="backArrow">&larr;</label>
        <div id="pop" class="pop" style="padding: 5%; overflow-y: scroll;">
            <label style="margin-bottom: 3%; font-weight: bolder;">Meddle</label>
            <label class="desc">Un espion parmis plusieurs d&eacute;tectives.</label>
            <label class="desc">Les d&eacute;tectives sont tous au même endroit et savent o&ugrave; ils se trouvent. (ex: sur la Plage)</label>
            <label class="desc">Le but de l'espion et de deviner o&ugrave; sont les d&eacute;tectives.</label>
            <label class="desc">Chacun leur tour, les joueurs posent une question &agrave; la personne qu'il veulent concernant la nature du lieu o&ugrave; elle se trouve (le moment pour l'espion de bluffer).</label>
            <label class="desc">Les joueurs posent des questions jusqu'&agrave; ce qu'un veulent en &eacute;liminer un autre, &eacute;limination qui se fait au vote unanime <!> L'espion ne peut pas se d&eacute;voiler lors d'un vote <!></label>
            <label class="desc">Si l'espion pense savoir o&ugrave; se trouvent les d&eacute;tectives, il peut se d&eacute;voiler et rentrer le lieu sur le t&eacute;l&eacute;phone.</label>
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

function esc_toggle() {
    if (_esc) {
        _esc = false;
        document.getElementById('switch').style = "background-color: #A6C4DE; justify-content: flex-start;"
    } else {
        _esc = true;
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

function addwordfunc() {
    var httpRequest = getHttpRequest();
    place = document.getElementById('addword').value;
    place = place[0]+place.slice(1);
    place = place.replace("'","\'");
    httpRequest.open('GET', 'https://yann.wysigot.com/spy/place/utils.php?add='+place, true);
    document.getElementById('addword').value = '';
    httpRequest.send();
}