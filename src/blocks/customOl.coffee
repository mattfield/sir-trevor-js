templates =
  title: '<label>Title</label><input maxlength="100" name="title" class="text-block input-string required" type="text"/><div class="buttons"><button href="#" class="add-description">Add Description</button><button href="#" class="add-image">Add Image</button></div>'
  description: '<label>Description</label><div class="description" contenteditable="true" />'
  dropzone: '<div class="dropzone custom-list-block"><p>Drop images here</p><div class=\"input submit\"><input type=\"file\" multiple=\"multiple\" /></div><button>...or choose file(s)</button></div>'
  newItem: '<div class="add-item"><button href="#">Click to add a new item</button></div>'
  src: '<label>Source</label><input type="text" name="source" class="text-block input-string">'
  editor: '<div class=\"gallery-items\"><p>List Contents:</p><ol></ol></div>'

SirTrevor.Blocks.Listordered = SirTrevor.Block.extend
  title: 'List Ordered'
  className: 'ol-custom-list'
  editorHTML: templates.editor
  toolbarEnabled: true
  loadData: (data) ->
    if _.isArray(data)
      _.each data, (item) =>
        @renderNewItem item
        @renderGalleryItem item

  renderNewItem: (item) ->
    description = undefined

    listEl = $ '<li>',
      id: _.uniqueId 'gallery-item'
      class: 'gallery-item'
      html: templates.title

    listEl.append $ '<span>',
      class: 'delete'
      html: 'x'
      click: (e) =>
        halt e
        if confirm('Are you sure you want to delete this item?')
          $(e.target).parent().remove()
          @reindexData()
      
    this.$$('ol').append listEl

    title = listEl.find('input[name="title"]').val(item.data.title)

    # General data save pattern:
    #
    # Fetch existing data then update associated data property after 
    # passing through instance methods
    title.on 'blur', =>
      item.data.title = title.val()

      blockData = listEl.data 'block'
      blockData.data.title = @instance._toMarkdown title.val(), this.type
      
      listEl.data('block', blockData)
      @reindexData

    @descriptionBlur = (source) =>
      listItem = $(source.srcElement).parent()
      console.log listItem

      blockData = listItem.data 'block'
      blockData.data.text = @instance._toMarkdown $(source.srcElement).html(), this.type

      listItem.data 'block', blockData
      @reindexData

    listEl.find('.add-description').on 'click', (e) ->
      e.preventDefault()
      tmpl = templates.description

      if listEl.find('.description').length > 0
        alert 'You have already created a description for this item'
        return

      title.after templates.description

      # Lazy binding
      description = listEl.find('.description').text item.data.text
      return

    listEl.find('.add-image').on 'click', (e) ->
      e.preventDefault()

      return if listEl.find('.dropzone').length > 0 or listEl.find('img').length > 0

      listEl.append templates.dropzone

      listEl.find('.dropzone').find('button').bind 'click', halt

      listEl.find('.dropzone input').on 'change', (e) ->
        _this.onDrop e.currentTarget, listEl

    listEl.data 'block', item
    @reindexData()

  # `targetElement` represents which list item the image should be attached to
  renderGalleryThumb: (item, targetElement) ->
    return false if _.isUndefined item.data.image.url

    img = $ '<img>',
      src: item.data.image.url

    imgWrapper = $ '<div>',
      class: 'imgWrapper'
      html: '<label>Image</label>'
    .append img

    targetElement.data 'block', item
    targetElement.append imgWrapper
    @reindexData()

  onBlockRender: ->
    this.$el.prepend templates.newItem

    this.$$('ol').sortable
      out: (ev, ui) ->
        $(this).sortable 'refresh'
        _this.reindexData()
    # `sortable` hijacks the `click` event...
    .on 'click', '.description', ->
      $(this).focus()
    # ...and the `blur` event too
    .on 'blur', '.description', (e) =>
      @descriptionBlur(e)

    $('.add-item').on 'click', (e) =>
      e.preventDefault()

      this.$editor.show()

      struct = @getData()
      data =
        type: 'list-element'
        data:
          title: ''
          text: ''
          image:
            url: ''
            source: ''

      struct = [] if !_.isArray struct

      struct.push data
      @setData struct

      @renderNewItem data
    return
   
  reindexData: ->
    struct = this.getData()
    struct = []

    _.each this.$$('li.gallery-item'), (li) ->
      li = $(li)
      struct.push li.data 'block'

    @setData struct

  onDrop: (transferData, targetElement, existingData) ->
    if transferData.files.length > 0
      l = transferData.files.length
      file = undefined
      urlAPI = (if (typeof URL isnt 'undefined') then URL else (if (typeof webkitURL isnt 'undefined') then webkitURL else null))

      origData = targetElement.data 'block'

      @loading()
      this.$editor.show()

      struct = @getData()
      data =
        type: 'list-element'
        data:
          title: origData.data.title
          text: origData.data.text
          image:
            url: 'https://secure.gravatar.com/avatar/99ad1f17dcf24f066980486d0a494a4f?s=100'
            source: ''

      $('.dropzone').remove()

      struct = data
      @setData struct
      @renderGalleryThumb data, targetElement
      @ready()

      targetElement.find('.imgWrapper').append templates.src
      source = targetElement.find 'input[name="source"]'

      source.on 'blur', (e) =>
        blockData = targetElement.data 'block'
        blockData.data.image.source = source.val()

        targetElement.data 'block', blockData
        @reindexData()
