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
     art_import = loadJSON("../0_data/oeuvres-mac.json")
     artists_import = loadJSON("../0_data/artistes-mac.json")
     artists_origines_import = loadJSON("../0_data/index_origines_artistes.json")
     origines_import = loadJSON("../0_data/index_origines_tm.json")
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
   
    loopDraw = true
    
}


function windowResized() {
    resizeCanvas(windowWidth, maxHeight);
}

function mouseClicked() {
    if (loopDraw){
        noLoop()
        loopDraw = false
    }
    else {
        loop()
        loopDraw = true
    }
}

function drawLegendeVerticale(width, data) {
     

    translate(windowWidth/3*2, 100)
    console.log(data)


    for (let step = 0; step < data.length; step++){

        var current = data[step]

        var posX = 0
        var posY = step * 80

        fill(current.couleur)
        circle(posX, posY, 25)

        fill([0, 0, 0, 0.8])
            
        textSize(24); 
        text( current.origine, posX + 30, posY)

    }


}



function drawYear(year){
    stroke('black')
    strokeWeight(1)

    console.log(year)

    line(250, mouseY-22, windowWidth/2, mouseY-22)
    line(250, mouseY+22, windowWidth/2, mouseY+22)



    var currentOrigines = new Set()

    translate(marginSides, marginTop)
    textSize(48)

    var yearData = art.filter(d => d.dateAcquisition == year)
    console.log(yearData)

    text(`Année ${year} (${yearData.length})`, 150, 50 )

  

    var count = 0

    if (yearData.length == 0){
        textSize(30)
        text(`Pas d'acquisition de techniques mixtes`, 150, 120 )
    }

    yearData.forEach(artwork => {

        var posX = windowWidth/4
        var posY = 150+ count*50
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


            })
            count ++
        })

    }
}

function draw() {
    console.log("drawing")
   
    background([0, 0, 96]);

    if (specYear)
        drawYear(specYear)
    else
        drawAll()

}
