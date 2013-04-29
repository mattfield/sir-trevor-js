var dropzone_templ = "<p>Drop images here</p><div class=\"input submit\"><input type=\"file\" multiple=\"multiple\" /></div><button>...or choose file(s)</button>";
var title_tmpl = '<label>Title</label><input maxlength="100" name="title" class="text-block input-string required" type="text"/><a href="#" class="add-description">Add Description</a><a href="#" class="add-media">Add Media</a>';
var description_tmpl = '<label>Description</label><div class="description" contenteditable="true" />';
var new_item_tmpl ='<div class="add-item"><a href="#">Click to add a new item</a></div>';

SirTrevor.Blocks.Custom = SirTrevor.Block.extend({ 
  title: "Custom",
  className: "custom-list",
  dropEnabled: true,
  editorHTML: "<div class=\"gallery-items\"><p>List Contents:</p><ul></ul></div>",
  dropzoneHTML: null,

  loadData: function(data){

    // Find all our gallery blocks and draw nice list items from it
    if (_.isArray(data)) {
      _.each(data, _.bind(function(item){
        this.renderNewItem(item);
        this.renderGalleryThumb(item);
      }, this));

      // Show the dropzone too
      this.$dropzone.show();
    }

  },

  renderNewItem: function(item){
    var block = this;

    var listEl = $('<li>', {
      id: _.uniqueId('gallery-item'),
      class: 'gallery-item',
      html: title_tmpl
    });

    this.$$('ul').append(listEl);

    var title = listEl.find('input[name="title"]').val(item.data.title);
    var description = listEl.find('.description').text(item.data.text);

    title.on('blur', function() { 
      item.data.title = title.val();

      listEl.data('block', item);
      block.reindexData();
    });

    this.descriptionBlur = function(){
      console.log(description.text());
      item.data.text = description.text();
      console.log(item.data.text, description.text())

      listEl.data('block', item);
      block.reindexData();
    };

    this.$$('.add-description').on('click', function(e){
      e.preventDefault();
      var tmpl = description_tmpl;
      title.after(description_tmpl);
    });

    listEl.data('block', item);
    this.reindexData();
  },

  renderGalleryThumb: function(item) {
    if(_.isUndefined(item.data.file)) return false;

    var img = $("<img>", {
      src: item.data.file.thumb.url
    });

    var list = $('<li>', {
      id: _.uniqueId('gallery-item'),
      class: 'gallery-item',
      html: img
    });

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
  },

  onBlockRender: function(){
    var block = this;

    /* Setup the upload button */
    // this.$dropzone.find('button').bind('click', halt);
    this.$dropzone.find('input').on('change', _.bind(function(ev){
      this.onDrop(ev.currentTarget);
    }, this));

    // Add the new item button
    this.$el.prepend(new_item_tmpl);

    this.$$('ul').sortable({
      out: function(ev, ui){
        $(this).sortable("refresh");
        block.reindexData();
      }
      // `sortable` hijacks the click event
    }).on('click', '.description', function(){
      $(this).focus();
      block.reindexData();
      // ...and the blur event
    }).on('blur', '.description', function(){
      block.descriptionBlur();
    });

    $('.add-item').on('click', function(e){
      e.preventDefault();

      block.$editor.show();

      var dataStruct = block.getData();
      var data = { type: 'list-element', data: { title: "", text: "" } };

      // Add to our struct
      if (!_.isArray(dataStruct)) {
        dataStruct = [];
      }

      dataStruct.push(data);
      block.setData(dataStruct);

      block.renderNewItem(data);
      block.ready();
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
      var data = { type: 'list-element', data: { file: { thumb: { url: "https://secure.gravatar.com/avatar/99ad1f17dcf24f066980486d0a494a4f?s=100"} } } };

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
