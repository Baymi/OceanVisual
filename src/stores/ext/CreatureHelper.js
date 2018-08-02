
var models = [];
export function removeAll() {
    if (models !== undefined) {
        models.forEach(model => {
            model.removeFrom(earth.features);
        }, this);
    }
    models = [];
}

export function createModel(url, scale, position, RotateZ) {
    // earth.features.remove(model);
    var vec = GeoVis.Vector3.fromDegrees(position[0], position[1], position[2]);
    var modelMatrix = GeoVis.Transforms.eastNorthUpToFixedFrame(vec);
    var hpr = new Engine.HeadingPitchRoll(0.0, Engine.Math.PI_OVER_TWO, 0.0);
    var or = Engine.Transforms.headingPitchRollQuaternion(vec, hpr);
    var model = GeoVis.Model.fromGltf({
        url: url,
        modelMatrix: modelMatrix,
        scale: scale
        // orientation: or
    });
    if (RotateZ == undefined) {
        RotateZ = 0;
    }
    var mm = model.modelMatrix;
    var mm1 = Engine.Matrix3.fromRotationZ(Engine.Math.toRadians(RotateZ));
    Engine.Matrix4.multiplyByMatrix3(mm, mm1, mm);
    model.modelMatrix = mm;
    model.addTo(earth.features);
    models.push(model);
    return model;
}

export function pickModel(event, models, updateId, updatePicktype) {
    var windowPos = event.windowPosition;
    var pickObj = earth.scene.pick(windowPos);
    if (pickObj instanceof GeoVis.Model) {
        document.getElementById("creaturePanel").style.display = "block";
        pickObj.silhouetteColor = GeoVis.Color.fromCssString('#ff0000');  //边框颜色
        pickObj.silhouetteSize = 4;
        // 
        updatePicktype(pickObj.type);
        //边框大小
        console.log(pickObj.id)
        updateId(pickObj.id);

    }
    else {
        models.map(model => {
            model.silhouetteSize = 0;
        });
    }

}
