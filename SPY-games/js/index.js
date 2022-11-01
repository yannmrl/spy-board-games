function checkhttps() {
    if (window.location.href.slice(0,5) == "http:") {
        window.location.href = window.location.href.replace("http:", "https:");
    }
}

function anime() {
    if (document.body.children[0].src.includes("svg/icon.svg")) {
        document.body.children[0].src = "svg_anime/icon.svg";
        elems = document.getElementsByClassName('d_game');
        for (var i = 0; i < elems.length; i++) {
            elems[i].children[0].src = "svg_anime/"+i+".svg";
        }
        document.body.style.backgroundColor = "#212121";
        document.body.style.color = "white";
    } else {
        document.body.children[0].src = "svg/icon.svg";
        elems = document.getElementsByClassName('d_game');
        for (var i = 0; i < elems.length; i++) {
            elems[i].children[0].src = "svg/"+i+".svg";
        }
        document.body.style.backgroundColor = "";
        document.body.style.color = "black"
    }
}