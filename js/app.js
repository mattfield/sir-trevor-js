(function($, _, window){

  var editor = new SirTrevor.Editor({
    el: $('.sir-trevor'),
    blockTypes: ['Ul', 'Custom']
  });

  $('form').on('submit', function(e){
    $('.output').html((editor.$el.val()).toString());
    return false;
  });

}(jQuery, _, this));
