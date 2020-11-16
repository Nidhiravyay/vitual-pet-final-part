var database ,dog,dog1,dog2
var position

var feed,add
var foodobject
var Feedtime
var lastFed
var gameState

function preload()

{
  dogimg1 = loadImage("images/dogImg.png")
  dogimg2 = loadImage("images/dogImg1.png")
  washroom= loadImage("images/Wash Room.png");
  bedroom= loadImage("images/Bed Room.png"); 
  garden= loadImage("images/Garden.png");
  sadDog= loadImage("images/deadDog.png");
}	

function setup() 
{
  
  createCanvas(400, 500);
  database = firebase.database();
  console.log(database);
 
  readState=database.ref('gameState');
  readState.on("value",function(data){
  gameState=data.val();
  });
  
  
  
  foodobject=new Food()
  dog = createSprite(200,400,10,10);
  dog.addImage(dogimg1)
  dog.scale=0.2
 
  var dogo = database.ref('Food');
  dogo.on("value", readPosition);
  
  feed = createButton("Feed the Dog")
  feed.position(500,15)
  feed.mousePressed(FeedDog)
  
  ///
  add = createButton("Add Food")
  add.position(400,15)
  add.mousePressed(AddFood)

} 

function draw(){
  background(13,85,95);

    foodobject.display()
      
drawSprites();
  
 fedTime=database.ref('FeedTime');
 fedTime.on("value",function(data){
 lastFed=data.val();
 });


fill(255,255,254);
 textSize(15);
 if(lastFed>=12){
   text("LastFeed: "+lastFed%12+" PM",150,30)
 } else if(lastFed==0){
   text("LastFeed: 12 AM",150,50) 
 } else{
   text("LastFeed: "+lastFed+ " AM",150,50)
 }

 if(gameState!="Hungry"){
  feed.hide();
  add.hide();
  dog.addImage(sadDog);
  
} else{
  feed.show();
  add.show();
}

 currentTime=hour();
 if(currentTime==(lastFed+1)){
   update("Playing");
   foodobject.garden();
 } else if(currentTime==(lastFed+2)){
   update("Sleeping");
   foodobject.bedroom();
 } else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
   update("Bathing");
   foodobject.washroom(); 
 } else{
   update("Hungry");
   foodobject.display();
 }






 drawSprites();
}





function readPosition(data)
{
  position = data.val();
  foodobject.updateFoodStock(position)
}



function writePosition(nazo)
{
  if(nazo>0)
  {
    nazo=nazo-1
  }
  else
  {
    nazo=0
  }
     database.ref('/').set({
      'Food': nazo
  })

}

function AddFood()
{
    position++
    
    database.ref('/').update({
    Food:position
    })

}

function FeedDog()
{

  dog.addImage(dogimg2)
  foodobject.updateFoodStock(foodobject.getFoodStock()-1)
  database.ref('/').update({
  
  
    Food:foodobject.getFoodStock(),
  FeedTime:hour ()
 })
}

function update(state){
   database.ref('/').update({
   gameState:state
   });

}








