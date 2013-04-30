var dropzone_tmpl = "<div class='dropzone custom-list-block'><p>Drop images here</p><div class=\"input submit\"><input type=\"file\" multiple=\"multiple\" /></div><button>...or choose file(s)</button></div>";
var title_tmpl = '<label>Title</label><input maxlength="100" name="title" class="text-block input-string required" type="text"/><div class="buttons"><button href="#" class="add-description">Add Description</button><button href="#" class="add-image">Add Image</button></div>';
var description_tmpl = '<label>Description</label><div class="description" contenteditable="true" />';
var new_item_tmpl ='<div class="add-item"><button href="#">Click to add a new item</button></div>';

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
      //this.$dropzone.show();
    }

  },

  renderNewItem: function(item){
    var block = this;

    var listEl = $('<li>', {
      id: _.uniqueId('gallery-item'),
      class: 'gallery-item',
      html: title_tmpl
    });

    listEl.append($("<span>", {
      class: 'delete',
      html: 'x',
      click: _.bind(function(e){
        // Remove this item
        halt(e);

        if (confirm('Are you sure you wish to delete this item?')) {
          $(e.target).parent().remove();
          this.reindexData();
        }
      }, this)
    }));

    this.$$('ul').append(listEl);

    var title = listEl.find('input[name="title"]').val(item.data.title);
    var description;

    title.on('blur', function() { 
      item.data.title = title.val();

      listEl.data('block', item);
      block.reindexData();
    });

    this.descriptionBlur = function(){
      item.data.text = description.text();

      listEl.data('block', item);
      block.reindexData();
    };

    listEl.find('.add-description').on('click', function(e){
      e.preventDefault();
      var tmpl = description_tmpl;

      if (listEl.find('.description').length > 0) {
        alert('You have already added a description to this item.');
        return;
      }

      title.after(description_tmpl);
      description = listEl.find('.description').text(item.data.text);
    });

    listEl.find('.add-image').on('click', function(e){
      e.preventDefault();

      if (listEl.find('.dropzone').length > 0) {
        alert("You're already in the process of adding an image! Greedy.");
        return;
      }

      listEl.append(dropzone_tmpl);

      listEl.find('.dropzone').find('button').bind('click', halt);

      listEl.find('.dropzone input').on('change', _.bind(function(ev){
        block.onDrop(ev.currentTarget, listEl);
      }, this));
    });

    listEl.data('block', item);
    this.reindexData();
  },

  renderGalleryThumb: function(item, targetElement) {
    if(_.isUndefined(item.data.image)) return false;

    var img = $("<img>", {
      src: item.data.image
    });

    var imgWrapper = $("<div>", {
      html: '<label>Image</label>'
    }).add(img);

    //targetElement.append($("<span>", {
      //class: 'delete',
      //click: _.bind(function(e){
        //// Remove this item
        //halt(e);

        //if (confirm('Are you sure you wish to delete this item?')) {
          //$(e.target).parent().remove();
          //this.reindexData();
        //}
      //}, this)
    //}));

    targetElement.data('block', item);

    targetElement.append(imgWrapper);
    this.reindexData();
  },

  onBlockRender: function(){
    var block = this;

    /* Setup the upload button */

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
      // ...and the blur event
    }).on('blur', '.description', function(){
      block.descriptionBlur();
    });

    $('.add-item').on('click', function(e){
      e.preventDefault();

      block.$editor.show();

      var dataStruct = block.getData();
      var data = { type: 'list-element', data: { title: "", text: "", image: "" } };

      // Add to our struct
      if (!_.isArray(dataStruct)) {
        dataStruct = [];
      }

      dataStruct.push(data);
      block.setData(dataStruct);

      block.renderNewItem(data);
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

  onDrop: function(transferData, targetElement, existingData){
    if (transferData.files.length > 0) {
      // Multi files 'ere
      var l = transferData.files.length,
      file, urlAPI = (typeof URL !== "undefined") ? URL : (typeof webkitURL !== "undefined") ? webkitURL : null;

      var origData = targetElement.data('block');

      this.loading();
      this.$editor.show();
      var dataStruct = this.getData();
      var data = { type: 'list-element', data: { title: origData.data.title, text: origData.data.text, image: "https://secure.gravatar.com/avatar/99ad1f17dcf24f066980486d0a494a4f?s=100" } };

      $('.dropzone').remove();
      dataStruct.push(data);
      this.setData(dataStruct);
      this.renderGalleryThumb(data, targetElement);
      this.ready();
    }
  }

});
