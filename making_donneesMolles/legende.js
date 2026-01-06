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
var marginTop = 100
var curtainWidth, curtainStep, curtainElement
var textHeight, maxHeight

var specYear, index_tm


function preload(){

     origines_import = loadJSON("../0_data/index_origines_tm.json")
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

    maxHeight = origines.length * 50 + marginTop + 100
    
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
            posY = step*50+marginTop
            
        }            
        else {
            posX = 500
            posY = (step-15)*50+marginTop
        }
        


        fill(current.couleur)
        circle(posX, posY, 25)

        fill([0, 0, 0, 0.8])
            
        textSize(24); 
        text( current.origine, posX + 30, posY)
        text( `(`+current.nb_oeuvres+`)`, posX + 40 + textWidth(current.origine), posY)

    }


}

function draw (){
    drawLegende()


}
