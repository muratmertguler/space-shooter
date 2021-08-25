// pencerenin boyutlarını ayarlar
// heigh and width of screen
var x = window.innerWidth,
    y = window.innerHeight,
    ratio = x / y,
    spritePath = "./assets/img/", //file path for imagens
    step = x>y? y/10:x/10,
    player;
//These are defined variable
var bgTexture = new PIXI.Texture.from(spritePath + "blue.png");
var borderTexture = new PIXI.Texture.from(spritePath + "shield2.png")
var playerTexture1 = new PIXI.Texture.from(spritePath + "playerShip2_red.png");
var enemytexture1 = new PIXI.Texture.from(spritePath + "enemyBlack1.png");
var enemytexture2 = new PIXI.Texture.from(spritePath + "enemyGreen3.png");
var enemytexture3 = new PIXI.Texture.from(spritePath + "enemyRed3.png");
var laserRed12 = new PIXI.Texture.from(spritePath + "laserRed12.png");
var laserGreen02 = new PIXI.Texture.from(spritePath + "laserGreen02.png");
var playerLasers = [];
var enemies = [];
var enemyInterval = null;
var dfhealt = 100;
var count = 0;
var counttext = "Enemyies was destroyed : " ;
var healthtext = "HEALT: "
var gameovertext = new PIXI.Text("GAME OVER", {
    "fill": [
        "white",
        "white"
    ],
    "fontFamily": "Courier New",
    "fontSize": 36
});


gameovertext.anchor.set(0.5);
gameovertext.x = x * 0.5;
gameovertext.y = y * 0.5;

var app = new PIXI.Application({
    width: x,
    height: y,
    antialias: true,
    transparent: false,
    resolution: window.devicePixelRatio
  }
);



app.renderer.backgroundColor = 0xb0acb0;
app.renderer.transparent = true;
app.renderer.view.style.display = "block";

document.body.appendChild(app.view);

var screen = {
    "x" : 0,
    "y" : 0,
    "width" : x,
    "height" : y
}

var bg = new PIXI.Sprite(bgTexture);
bg.x = x * 0.5;
bg.y = y * 0.5;
bg.width = x;
bg.height = y;
bg.anchor.set(0.5);
app.stage.addChild(bg);

var enemycounttext = new PIXI.Text(counttext + count, {
    "fill": [
        "white",
        "white"
    ],
    "fontFamily": "Courier New",
    "fontSize": 36
});
enemycounttext.anchor.set(0.5);
enemycounttext.x = enemycounttext.width / 2;
enemycounttext.y = enemycounttext.height / 2;
app.stage.addChild(enemycounttext);

var healthcounttext = new PIXI.Text(healthtext + dfhealt, {
    "fill": [
        "white",
        "white"
    ],
    "fontFamily": "Courier New",
    "fontSize": 36
});

healthcounttext.anchor.set(0.5);
healthcounttext.x = x - healthcounttext.width / 2;
healthcounttext.y = healthcounttext.height / 2;
app.stage.addChild(healthcounttext);

var df =  new PIXI.Sprite(borderTexture);
df.x = x*0.5;
df.y = y;
df.width = x;
df.height = y /5;
df.anchor.set(0.5);
app.stage.addChild(df); 

var ship = new PIXI.Sprite(playerTexture1);
ship.x = x* 0.5;
ship.y = y*0.9;
ship.width = step;
ship.height = step;
ship.anchor.set(0.5);


ship.fire = function(){
var bullet = new PIXI.Sprite(laserGreen02);
bullet.x = ship.x + (step * Math.cos(ship.rotation - Math.PI / 2));
bullet.y = ship.y + (step * Math.sin(ship.rotation - Math.PI / 2));
bullet.width = step / 7;
bullet.height = step / 2;
bullet.anchor.set(0.5);
bullet.rotation = ship. rotation;
playerLasers.push(bullet);
app.stage.addChild(bullet);
bullet.dx = 2*Math.cos(ship.rotation - Math.PI / 2);// sonradan eklendi
bullet.dy = 2*Math.sin(ship.rotation - Math.PI / 2);
}

function enemyships() {
var enemy = new PIXI.Sprite(enemytexture1);
enemy.x = randomInt(step / 2, x - step /2);
enemy.y = randomInt(step / 2,  2 * step);
enemy.width = step;
enemy.height = step;
enemy.anchor.set(0.5);
enemy.rotation = Math.PI;
enemy.move = function(){
    enemy.y += 1;
}
enemies.push(enemy);
app.stage.addChild(enemy);
}


