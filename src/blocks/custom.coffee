templates =
  title: '<label>Title</label><input maxlength="100" name="title" class="text-block input-string required" type="text"/><div class="buttons"><button href="#" class="add-description">Add Description</button><button href="#" class="add-image">Add Image</button></div>'
  description: '<label>Description</label><div class="description" contenteditable="true" />'
  dropzone: '<div class="dropzone custom-list-block"><p>Drop images here</p><div class=\"input submit\"><input type=\"file\" multiple=\"multiple\" /></div><button>...or choose file(s)</button></div>'
  newItem: '<div class="add-item"><button href="#">Click to add a new item</button></div>'
  src: '<label>Source</label><input type="text" name="source" class="text-block input-string">'
  editor: '<div class=\"gallery-items\"><p>List Contents:</p><ul></ul></div>'

SirTrevor.Blocks.Custom = SirTrevor.Block.extend
  title: 'Custom'
  className: 'custom-list'
  editorHTML: templates.editor
  loadData: (data) ->

    if _.isArray(data)
      _.each data, _.bind((item) ->
        @renderNewItem item
        @renderGalleryItem item
      , this)

  renderNewItem: (item) ->

    listEl = $('<li>',
      id: _.uniqueId 'gallery-item'
      class: 'gallery-item'
      html: templates.title
    )

    listEl.append $('<span>',
      class: 'delete'
      html: 'x'
      click: (e) ->
        halt e
        if confirm('Are you sure you want to delete this item?')
          $(e.target).parent().remove()
          @reindexData()
      )

    this.$$('ul').append listEl

    title = listEl.find('input[name="title"]').val(item.data.title)

    title.on 'blur', =>
      blockData = listEl.data 'block'
      blockData.data.title = $(this).val()
      
      listEl.data('block', blockData)
      @reindexData()
