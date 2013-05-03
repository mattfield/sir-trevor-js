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
      _.each data, (item) =>
        @renderNewItem item
        @renderGalleryItem item

  renderNewItem: (item) ->

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
      
    this.$$('ul').append listEl

    title = listEl.find('input[name="title"]').val(item.data.title)

    title.on 'blur', =>
      blockData = listEl.data 'block'
      blockData.data.title = $(this).val()
      
      listEl.data('block', blockData)
      @reindexData()

    @descriptionBlur = =>
      blockData = listEl.data 'block'
      blockData.data.text = description.html().toString()

      listEl.data('block', blockData)
      @reindexData()

    listEl.find('.add-description').on 'click', (e) ->
      e.preventDefault()
      tmpl = templates.description

      return if listEl.find('.description')?

      title.after templates.description
      description = listEl.find('.description').text item.data.text

    listEl.find('.add-image').on 'click', (e) ->
      e.preventDefault()

      return if listEl.find('.dropzone').length > 0 or listEl.find('img').length > 0

      listEl.append templates.dropzone

      listEl.find('.dropzone').find('button').bind 'click', halt

      listEl.find('.dropzone input').on 'change', (e) =>
        @onDrop ev.currentTarget, listEl

    listEl.data 'block', item
    @reindexData()

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

    this.$$('ul').sortable
      out: (ev, ui) ->
        $(this).sortable 'refresh'
        @reindexData()
    .on 'click', '.description', ->
      $(this).focus()
      document.execCommand 'insertBrOnReturn', false, true
    .on 'blur', '.description', =>
      @descriptionBlur()

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
   
  reindexData: =>
    struct = @getData()
    struct = []

    _.each this.$$('li.gallery-item'), (li) ->
      li = $(li)
      struct.push li.data 'block'

    @setData struct

  onDrop: (transferData, targetElement, existingData) =>
    if transfer.files.length > 0
      l = transfer.files.length
      file = null
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

  toMarkdown: (markdown) ->
    console.log markdown

