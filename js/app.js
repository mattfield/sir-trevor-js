(function($, _, window){

  var editor = new SirTrevor.Editor({
    el: $('.sir-trevor'),
    blockTypes: ['Custom']
  });

  $('form').on('submit', function(e){
    $('.output').html(editor.$el.val());
    console.log(editor.$el.val());
    return false;
  });

}(jQuery, _, this));
