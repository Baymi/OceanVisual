	////////////////////////
	/*  ADD ALT  HOTSPOT */
	///////////////////////

		export default  function createAltHotSpot(obj,data){
		
		obj.event_data = data;

		var mat = new THREE.MeshBasicMaterial( {  color:0xff8340, transparent:true , opacity:.6} );
        var hexShape= new THREE.Shape();
		hexShape.moveTo(0,10);
		hexShape.lineTo(9,5);
		hexShape.lineTo(9,-5);
		hexShape.lineTo(0,-10);
		hexShape.lineTo(0,-6);
		hexShape.lineTo(5,-3);
		hexShape.lineTo(5,3);
		hexShape.lineTo(0,6);
		
		var geo = new THREE.ShapeGeometry( hexShape );

		obj.hexSeg1 = new THREE.Mesh( geo, mat  );
		obj.hexSeg2 = new THREE.Mesh( geo, mat  );
		
		obj.add(obj.hexSeg1);
		obj.add(obj.hexSeg2);

		obj.hexSeg1.rotation.z = (Math.PI/180)*-60;
		obj.hexSeg2.rotation.z = (Math.PI/180)*120;
		obj.hexSeg2.position.z =3;



		
		var hexShape3 = new THREE.Shape();
		hexShape3.moveTo(0,10);
		hexShape3.lineTo(9,5);
		hexShape3.lineTo(9,-5);
		hexShape3.lineTo(0,-10);
		hexShape3.lineTo(-9,-5);
		hexShape3.lineTo(-9,5);
		hexShape3.lineTo(0,10);
		//hexShape3.lineTo(9,5);

		var geo = new THREE.ShapeGeometry( hexShape3 );
		var mat = new THREE.LineBasicMaterial( {  linewidth:2, color:0xff8340, transparent:true , opacity:.8} );
		obj.hexSeg3 = new THREE.Line( geo, mat  );
		obj.add(obj.hexSeg3);
		obj.hexSeg3.position.z = 6;
		obj.hexSeg3.position.x = .25;

		obj.hexSeg3.scale.set(1.2,1.2,1.2);		
		

		var mat = new THREE.MeshBasicMaterial( {  color:0xff8340, transparent:true , opacity:.8, side: THREE.DoubleSide} );
        var hexShape4 = new THREE.Shape();
		hexShape4.moveTo(0,10);
		hexShape4.lineTo(9,5);
		hexShape4.lineTo(9,-5);
		hexShape4.lineTo(0,-10);
		hexShape4.lineTo(-9,-5);
		hexShape4.lineTo(-8,-4.5);
		hexShape4.lineTo(0,-9);
		hexShape4.lineTo(8,-4.5);
		hexShape4.lineTo(8,4.5);
		hexShape4.lineTo(0,9);
		//hexShape4.lineTo(0,10);
		
		var geo = new THREE.ShapeGeometry( hexShape4 );

		obj.hexSeg4 = new THREE.Mesh( geo, mat  );
		obj.hexSeg4.scale.set(1.5,1.5,1.5)

		obj.add(obj.hexSeg4);
		
		obj.hexSeg4.position.z = 9;
		obj.hexSeg4.position.x = .4;
		

		// consider rebuilding this as 2 lines later
		// mght be more efficient than a shape??
		var mat = new THREE.LineBasicMaterial( {  linewidth:2, color:0xff8340, transparent:true , opacity:.9} );
		var plus = new THREE.Shape();
		plus.moveTo(0,3);
		plus.lineTo(0,-3);
		plus.moveTo(0,0);
		plus.lineTo(3,0);
		plus.lineTo(-3,0);
		var geo = new THREE.ShapeGeometry( plus );
		obj.plus = new THREE.Line( geo, mat  );
		obj.add(obj.plus);
		obj.plus.position.z = 12;
		obj.plus.position.x = 0;

		// merge to single geo later!!!!
		var mat = new THREE.LineBasicMaterial( {  linewidth:3, color:0xff8340, transparent:true , opacity:.5} );
		var geo = new THREE.Geometry();
	    geo.vertices.push(new THREE.Vector3(0,0,0));
	    geo.vertices.push(new THREE.Vector3(5, 0, 0));
        obj.line = new THREE.Line(geo, mat);
		obj.add(obj.line);
		obj.line.position.z = 9;
		obj.line.position.x = 15;

		obj.line2 = new THREE.Line(geo, mat);
		obj.add(obj.line2);
		obj.line2.position.z = 9;
		obj.line2.position.x = -15;
		obj.line2.rotation.z = (Math.PI/180) * -180;

		obj.line3 = new THREE.Line(geo, mat);
		obj.add(obj.line3);
		obj.line3.position.z = 9;
		obj.line3.position.x = -10;
		obj.line3.position.y = 15;
		obj.line3.rotation.z = (Math.PI/180) * -60;

		obj.line4 = new THREE.Line(geo, mat);
		obj.add(obj.line4);
		obj.line4.position.z = 9;
		obj.line4.position.x = -10;
		obj.line4.position.y = -15;
		obj.line4.rotation.z = (Math.PI/180) * 240;

		/*
    	obj.canvas = document.createElement('canvas');
    	obj.canvas.id = 'canvas1';
		obj.canvas.width = 1024;
		obj.canvas.height = 256;
		obj.context = obj.canvas.getContext('2d');
		obj.context.font = "80px Borda-Bold";
		obj.context.fillStyle = "rgba(255,160,67,1)";
		obj.context.fillText(obj.event_data.title.toUpperCase(), 0, 200);
		obj.context.font = "60px Borda-Bold";
		obj.context.fillText(obj.event_data.date, 10, 100);
		obj.texture = new THREE.Texture(obj.canvas);
		obj.pMat = new THREE.MeshBasicMaterial( { map: obj.texture,  side: THREE.DoubleSide , transparent:true} );
		obj.title = new THREE.Mesh(new THREE.PlaneGeometry(80,20),obj.pMat);
		obj.texture.needsUpdate = true;
		obj.remove(obj.title);
		obj.title.position.x = 56;
		obj.title.position.y = 10;
		obj.add(obj.title);
		obj.canvas = null;
		*/

		// add the big line
		var geo = new THREE.Geometry();
	    geo.vertices.push(new THREE.Vector3(0, 0, 0));
	    geo.vertices.push(new THREE.Vector3(0, 0, 250));
        var mat = new THREE.LineBasicMaterial( { color:0xff8340, transparent:true, opacity:.5} );
        var line = new THREE.Line(geo, mat);
        obj.add(line);


        //attach classes for listners
		obj.userData = {type:"hotspot_target"};
		obj.hexSeg1.userData = {type:"hotspot_target"};
		obj.hexSeg2.userData = {type:"hotspot_target"};
		obj.hexSeg3.userData = {type:"hotspot_target"};
		obj.hexSeg4.userData = {type:"hotspot_target"};

		obj.scale.set(2,2,2);

		
       

        obj.show = function(){
        	if(!showingDetail){
	        	console.log(obj.event_data);
	        	
				addObjectAtLatLng(obj, obj.event_data.lat,obj.event_data.lng,16);
	        	//rotateToLatLng(obj.event_data.lat,obj.event_data.lng, hotspotYOffset );

	        	var tween = new TWEEN.Tween(obj.scale).to({ x:1.5,y:1.5,z:1.5 }, 300).start();
				tween.easing(TWEEN.Easing.Back.InOut);
	        }
        }

        obj.hide = function(){
        	var tween = new TWEEN.Tween(obj.scale).to({ x:.00001,y:.00001,z:.000001 }, 300).start();
			tween.easing(TWEEN.Easing.Back.InOut);
        }


        // add hotspot to clickable collection
        objects.push( obj );


	}
