tinymce.PluginManager.add('vectr', function(editor) {
  function showDialog() {
    var vectr = window.Vectr;
    // get current node
    var selectedNode = editor.selection.getNode();

    // check if it is an image
    var isImg = (selectedNode.tagName === 'IMG');

    // check if it is a vectr image
    var isVectr = editor.dom.hasClass(selectedNode, 'vectr');

    var filename = 'new';
    var src = '';

    if (isImg) { // if it is an image we need the src
      src = editor.dom.getAttrib(selectedNode, 'src') || '';

      if (!isVectr) { // if it is not a vectr image
        vectr.once('open', function (error, filename)
        { // wait until it opens and import the image
          vectr.import(src);
        });
      } else { // lets get the user/image part of the url
        var parts = src.split('/').slice(3);
        var user = parts[0];
        // lets remove the extension and join the parts again
        // carefully just in case the image id has dots in it
        var image_id = parts[1].split('.').slice(0,-1).join('.');

        filename = user + '/' + image_id;
      }
    }

    // open vectr
    vectr.open(filename)

    vectr.once('save', function (error, url) {
      if (isImg) { // if it was an image, lets update the src and the class
        editor.dom.setAttrib(selectedNode, 'src', url);
        if (!isVectr) {
          editor.dom.addClass(selectedNode, 'vectr');
        }
      } else { // if not, lets add the element
        editor.selection.collapse(true);
        editor.execCommand('mceInsertContent', false, editor.dom.createHTML('img', {
          src: url,
          'class': 'vectr'
        }));
      }
    });
  }

  function isEditableImage(img) {
    var selectorMatched = editor.dom.is(img, 'img');

    return selectorMatched;
  }

  editor.addCommand('mceVectr', showDialog);

  editor.addButton('vectr', {
    icon: 'vectr',
    tooltip: 'Vectr',
    onclick: showDialog,
    stateSelector: 'a:not([href])'
  });

  editor.addMenuItem('vectr', {
    icon: 'vectr',
    text: 'Vectr',
    context: 'edit',
    onclick: showDialog
  });

  editor.addContextToolbar(
    isEditableImage,
    'vectr'
  );
});