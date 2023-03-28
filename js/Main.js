//input
let iTitolo = document.getElementById("iTitolo")
let iArtista = document.getElementById("iArtista")
let iGenere = document.getElementById("iGenere")
let iDurata = document.getElementById("iDurata")
//span
let sTitolo = document.getElementById("sTitolo")
let sArtista = document.getElementById("sArtista")
let sGenere = document.getElementById("sGenere")
let sDurata = document.getElementById("sDurata")
let errore = document.getElementById("errore") //info errore
let log = document.getElementById("log") //info azioni
let lista = document.getElementById("lista") //output playlist
let durataTotale = document.getElementById("durataTotale") //totale durata
//button
let bAggiungi = document.getElementById("aggiungi")
let bCancella = document.getElementById("cancella")
let bModifica = document.getElementById("modifica")
let bSalva = document.getElementById("salva")
//Array
let playlist = []

function onLoad(){
    //lettura valore da localstorage
    if (localStorage.getItem("playlist") != null){
        playlist = JSON.parse(localStorage.getItem("playlist"))
        console.info("\"playlist\" presente in localStorage")
    }
    else console.info("\"playlist\" non presente in localStorage")
}

function aggiungi() {
    if(controllaInput()) {
        playlist.push({
            titolo:iTitolo.value,
            artista:iArtista.value,
            genere:iGenere.value,
            durata:iDurata.value
        })
        pulisciInput()
        log.innerHTML = "Elemento inserito"
        mostraPlaylist()
    }
}

function cancella() {
    //controlla se l'utente ha attivato la
    //modalità modifica ed annulla le modifiche
    if(bCancella.innerHTML == "Annulla Modifica"){
        ripristinaAttributi()
        pulisciInput()
        log.innerHTML = "Modifiche annullate"
    }
    else if (controllaTitolo()) { //elimina oggetto
        let rimosso = false
        sTitolo.innerHTML = ''
        errore.innerHTML = ''
        for(let i = 0; i < playlist.length; i++) {
            //ricerca case-insensitive
            if(playlist[i].titolo.toLowerCase() == iTitolo.value.toLowerCase()){
                playlist.splice(i,1)
                i = playlist.length
                rimosso = true
                log.innerHTML = "Brano rimosso"
            }
        }
        if(rimosso == false) log.innerHTML = "Brano non trovato"
        mostraPlaylist()
    }
}

function modifica() {
    var index = -1
    //ricerca dell'oggetto con nome in input
    for(let i = 0; i < playlist.length; i++)
        if(playlist[i].titolo.toLowerCase() == iTitolo.value.toLowerCase()) {
            index = i
            i = playlist.length
        }

    //controlla se l'utente ha attivato la modalità
    //modifica ed applica le modifiche
    if (bModifica.innerHTML == "Registra Modifica" && controllaInput()) {
        playlist[index].artista = iArtista.value
        playlist[index].genere = iGenere.value
        playlist[index].durata = iDurata.value
        ripristinaAttributi()
        mostraPlaylist()
        log.innerHTML = "Modifiche applicate"
    } else if (controllaTitolo()) { 
        if ( index == -1) { //controllo esistenza oggetto
            log.innerHTML = "Brano non registrato"
        } else { //abilita la modalità modifica
            console.log("Modalità modifica abilitata")
            bAggiungi.classList.add("disabled")
            bSalva.classList.add("disabled")
            bModifica.innerHTML = "Registra Modifica"
            bCancella.innerHTML = "Annulla Modifica"
            iTitolo.disabled = true;
            iTitolo.value = playlist[index].titolo
            iArtista.value = playlist[index].artista
            iGenere.value = playlist[index].genere
            iDurata.value = playlist[index].durata
            togliAsterischi()
        }
    }
}

function salvaPlaylist() {
    //salva "playlist" nel localStorage
    if(localStorage.setItem("playlist",JSON.stringify(playlist)) == undefined) 
        console.log("playlist salvata in localStorage")
    log.innerHTML = "Playlist salvata"
}

function controllaTitolo() {
    //controlla solo l'input titolo
    if (iTitolo.value == '' || iTitolo.value.contains == '  ') {
        ok = false
        sTitolo.innerHTML = '*'
        errore.innerHTML = "* Campo richiesto"
        console.warn("Parametri mancanti")
        return false
    } else {
        let rimosso = false
        sTitolo.innerHTML = ''
        errore.innerHTML = ''
        return true
    }
}

function controllaInput() {
    //controlla se gli input sono validi
    let ok = true
    let erroreValore = false
    if (iTitolo.value == '' || iTitolo.value.contains == '  ') {
        ok = false
        sTitolo.innerHTML = '*'
    } else sTitolo.innerHTML = ''
    if (iArtista.value == '' || iArtista.value.contains == '  ') {
        ok = false
        sArtista.innerHTML = '*'
    } else sArtista.innerHTML = ''
    if (iGenere.value == 'default') {
        ok = false
        sGenere.innerHTML = '*'
    } else sGenere.innerHTML = ''
    if (iDurata.value <= 0 ) {
        ok = false
        sDurata.innerHTML = '*'
        erroreValore = true
    } else sDurata.innerHTML = ''
    if(!ok) errore.innerHTML = "* Campo richiesto"
    else errore.innerHTML = ''
    if(erroreValore) errore.innerHTML += " - Valore non valido"
    return ok
}

function mostraPlaylist() {
    let totMin = 0, totSec = 0
    lista.innerHTML = ''
    playlist.forEach(p => {
        let sec = parseInt(p.durata)
        totSec += sec
        let min = 0;
        while (sec >= 60) {
            min ++
            sec -= 60
        }
        if(sec < 10) sec = "0" + sec
        if(min < 10) min = "0" + min
        lista.innerHTML = 
        "<tr>"
            + "<td>" + p.titolo + "</td>"
            + "<td>" + p.artista + "</td>"
            + "<td>" + p.genere + "</td>"
            + "<td>" + min + ":" + sec + "</td>"
        + "</tr>"
        + lista.innerHTML
    });
    //totale durata
    while (totSec >= 60) {
        totMin ++, totSec -= 60
    }
    if(totSec < 10) totSec = "0" + totSec
    if(totMin < 10) totMin = "0" + totMin
    durataTotale.innerHTML = totMin + ":" + totSec
}

function ripristinaAttributi() {
    //rispristina gli attributi dei tag
    bAggiungi.classList.remove("disabled")
    bSalva.classList.remove("disabled")
    bModifica.innerHTML = "Modifica"
    bCancella.innerHTML = "Cancella"
    iTitolo.disabled = false;
    console.log("Modalità modifica disabilitata")
}

function togliAsterischi() {
    sTitolo.innerHTML = ''
    sArtista.innerHTML = ''
    sGenere.innerHTML = ''
    sDurata.innerHTML = ''
    errore.innerHTML = ''
}

function pulisciInput() {
    iTitolo.value = ''
    iArtista.value = ''
    iGenere.value = ''
    iDurata.value = ''
}