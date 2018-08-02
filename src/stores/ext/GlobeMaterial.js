


function getElevationContourMaterial() {
    // Creates a composite material with both elevation shading and contour lines
    return new Engine.Material({
        fabric: {
            type: 'ElevationColorContour',
            materials: {
                contourMaterial: {
                    type: 'ElevationContour'
                },
                elevationRampMaterial: {
                    type: 'ElevationRamp'
                }
            },
            components: {
                diffuse: 'contourMaterial.alpha == 0.0 ? elevationRampMaterial.diffuse : contourMaterial.diffuse',
                alpha: 'max(contourMaterial.alpha, elevationRampMaterial.alpha)'
            }
        },
        translucent: false
    });
}

function getSlopeContourMaterial() {
    // Creates a composite material with both slope shading and contour lines
    return new Engine.Material({
        fabric: {
            type: 'SlopeColorContour',
            materials: {
                contourMaterial: {
                    type: 'ElevationContour'
                },
                slopeRampMaterial: {
                    type: 'SlopeRamp'
                }
            },
            components: {
                diffuse: 'contourMaterial.alpha == 0.0 ? slopeRampMaterial.diffuse : contourMaterial.diffuse',
                alpha: 'max(contourMaterial.alpha, slopeRampMaterial.alpha)'
            }
        },
        translucent: false
    });
}

var elevationRamp = [0.0, 0.01, 0.045, 0.1, 0.15, 0.37, 0.54, 0.99, 1.0];
var slopeRamp = [0.0, 0.29, 0.5, Math.sqrt(2)/2, 0.87, 0.91, 1.0];
function getColorRamp(selectedShading) {
    var ramp = document.createElement('canvas');
    ramp.width = 100;
    ramp.height = 1;
    var ctx = ramp.getContext('2d');

    var values = selectedShading === 'elevation' ? elevationRamp : slopeRamp;

    var grd = ctx.createLinearGradient(0, 0, 100, 0);
    grd.addColorStop(values[1], '#00000000'); //black
    grd.addColorStop(values[1], '#000000'); //black
    grd.addColorStop(values[2], '#2747E0'); //blue
    grd.addColorStop(values[3], '#D33B7D'); //pink
    grd.addColorStop(values[4], '#D33038'); //red
    grd.addColorStop(values[5], '#FF9742'); //orange
    grd.addColorStop(values[6], '#ffd700'); //yellow
    grd.addColorStop(values[7], '#ffffff'); //white
    grd.addColorStop(values[7], '#ffffff00'); //white
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 100, 1);

    return ramp;
}

var minHeight = -414.0; // approximate dead sea elevation
var maxHeight = 8777.0; // approximate everest elevation
var contourColor = Engine.Color.RED.clone();
var contourUniforms = {};
var shadingUniforms = {};


function updateMaterial(hasContour= false, selectedShading = 'elevation') {
    var globe = earth.scene.globe;
    var material;
    if (hasContour) {
        if (selectedShading === 'elevation') {
            material = getElevationContourMaterial();
            shadingUniforms = material.materials.elevationRampMaterial.uniforms;
            shadingUniforms.minHeight = minHeight;
            shadingUniforms.maxHeight = maxHeight;
            contourUniforms = material.materials.contourMaterial.uniforms;
        } else if (selectedShading === 'slope') {
            material = getSlopeContourMaterial();
            shadingUniforms = material.materials.slopeRampMaterial.uniforms;
            contourUniforms = material.materials.contourMaterial.uniforms;
        } else {
            material = Engine.Material.fromType('ElevationContour');
            contourUniforms = material.uniforms;
        }
        contourUniforms.width = viewModel.contourWidth;
        contourUniforms.spacing = viewModel.contourSpacing;
        contourUniforms.color = contourColor;
    } else if (selectedShading === 'elevation') {
        material = Engine.Material.fromType('ElevationRamp');
        shadingUniforms = material.uniforms;
        shadingUniforms.minHeight = minHeight;
        shadingUniforms.maxHeight = maxHeight;
    } else if (selectedShading === 'slope') {
        material = Engine.Material.fromType('SlopeRamp');
        shadingUniforms = material.uniforms;
    }
    if (selectedShading !== 'none') {
        shadingUniforms.image = getColorRamp(selectedShading);
    }

    globe.material = material;
}







