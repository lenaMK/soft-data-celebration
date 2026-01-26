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

var circleSize = 25

var minYear, maxYear
var fontsize = 15
var font = 'BagnardRegular'

var marginSides = 50
var marginTop = 100
var curtainWidth, curtainStep, curtainElement
var textHeight, maxHeight

var loopDraw
var specYear, index_tm


function preload(){
     art_import = loadJSON("../data/oeuvres-mac.json")
     artists_import = loadJSON("../data/artistes-mac.json")
     artists_origines_import = loadJSON("../data/index_origines_artistes.json")
     origines_import = loadJSON("../data/index_origines_tm.json")
}



function setup(){
    colorMode(HSB, 360, 100, 100, 1);

    textAlign(LEFT, CENTER)
    

    
    // sans séries, uniquement les techniques mixtes

    art = Object.values(art_import).filter(d => d.oeuvrePrincipale == null && d.categorie == "Techniques mixtes")
    artists = Object.values(artists_import)
    artists_origines = Object.values(artists_origines_import)
    origines = Object.values(origines_import)

    console.log("origines", origines)
    art.sort((a, b) => {
        return b.dateAcquisition - a.dateAcquisition;
    })

    minYear = Math.min(...art.map(item => item.dateAcquisition))
    maxYear = Math.max(...art.map(item => item.dateAcquisition))
 

    var guirlandes = 0
    for (var annee = minYear; annee <= maxYear; annee++){
        if (art.filter(d => d.dateAcquisition == annee).length != 0)
            guirlandes++
    }

    console.log("nb guirlandes: ", guirlandes)

    textSize(fontsize); 
    textFont(font) 

    curtainWidth = windowWidth-marginSides*2
    curtainElementWidth = curtainWidth/(maxYear-minYear)   

    textHeight = textAscent() + textDescent()
    maxHeight = art.filter(d => d.dateAcquisition == 1992).length * 50 + 200


    params = getURLParams();
    specYear = params.year
    console.log(specYear)

    createCanvas(windowWidth, maxHeight+marginTop*2);
   
    noLoop();
    
}


function windowResized() {
    resizeCanvas(windowWidth, maxHeight);
}


function drawLegendeVerticale(width, data) {
     

    translate(windowWidth/3*2, 120)
    console.log(data)
    textSize(30); 
    text("Légende", -20, 0)

    for (let step = 1; step < data.length +1; step++){

        var current = data[step-1]

        var posX = 0
        var posY = step * 80

        fill(current.couleur)
        circle(posX, posY, 25)

        fill([0, 0, 0, 0.8])
            
        textSize(21); 
        text( current.origine, posX + 30, posY)

    }

    stroke('black')
    strokeWeight(1)

    line(-60, -20, -60, posY+30)

}



function drawYear(year){
    
    console.log(year)

    var currentOrigines = new Set()

    translate(marginSides, marginTop)
    textSize(48)

    var yearData = art.filter(d => d.dateAcquisition == year)
    console.log(yearData)

    text(`Année ${year}`, 150, 50 )
    noStroke()
    textSize(21)
    text(`Nombre d'œuvres acquises ${yearData.length}`, 150, 100)
  

    var count = 0

    if (yearData.length == 0){
        textSize(30)
        text(`Pas d'acquisition de techniques mixtes`, 150, 120 )
    }

    yearData.forEach(artwork => {

        var posX = 200
        var posY = 220+ count*50
        textSize(21)
        
        fill(0, 0, 0, 0.8)
           
        noStroke()

        text(yearData.indexOf(artwork)+1, posX - 50, posY+2)
     
        var countOs = 0
        artwork.artistes.forEach(artiste => {

            if (artwork.artistes.length > 1){
                console.log(artwork.artistes.length)
                if (artwork.artistes.indexOf(artiste) == 1){
                    count++
                    posY = 150+ count*50
                }
                    

            }
            var origines_renseignees = artists_origines.find(d => d.id == artiste.id)
            
            

            if (origines_renseignees){
                origines_renseignees.origines.forEach(o => {

                    
                    var current = origines.find(d => d.origine == o)
                    currentOrigines.add(current)

                    if (current)
                        fill(current.couleur)
                    else
                        fill([0, 70, 100])

                    circle(posX+countOs*circleSize+15, posY, circleSize)

                    countOs ++;

                })
            }
            else{
                fill([0, 100, 100])
                circle(posX+countOs*circleSize, posY, circleSize)
                countOs ++;
            }    
            fill(0, 0, 0, 0.8)
            text(`${artwork.titre}, ${artwork.libelleNomsArtistes}, ${artwork.dateProduction}`,posX+countOs*circleSize+50, posY)


        })
        count ++
    })
    
    console.log(currentOrigines)
    drawLegendeVerticale(100, Array.from(currentOrigines))
    
}


function drawAll(){

    circleSize=12
    
    
    translate(marginSides, marginTop)

    var totalCount = 0
    for (let step = 0; step <=(maxYear-minYear); step++){
         noStroke()
        var yearData = art.filter(d => d.dateAcquisition == (minYear+step))

        var count = 0
        yearData.forEach(artwork => {
            //console.log("artwork")

            var posX = step*curtainElementWidth
            var posY = count*(textHeight)

            //console.log(artwork.artistes)
            // for each artist
            
            var countOs = 0
            artwork.artistes.forEach(artiste => {
                
                var origines_renseignees = artists_origines.find(d => d.id == artiste.id)
                
                if (origines_renseignees){
                    origines_renseignees.origines.forEach(o => {

                        var current = origines.find(d => d.origine == o)
                        
                        if (current)
                            fill(current.couleur)
                        else
                            fill([0, 100, 100])
                        circle(posX+countOs*circleSize, posY, circleSize)

                        countOs ++;

                    })
                }
                else{
                    fill([0, 100, 100])
                    circle(posX+countOs*circleSize, posY, circleSize)
                    countOs ++;
                }             

                totalCount += countOs
            })
            count ++

        })
        
    }
    console.log("nb pompons", totalCount)
}

function draw() {
    console.log("drawing")
   
    background([0, 0, 96]);

    if (specYear)
        drawYear(specYear)
    else
        drawAll()

}
