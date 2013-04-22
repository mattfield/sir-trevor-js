(function($, _, window){

  var editor = new SirTrevor.Editor({
    el: $('.sir-trevor'),
    blockTypes: ['Text', 'Quote', 'Tweet', 'Image', 'Ul', 'Ol']
  });

  $('form').on('submit', function(e){
    e.preventDefault();

    $('.output').html(editor.$el.val());

    return false;
  });

}(jQuery, _, this));
