var olTemplate = '<div class="<%= className %>">' + 
  '<div class="input text"><label>Title</label>' + 
    '<input maxlength="100" name="title" class="title input-string" type="text"/>' + 
  '</div>' +
  '<div class="input text"><label>Description</label>' + 
    '<div class="text-block description" contenteditable="true" name="description"></div>' +
  '</div>' +
  '<textarea class="media"></textarea>' +
  '</div>';

SirTrevor.Blocks.Ol = SirTrevor.Block.extend({
  title: "Ordered List",
  className: "ordered-list",
  limit: 0,
  editorHTML: function(){
    return _.template(olTemplate, this);
  },
  onBlockRender: function(){
    var block = this; 

    this.$$('.description').bind('click', function(){
      if ($(this).html().length === 0) {
        document.execCommand("insertOrderedList", false, false);
      }

      // Creates a new block
      // block.$el.append(block.instance.createBlock('Text', {}));
    });

  },
  loadData: function(data){},
  toMarkdown: function(markdown){
    return markdown.replace(/<\/li>/mg, "\n")
                   .replace(/<\/?[^>]+(>|$)/g, "")
                   .replace(/^(.+)$/mg, "1. $1");
  }
});
