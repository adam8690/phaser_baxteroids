window.onload = function() {

        var game = new Phaser.Game(500, 500, Phaser.AUTO, '', { preload: preload, create: create, update: update });

        var Baxteroids = {
            shipAngularVelocity: 300,
            shipAcceleration: 300,
            shipDrag: 100,
            shipMaxVelocity: 400,
            bulletSpeed: 420,
            bulletInterval: 50,
            bulletLifespan: 2000,
            bulletMaxCount: 30
        };


// called first
        function preload () {
            // load image assets before game starts
            game.load.image('ship', 'ship.png');
            game.load.image('bullet', 'bullet.png');
        }
// called after preload
        function create () {
            // center the game on the page
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;

            // change background colour
            game.stage.backgroundColor = '#000000';

            // start game physics
            game.physics.startSystem(Phaser.Physics.ARCADE);


            // add ship to middle of game area
            this.ship = game.add.sprite(game.world.centerX, game.world.centerY, 'ship');
            this.ship.anchor.set(0.5, 0.5);

            // add bullets to game
            this.bulletGroup = game.add.group();
            this.bulletGroup.enableBody = true;
            // set physics type on bullets
            this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
            // create multiple bullet sprites
            this.bulletGroup.createMultiple(Baxteroids.bulletMaxCount, 'bullet')
            this.bulletGroup.setAll('anchor.x', -5);
            this.bulletGroup.setAll('anchor.y', 3);
            this.bulletGroup.setAll('lifespan', Baxteroids.bulletLifespan);
            this.bulletInterval = 0;

            // set the ships physics settings
            game.physics.enable(this.ship, Phaser.Physics.ARCADE)
            this.ship.body.drag.set(Baxteroids.shipDrag);
            this.ship.body.maxVelocity.set(Baxteroids.shipMaxVelocity);      

            // add key input to the game
            this.keys = game.input.keyboard.createCursorKeys();
        }
// called once every frame (60hz)
        function update () {
            // poll arrow keys to move the ship
            if(this.keys.left.isDown){
                this.ship.body.angularVelocity = -Baxteroids.shipAngularVelocity;
            }
            else if(this.keys.right.isDown){
                this.ship.body.angularVelocity = Baxteroids.shipAngularVelocity;
            }
            else(this.ship.body.angularVelocity = 0);

            if(this.keys.up.isDown){
                // ship rotation has to be offset by 270 degrees(1.5*pi rads) so that forwards is in the direction of its pointy end
                game.physics.arcade.accelerationFromRotation((this.ship.rotation + 4.71), Baxteroids.shipAcceleration, this.ship.body.acceleration)
            }
            else(this.ship.body.acceleration.set(0));

            if(this.keys.down.isDown){
                if(game.time.now > this.bulletInterval){
                    var bullet = this.bulletGroup.getFirstExists(false)

                    if(bullet){
                        var length = this.ship.width * 0.5;
                        var x = this.ship.x +  (Math.cos(this.ship.rotation) * length);
                        var y = this.ship.y +  (Math.sin(this.ship.rotation) * length);

                        bullet.rotation = (this.ship.rotation + 4.71);

                        bullet.reset(x, y);
                        bullet.lifespan = Baxteroids.bulletLifespan;
                        bullet.rotation = (this.ship.rotation + 4.71);

                        game.physics.arcade.velocityFromRotation((this.ship.rotation + 4.71), Baxteroids.bulletSpeed, bullet.body.velocity);
                        this.bulletInterval = game.time.now + Baxteroids.bulletInterval;
                        
                    }
                }
            }
        
        screenWrap(this.ship)
        }
        // make sprites reappear at opposite side of canvas when they leave the screen
        function screenWrap(sprite){
            if(sprite.x < 0){
                sprite.x = game.width;
            }
            else if(sprite.x > game.width){
                sprite.x = 0;
            }

            if(sprite.y < 0){
                sprite.y = game.height;
            }
            else if(sprite.y > game.height){
                sprite.y = 0;
            }
        }

    };