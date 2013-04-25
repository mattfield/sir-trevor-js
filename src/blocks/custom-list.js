var template = '<div class="<%= className %>"><input class="data"></div>';

SirTrevor.Blocks.Custom = SirTrevor.Block.extend({
  title: "Custom",
  className: "custom-list",
  limit: 0,
  editorHTML: function(){
    return _.template(template, this);
  },
  loadData: function(data){
    this.$$('.data').val(data);
  },
  onBlockRender: function(){
    var block = this; 

    this.$el.bind('click', function(){
      console.log(block.$editor);
      block.$editor.append(new SirTrevor.Blocks.Text(block.instance, {}));
    });
  }
});
