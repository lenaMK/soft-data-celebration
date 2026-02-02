/*
/*
    title: 
    author: LenaMK
    date: 2025-03-20
    description: 
    data source: https://www.donneesquebec.ca/recherche/dataset/macrepertoire
    notes: 

*/
var art_import, artists_import, origines_import, params
var art, artists, origines, liste_origines, artists_origines
var backgroundColor, fontColor, darkmode, button


var minYear, maxYear


var marginSides = 150
var marginTop = 150
var curtainWidth, curtainStep, curtainElement
var textHeight

var specYear, index_tm


function preload(){

     origines_import = loadJSON("../data/index_origines_tm.json")
}

function setup(){
    colorMode(HSB, 360, 100, 100, 1);

    textAlign(LEFT, CENTER)
    
    darkmode = true;
    backgroundColor = [0, 0, 0, 0.8]
    fontColor = [0, 0, 250, 1]
    
    // sans séries, uniquement les techniques mixtes

   
    origines = Object.values(origines_import)
    
    /*origines.sort((a, b) => {
        return b.origine - a.origine;
    })*/
    
    console.log("origines", origines)

    

    createCanvas(windowWidth, windowHeight);
    noLoop()
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


function drawLegende() {
    console.log("drawing")
    noStroke()
    background("lightgrey");

    translate(marginSides, marginTop)

    for (let step = 0; step < origines.length; step++){
        
        var current = origines[step]
        var posX, posY 

        if (step < 15){
            posX = 50
            posY = step*60+marginTop
            
        }            
        else {
            posX = 500
            posY = (step-15)*60+marginTop
        }
        


        fill(current.couleur)
        circle(posX, posY, 25)

        fill([0, 0, 0, 0.8])
            
        textSize(28); 
        text( current.origine, posX + 30, posY)
        text( `(`+current.nb_oeuvres+`)`, posX + 40 + textWidth(current.origine), posY)

    }


}

function draw (){

    
    drawLegende()
    textSize(60)
    text("Légende", marginSides/2- 50, windowHeight/100)

    var textWidth = 390
    textWrap(WORD);
    textSize(24)
    text("Le chiffre entre parenthèse indique le nombre de pompons et donc le nombre d'œuvres dans laquelle cette origine est représentée.", windowWidth/2 + 100, windowHeight-560, textWidth)

    text("* Il reste des petites erreurs dans les données, comme les concaténations de citoyennetés autochtones. Je les ai ajustées pendant la fabrication.", windowWidth/2 + 100, windowHeight-360, textWidth)

}
