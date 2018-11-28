$('#image-selector').change(() => {
  let reader = new FileReader();
  reader.onload = () => {
    let dataURL = reader.result;
    $('#selected-image').attr('src', dataURL);
    $('#prediction-list').empty();
  }
  let file = $('#image-selector').prop('files')[0];
  reader.readAsDataURL(file);
});

let model;
(async () => {
  model = await tf.loadModel('http://localhost:3000/tfjs-models/VGG16/model.json');
  $('.progress-bar').hide();
})();

$('#predict-button').click(async () => {
  let image = $("#selected-image").get(0);
  let tensor = tf.fromPixels(image)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .expandDims();
  
  // More pre-processing to be added here later
  
  let predictions = await model.predict(tensor).data();
  let top5 = Array.from(predictions).map((probability, i) => {
    return {
      probability,
      className: IMAGENET_CLASSES[i] 
    };
  }).sort((a,b) => {
    return b.probability - a.probability;
  }).slice(0, 5);

  $('#prediction-list').empty();
  top5.forEach(p => {
    $('#prediction-list').append(`<li>${p.className}: ${p.probability.toFixed(6)}</li>`);
  });

})