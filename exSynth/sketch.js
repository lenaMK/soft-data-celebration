/*
    title: 
    author: LenaMK
    date: 2025-03-20
    description: 
    data source: https://www.donneesquebec.ca/recherche/dataset/macrepertoire
    notes: 

*/
var art_import, artists_import, origines_import
var art, artists, origines, liste_origines
var backgroundColor, fontColor, darkmode, button

var minYear, maxYear
var fontsize = 15
var font = 'BagnardRegular'

var marginSides = 150
var marginTop = 100
var curtainWidth, curtainStep, curtainElement
var textHeight, maxHeight


function preload(){
     art_import = loadJSON("../0_data/oeuvres-mac.json")
     artists_import = loadJSON("../0_data/artistes-mac.json")
     origines_import = loadJSON("../0_data/index_origines.json")
}

function colorButton() {

    console.log("button pressed, darkmode: ", darkmode)

    if (darkmode){ //change to light
        fontColor = [203, 26, 60, 0.5]
        backgroundColor = [12, 15, 94, 1]
        //button.label('🌗')
        darkmode = false
    }
    else{ //change to dark
        fontColor = [0, 0, 250, 1]
        backgroundColor =   [0, 0, 0, 0.8]
        //button.label('🌓')
        darkmode = true
    }
    
    redraw()

  }

function setup(){
    colorMode(HSB, 360, 100, 100, 1);

    textAlign(CENTER, CENTER)
    
    darkmode = true;
    backgroundColor = [0, 0, 0, 0.8]
    fontColor = [0, 0, 250, 1]
    
    art = Object.values(art_import).filter(d => d.oeuvrePrincipale == null)
    artists = Object.values(artists_import)
    origines = Object.values(origines_import)

    art.sort((a, b) => {
        return b.dateAcquisition - a.dateAcquisition;
    })

    minYear = Math.min(...art.map(item => item.dateAcquisition))
    maxYear = Math.max(...art.map(item => item.dateAcquisition))

    liste_origines = origines.map(d => d.origine)


    textSize(fontsize); 
    textFont(font) 

    curtainWidth = windowWidth-marginSides*2
    curtainElementWidth = curtainWidth/(maxYear-minYear)   

    textHeight = textAscent() + textDescent()
    maxHeight = art.filter(d => d.dateAcquisition == 1992).length * textHeight
    
    // Create a button 
    button = createButton('🌓');
    button.position(windowWidth*0.97, windowHeight*0.03);
    button.mousePressed(colorButton);

    createCanvas(windowWidth, maxHeight+marginTop*2);
    noLoop()
}


function windowResized() {
    resizeCanvas(windowWidth, maxHeight);
}

function draw() {
    console.log("drawing")

    background(backgroundColor);
    fill(fontColor)
   
    
    translate(marginSides, marginTop)

    for (let step = 0; step <=(maxYear-minYear); step++){
        
        var yearData = art.filter(d => d.dateAcquisition == (minYear+step))

        var count = 0
        yearData.forEach(artwork => {
            //console.log("artwork")

            var posX = step*curtainElementWidth
            var posY = count*(textHeight)

            //console.log(artwork.artistes)
            // for each artist
            var orString = ""
            artwork.artistes.forEach(artiste => {
                if (artiste.artisteMac == true){
                    var set_n = artists.find(d => d.id == artiste.id).nationalites
                    
                    var origines = set_n.split(";")
                    
                    origines.forEach(o => {
                        var origine = liste_origines.indexOf(o.trim())+1
                        //console.log("index", origine)
                        orString += origine
                        orString += "+"
                    })
                    
                    
                }
                else{
                    orString += "0"
                    orString += "+"
                }

                text(orString.substring(0, orString.length -1), posX, posY)
            })

            //text("0", posX, posY)
            count ++
        })

    }

}
