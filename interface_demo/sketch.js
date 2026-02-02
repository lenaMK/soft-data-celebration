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

var minYear, maxYear, yearData
var fontsize = 15
var font = 'BagnardRegular'

var marginSides = 50
var marginTop = 100
var curtainWidth, curtainStep, curtainElement
var textHeight, maxHeight

var loopDraw
var specYear, index_tm


function preload(){
    //get data files
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

    // année sélectionnée
    var year = document.getElementById("year")
    
    specYear = year.value
    console.log("year", specYear)

    var currentYear = art.filter(d => d.dateAcquisition == specYear)
    minYear = Math.min(...currentYear.map(item => item.dateAcquisition))
    maxYear = Math.max(...currentYear.map(item => item.dateAcquisition))
 

    textSize(fontsize); 
    textFont(font) 


    textHeight = textAscent() + textDescent()
    maxHeight = currentYear.length * 50 + 400

    if(maxHeight < windowHeight)
        maxHeight = windowHeight


    createCanvas(windowWidth, maxHeight);
   
    noLoop();
    
}


function windowResized() {
    resizeCanvas(windowWidth, maxHeight);
    setup()
    draw()
}

function mouseClicked(){
    
    if(marginSides < mouseX && mouseX< windowWidth/3*2-60 && mouseY > marginTop+200){
        console.log("within artworks section")
        var artworkNb = Math.floor((mouseY-(marginTop+200))/50)
        console.log(yearData[artworkNb])
        
        
        window.open(`https://macrepertoire.macm.org/oeuvre/${yearData[artworkNb].id}`,'_blank')


    }
    else {
        
        console.log("reload for year update")
        setup()
        draw()
    }
    
}


function drawLegendeVerticale(data) {
     
    push()
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
    pop()

}



function drawYear(year){
    
    console.log(year)

    var currentOrigines = new Set()
    fill('black')
    translate(marginSides, marginTop)
    textSize(48)

    yearData = art.filter(d => d.dateAcquisition == year)
    console.log(yearData)

    text(`Année ${year}`, 150, 50 )
    noStroke()
    textSize(21)
    text(`Nombre d'œuvres de techniques mixtes acquises ${yearData.length}`, 150, 100)
  

    var count = 0

    if (yearData.length == 0){
        textSize(30)
        text(`Pas d'acquisition de techniques mixtes`, 150, 220 )
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

            // quand il y a pleusieurs artistes pour une œuvre
            if (artwork.artistes.length > 1){
                console.log(artwork.artistes.length)
                if (artwork.artistes.indexOf(artiste) == 1){
                    count++
                    posY = 220+ count*50
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

    if(yearData.length != 0)
    drawLegendeVerticale(Array.from(currentOrigines))
    
}


function draw() {
    console.log("drawing")
   
    background([0, 0, 96]);

    drawYear(specYear)
    

}
