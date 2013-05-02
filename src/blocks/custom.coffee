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
  loadData: -> (data)
