(function($, _, window){

  var olTemplate = '<div class="text-block <%= className %>" contenteditable="true"></div>';

  SirTrevor.Blocks.Ol = SirTrevor.Block.extend({
    title: "Ordered List",
    className: "ordered-list",
    editorHTML: function(){
      return _.template(olTemplate, this);
    },
    onBlockRender: function(){
      this.$$('.text-block').bind('click', function(){
        if ($(this).html().length === 0) {
          document.execCommand("insertOrderedList", false, false);
        }
      });

      if (_.isEmpty(this.data)) {
        this.$$('.text-block').focus().click();
      }
    },
    loadData: function(data){
      this.$$('.text-block').html("<ol>" + this.instance._toHTML(data.text, this.type) + "</ol>");
    },
    toMarkdown: function(markdown){
      console.log(markdown);
      return markdown.replace(/<\/li>/mg, "\n")
                     .replace(/<\/?[^>]+(>|$)/g, "")
                     .replace(/^(.+)$/mg, "1. $1");
    },
    toHTML: function(html){
      return html.replace(/^1. (.+)$/mg, "<li>$1</li>");
    }
  });

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
