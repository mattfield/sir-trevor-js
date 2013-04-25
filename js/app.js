(function($, _, window){

  var editor = new SirTrevor.Editor({
    el: $('.sir-trevor'),
    blockTypes: ['Gallery2']
  });

  $('form').on('submit', function(e){
    $('.output').html(editor.$el.val());
    return false;
  });

}(jQuery, _, this));