ship.fireStatus = true;
ship.intervalId =null;
app.stage.addChild(ship)
enemyships();


function randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function gameover(){
    clearInterval(ship.intervalId);
    clearInterval(enemyInterval);
    app.stage.removeChildren();
    app.stage.addChild(gameovertext);
    setTimeout(function(){
        location.reload();
    }, 3000);
}


document.addEventListener('keydown', (event) =>{
    if(event.preventDefault()){
        return;
    }
    if(event.keyCode == 37 || event.keyCode == 65){
        ship.rotation -= Math.PI / 30;
    }
    if(event.keyCode == 39 || event.keyCode == 68){
        ship.rotation +=  Math.PI / 30;
    }
    if (event.keyCode == 32 && ship.fireStatus == true){
        ship.fireStatus = false;
        ship.fire()
    }
});


app.ticker.add(function(){
    //hareket fonksiyonu 
    //filter çeşitli durumlara göre mermi listesini filtreler.
    //Örneğin bir mermi pencerenin dışına çıkmışsa falsa döner.
    //False değerinin döndüren elemanları listeden siler.
    playerLasers = playerLasers.filter(function(laser){
        var ret = true;
        enemies = enemies.filter(function(enemy){
            var ret1 = true;



            if(hitTestRectangle(laser, enemy) == true){
                app.stage.removeChild(laser);
                app.stage.removeChild(enemy);
                ret1 = false;
                ret = false;
                count+=1;
                enemycounttext.text = counttext + count;
            }
            return ret1;

             

            

        });
        if(contain(laser, screen) !== undefined){
            app.stage.removeChild(laser);
            ret = false;
        }
        laser.x += laser.dx;
        laser.y += laser.dy;

        return ret;
    })

    enemies = enemies.filter(function(enemy){
        var ret = true;
        enemy.move();
        
        if (hitTestRectangle(enemy,ship)==true){
            gameover();

        }


        if (hitTestRectangle(enemy,df) == true){
            app.stage.removeChild(enemy);
            ret = false;
           dfhealt -= 20
           healthcounttext.text = healthtext + dfhealt;
           if (dfhealt <= 0){
              gameover();
           } 


        }

        return ret;
    })
})

// sprite'ın verilen alanın kenarlarına çarpıp çarpmadığını kontrol eder.
//verilen alanın kenarlarına çarptoysa çarptığı yönü döndürür.
//Hiçbir kenara çarpmıyorsa undefined döndürür.
//Eğer fonksiyona verilen sprite pencerenin içindeyse undefined döner.
function contain(player, screen) {
    let ret = undefined;
    if (player.x + player.width / 2  > screen.width) {
        player.x = screen.width - player.width / 2;
        ret = "right";
    }
    if (player.x- player.width/2  < screen.x) {
        player.x = screen.x + player.width / 2;
        ret = "left";
    }
    if (player.y+ player.height/2 > screen.height) {
        player.y=screen.height-(player.height/2);
        ret = "down";
    }
    if (player.y- player.height/2  < screen.y) {
        player.y=screen.y + (player.height / 2);
        ret = "up";
    }
    return ret;
  }

//2 nesnenin birbirine çarpıp çarpmadığını kontrol eder
//2 nesnenin merkez noktaları arasındaki uzaklık
//2 nesnein 2 boyutta boyutlarının yarısının toplamından küçükse
//2 nesne birbiri ile çarpışmıştır.
function hitTestRectangle(r1, r2) {

    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    hit = false;

      r1.centerX = r1.x;
      r1.centerY = r1.y;
      r2.centerX = r2.x;
      r2.centerY = r2.y;

      r1.halfWidth = r1.width / 2;
      r1.halfHeight = r1.height / 2;
      r2.halfWidth = r2.width / 2;
      r2.halfHeight = r2.height / 2;

      vx = r1.centerX - r2.centerX;
      vy = r1.centerY - r2.centerY;

      combinedHalfWidths = r1.halfWidth + r2.halfWidth;
      combinedHalfHeights = r1.halfHeight + r2.halfHeight;

      if (Math.abs(vx) < combinedHalfWidths){

        if (Math.abs(vy) < combinedHalfHeights){

              hit = true;
        }else{

              hit = false;
        }
      }else{

        hit = false;
      }

      return hit;
}


ship.intervalId = setInterval(function(){
    if(ship.fireStatus == false){
        ship.fireStatus = true;
    }
}, 500);

enemyInterval = setInterval(function(){
    enemyships();
}, 3000);