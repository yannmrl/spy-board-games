const players = [];
const roles = [];
const words = [];
const p_words = [];
const events_v = [0, 0, 0, 0];
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
}

function plus() { 
    document.getElementById('joueurs').innerHTML = "Joueurs : "+(parseInt(document.getElementById('joueurs').innerHTML.split(" : ")[1])+1);
    j = parseInt(document.getElementById('joueurs').innerHTML.split(" : ")[1]);
    if (j) {
        document.getElementById('start').style.backgroundColor = "mediumvioletred";
    }
}

function moins() {
    j = parseInt(document.getElementById('joueurs').innerHTML.split(" : ")[1]) - 1;
    if (j >= 0) {
        document.getElementById('joueurs').innerHTML = "Joueurs : "+j;
    }
    if (j == 0) {
        document.getElementById('start').style.backgroundColor = "palevioletred";
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
            httpRequest.open('GET', 'https://yann.wysigot.com/insider/utils.php?rand='+u, true);
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

function start_2(tot) {
    if (tot) {
        roles_tmp = [];
        roles_tmp.push("mdj");
        roles_tmp.push("traitre");
        nonCivils = 2;
        if (ev == 0) {
            roles_tmp.push("fdt");
            nonCivils = 3;
        }
        for (var i = 0; i < j-nonCivils; i++) {
            roles_tmp.push("civil");
        }
        roles_tmp = shuffle(roles_tmp);
        for (var i = 0; i < roles_tmp.length; i++) {
            roles[i] = roles_tmp[i];
        }
        console.log(roles);
        var httpRequest = getHttpRequest();
        httpRequest.open('GET', 'https://yann.wysigot.com/insider/utils.php?rand=1', true);
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
    httpRequest.open('GET', 'https://yann.wysigot.com/insider/utils.php?rand=1', true);
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
            app = `<div id="pop" class="pop">
                <input type="text" id="jInput" class="pseudoInput" placeholder="Entre ton pseudo" autocomplete="off">
                <label class="okButton" onclick="ok(`+j+`)">Voir la carte</label>
            </div>`;
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
                pl += '<label class="lbl_player mdj" id="'+i+'">'+players[i]+'</label>';
            } else {
                pl += '<label class="lbl_player" onclick="kill(this)" id="'+i+'">'+players[i]+'</label>';
            }
        }
        $('body').empty();
        $('body').append(`
            <label onclick="displayMain()" class="backArrow">&larr;</label>
            <div class="outer" id="outer">
                <div class="players">`+pl+`</div>
                <label id="log"></label>
                <div class="options">
                    <label onclick="newP()" style="margin-right: 5%">&#128257;</label>
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
        try {players[players.length] = document.getElementById("jInput").value;} catch {}
        $('#pop').empty();
        if (roles[j-1] == 'civil') {
            pop = `
                <label style="text-align: center; padding: 5%;">`+players[j-1]+`, tu es un civil</label>
                <label class="okButton" onclick="displayNameCard(`+(j+1)+`)">Ok</label>
            `;
            $('#pop').append(pop);
        } else if (roles[j-1] == 'traitre') {
            p_words[j-1] = word;
            pop = `
                <label style="text-align: center; padding: 5%;">`+players[j-1]+`, tu es un tra&icirc;tre, le mot est `+word+`</label>
                <label class="okButton" onclick="displayNameCard(`+(j+1)+`)">Ok</label>
            `;
            $('#pop').append(pop);    
        } else if (roles[j-1] == 'mdj') {
            p_words[j-1] = word;
            pop = `
                <label style="text-align: center; padding: 5%;">`+players[j-1]+`, tu es le ma&icirc;tre du jeu, le mot est `+word+`</label>
                <label class="okButton" onclick="displayNameCard(`+(j+1)+`)">Ok</label>
            `;
            $('#pop').append(pop); 
        } else if (roles[j-1] == 'fdt') {
            if (Math.random < 0.5) {
                p_words[j-1] = word;
                pop = `
                    <label style="text-align: center; padding: 5%;">`+players[j-1]+`, tu es le le fauteur de troubles, le mot est `+word+`</label>
                    <label class="okButton" onclick="displayNameCard(`+(j+1)+`)">Ok</label>
                `;
            } else {
                pop = `
                    <label style="text-align: center; padding: 5%;">`+players[j-1]+`, tu es le fauteur de troubles, tu ne connais pas le mot</label>
                    <label class="okButton" onclick="displayNameCard(`+(j+1)+`)">Ok</label>
                `;
            }
            $('#pop').append(pop);
        }
    } else {
        document.getElementById('jInput').style.border = "5px solid red";
    }
}

function kill(him) {
    if (playing) {
        him.style = "text-decoration: line-through;";
        if (roles[him.id] == "traitre") {
            him.style.backgroundColor = "black";
            him.style.color = "white";
            document.getElementById('log').innerHTML = "Les civils ont gagn&eacute;";
            $('#outer').append('<label class="start" onclick="newP()">Nouvelle partie</label>');
            $('.options').remove();
            reveal();
        } else {
            document.getElementById('log').innerHTML = him.innerHTML+' &eacute;tait un civil';
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
        p = " style='background-color: mediumvioletred;'"
    }
    $('body').empty();
    $('body').append(`
        <label onclick="displayMainInfo()" class="info">i</label>
        <div class="container" id="container">
            <div class="line">
                <label class="role n" onclick="moins()">-</label>
                <div class="role" style="
                    background-color: deepskyblue;
                ">
                    <label id="joueurs">Joueurs : ${j}</label>
                </div>
                <label class="role n" onclick="plus()">+</label>
            </div>
            <label class="start" id="start" onclick="start(1)"${p}>Lancer la partie</label>
            <label class="addW" onclick="events()" style="background-color: #3D6486;">&Eacute;v&egrave;nements al&eacute;atoires</label>
        </div>
    `);
}

function displayMainInfo() {
    $('body').empty();
    $('body').append(`
        <label onclick="displayMain()" class="backArrow">&larr;</label>
        <div id="pop" class="pop" style="padding: 5%; overflow-y: scroll;">
            <label style="margin-bottom: 3%; margin-top: 20vh; font-weight: bolder;">Undernou</label>
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
        <label onclick="events(true)" class="backArrow">&larr;</label>
        <div id="pop" class="pop" style="padding: 5%;">
            <label>Fauteur de troubles</label>
            <label class="desc">Son but est de mener les civils sur de fausses pistes et ainsi les empêcher de trouver le mot dans le temps imparti. Il a une chance sur deux de connaître le mot recherché.</label>
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

/*
Fauteur de troubles (rôle) :
    Son but est de mener les civils sur de fausses pistes et ainsi les empêcher de trouver le mot dans le temps imparti.
    Il a une chance sur deux de connaître le mot recherché.
*/