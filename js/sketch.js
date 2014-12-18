var container;

      var camera, scene, renderer;

      var mouseX = 0, mouseY = 0;

      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;


      init();
      animate();


      function init() {

        container = document.createElement( 'div' );
        // document.body.appendChild( container );
        $("#ball").append( container );

        camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight, 10.1, 1000 );
        camera.position.z = 100;

        // scene

        scene = new THREE.Scene();

        var ambient = new THREE.AmbientLight( 0xffffff );
        scene.add( ambient );

        var directionalLight = new THREE.DirectionalLight( 0xffeabc );
        directionalLight.position.set( 0, 10, 1 );
        scene.add( directionalLight );

        // white spotlight shining from the side, casting shadow

        var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 100, 1000, 100 );

        spotLight.castShadow = true;

        spotLight.shadowMapWidth = 1024;
        spotLight.shadowMapHeight = 1024;

        spotLight.shadowCameraNear = 300;
        spotLight.shadowCameraFar = 4000;
        spotLight.shadowCameraFov = 30;

        scene.add( spotLight );

        // texture

        var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {

          console.log( item, loaded, total );

        };

        var texture = new THREE.Texture();

        var onProgress = function ( xhr ) {
          if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
          }
        };

        var onError = function ( xhr ) {
        };


        var loader = new THREE.ImageLoader( manager );
        loader.load( 'js/tex/leather.jpg', function ( image ) {

          texture.image = image;
          texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.repeat.set( 125, 125 );
          texture.needsUpdate = true;

        } );

        // ball

        var loader = new THREE.OBJLoader( manager );
        loader.load( 'js/ball.obj', function ( object ) {

          object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

              child.material.map = texture;

            }

          } );

          object.position.y = -10;
          scene.add( object );

        }, onProgress, onError );

        //

        renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );

        renderer.setClearColor(0x000000, 0);

        document.addEventListener( 'mousemove', onDocumentMouseMove, false );

        //

        window.addEventListener( 'resize', onWindowResize, false );

      }

      function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

      }

      function onDocumentMouseMove( event ) {

        mouseX = ( event.clientX - windowHalfX ) / 2;
        mouseY = ( event.clientY - windowHalfY ) / 2;

      }

      //

      function animate() {

        requestAnimationFrame( animate );
        render();

      }

      function render() {

        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y += ( - mouseY - camera.position.y ) * .05;

        camera.lookAt( scene.position );

        renderer.render( scene, camera );

      }
