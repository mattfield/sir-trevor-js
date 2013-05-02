var dropzone_tmpl = "<div class='dropzone custom-list-block'><p>Drop images here</p><div class=\"input submit\"><input type=\"file\" multiple=\"multiple\" /></div><button>...or choose file(s)</button></div>";
var title_tmpl = '<label>Title</label><input maxlength="100" name="title" class="text-block input-string required" type="text"/><div class="buttons"><button href="#" class="add-description">Add Description</button><button href="#" class="add-image">Add Image</button></div>';
var description_tmpl = '<label>Description</label><div class="description" contenteditable="true" />';
var new_item_tmpl ='<div class="add-item"><button href="#">Click to add a new item</button></div>';
var src_tmpl = '<label>Source</label><input type="text" name="source" class="text-block input-string">';

SirTrevor.Blocks.Custom = SirTrevor.Block.extend({ 
  title: "Custom",
  className: "custom-list",
  editorHTML: "<div class=\"gallery-items\"><p>List Contents:</p><ul></ul></div>",

  loadData: function(data){
    // Find all our gallery blocks and draw nice list items from it
    if (_.isArray(data)) {
      _.each(data, _.bind(function(item){
        this.renderNewItem(item);
        this.renderGalleryThumb(item);
      }, this));
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
    var source;

    title.on('blur', function() { 
      //item.data.title = title.val();

      var blockData = listEl.data('block');
      blockData.data.title = title.val();

      listEl.data('block', blockData);
      block.reindexData();
    });

    this.descriptionBlur = function(){
      //item.data.text = description.text();

      var blockData = listEl.data('block');
      blockData.data.text = description.html().toString();

      listEl.data('block', blockData);
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
        alert("You're already in the process of adding an image! Cheeky.");
        return;
      } else if (listEl.find('img').length > 0) {
        alert("Only one image per list item, please! Move along!.");
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
    if(_.isUndefined(item.data.image.url)) return false;

    var img = $("<img>", {
      src: item.data.image.url
    });

    var imgWrapper = $("<div>", {
      class: 'imgWrapper',
      html: '<label>Image</label>'
    }).append(img);

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
      document.execCommand("insertBrOnReturn", false, true);
      // ...and the blur event
    }).on('blur', '.description', function(){
      block.descriptionBlur();
    });

    $('.add-item').on('click', function(e){
      e.preventDefault();

      block.$editor.show();

      var dataStruct = block.getData();
      var data = { type: 'list-element', data: { title: "", text: "", image: { url: "", source: "" } } };

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
    var block = this;

    if (transferData.files.length > 0) {
      // Multi files 'ere
      var l = transferData.files.length,
      file, urlAPI = (typeof URL !== "undefined") ? URL : (typeof webkitURL !== "undefined") ? webkitURL : null;

      var origData = targetElement.data('block');

      this.loading();
      this.$editor.show();
      var dataStruct = this.getData();
      data = { type: 'list-element', data: { title: origData.data.title, text: origData.data.text, image: { url: "https://secure.gravatar.com/avatar/99ad1f17dcf24f066980486d0a494a4f?s=100", source: "" } } };

      $('.dropzone').remove();
      dataStruct = data;
      this.setData(dataStruct);
      this.renderGalleryThumb(data, targetElement);
      this.ready();

      targetElement.find('.imgWrapper').append(src_tmpl);
      source = targetElement.find('input[name="source"]');

      source.on('blur', function(e){
        var blockData = targetElement.data('block');
        blockData.data.image.source = source.val();

        targetElement.data('block', blockData);
        block.reindexData();
      });
    }
  },
  toMarkdown: function(markdown){
    console.log(markdown);
  }

});
