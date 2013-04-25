var dropzone_templ = "<p>Drop images here</p><div class=\"input submit\"><input type=\"file\" multiple=\"multiple\" /></div><button>...or choose file(s)</button>";
var text_tmpl = '<div class="filth" contenteditable="true" />';
var new_item_tmpl ='<div class="add-item"><a href="#">Click to add a new item</a>';

SirTrevor.Blocks.Gallery2 = SirTrevor.Block.extend({ 
  title: "Gallery2",
  className: "gallery2",
  dropEnabled: true,
  editorHTML: "<div class=\"gallery-items\"><p>Gallery Contents:</p><ul></ul></div>",
  dropzoneHTML: dropzone_templ,

  loadData: function(data){

    // Find all our gallery blocks and draw nice list items from it
    if (_.isArray(data)) {
      _.each(data, _.bind(function(item){
        // Create an image block from this
        this.renderGalleryThumb(item);
      }, this));

      // Show the dropzone too
      this.$dropzone.show();
    }
  },

  renderNewItem: function(item){
    var listEl = $('<li>', {
      id: _.uniqueId('gallery-item'),
      class: 'gallery-item'
    });

    var description = $(text_tmpl).text(item.data.text);
    description.on('blur', function() { 
      item.data.text = description.text();
    });

    //description.data('block', item);
    console.log(description);

    this.$$('ul').append(description);

    console.log('new item rendered:', item, description);
  },

  renderGalleryThumb: function(item) {
    console.log(item);   
    if(_.isUndefined(item.data.file)) return false;

    var img = $("<img>", {
      src: item.data.file.thumb.url
    });

    var text = $(text_tmpl).text(item.data.text);
    text.on('blur', function() { 
      item.data.text = text.text();
    });

    console.log(text);

    var list = $('<li>', {
      id: _.uniqueId('gallery-item'),
      class: 'gallery-item',
      html: img
    }).add(text);

    list.append($("<span>", {
      class: 'delete',
      click: _.bind(function(e){
        // Remove this item
        halt(e);

        if (confirm('Are you sure you wish to delete this item?')) {
          $(e.target).parent().remove();
          this.reindexData();
        }
      }, this)
    }));

    list.data('block', item);

    this.$$('ul').append(list);

    // Make it sortable
    //list
    //.dropArea()
    //.bind('dragstart', _.bind(function(ev){
      //var item = $(ev.target);
      //ev.originalEvent.dataTransfer.setData('Text', item.parent().attr('id'));
      //item.parent().addClass('dragging');
    //}, this))

    //.bind('drag', _.bind(function(ev){

    //}, this))

    //.bind('dragend', _.bind(function(ev){
      //var item = $(ev.target);
      //item.parent().removeClass('dragging');
    //}, this))

    //.bind('dragover', _.bind(function(ev){
      //var item = $(ev.target);
      //item.parents('li').addClass('dragover');
    //}, this))

    //.bind('dragleave', _.bind(function(ev){
      //var item = $(ev.target);
      //item.parents('li').removeClass('dragover');
    //}, this))

    //.bind('drop', _.bind(function(ev){

      //var item = $(ev.target),
      //parent = item.parent();

      //item = (item.hasClass('gallery-item') ? item : parent);    

      //this.$$('ul li.dragover').removeClass('dragover');

      //// Get the item
      //var target = $('#' + ev.originalEvent.dataTransfer.getData("text/plain"));

      //if(target.attr('id') === item.attr('id')) return false;

      //if (target.length > 0 && target.hasClass('gallery-item')) {
        //item.before(target);
      //}

      //// Reindex the data
      //this.reindexData();

    //}, this));
  },

  onBlockRender: function(){
    var block = this;

    // We need to setup this block for reordering
    /* Setup the upload button */
    // this.$dropzone.find('button').bind('click', halt);
    this.$dropzone.find('input').on('change', _.bind(function(ev){
      this.onDrop(ev.currentTarget);
    }, this));

    // Add the new item button
    this.$el.prepend(new_item_tmpl);

    $('.add-item').on('click', function(e){
      e.preventDefault();

      block.$editor.show();

      var dataStruct = block.getData();
      var data = { type: 'list-element', data: { text: "" } };

      // Add to our struct
      if (!_.isArray(dataStruct)) {
        dataStruct = [];
      }

      dataStruct.push(data);
      block.setData(dataStruct);

      block.renderNewItem(data);
      block.ready();

      console.log("list item added");
    });
  },

  reindexData: function() {
    var dataStruct = this.getData();
    dataStruct = [];

    _.each(this.$$('li.gallery-item'), function(li){
      li = $(li);
      dataStruct.push(li.data('block'));
    });

    this.setData(dataStruct);
  },

  onDrop: function(transferData){
    if (transferData.files.length > 0) {
      // Multi files 'ere
      var l = transferData.files.length,
      file, urlAPI = (typeof URL !== "undefined") ? URL : (typeof webkitURL !== "undefined") ? webkitURL : null;

      this.loading();
      this.$editor.show();
      var dataStruct = this.getData();
      var data = { type: 'list-element', data: { text: "",  file: { thumb: { url: "https://secure.gravatar.com/avatar/99ad1f17dcf24f066980486d0a494a4f?s=100"} } } };

      // Add to our struct
      if (!_.isArray(dataStruct)) {
        dataStruct = [];
      }

      dataStruct.push(data);
      this.setData(dataStruct);
      this.renderGalleryThumb(data);
      this.ready();
    }
  }

});
