const InlineEmbed = Quill.import('blots/embed');

const emoticonUrls = [
    'images/ro_emote_an.gif',
    'images/ro_emote_dotdotdot.gif',
    'images/ro_emote_eyes.gif',
    'images/ro_emote_gg.gif',
    'images/ro_emote_heh.gif',
    'images/ro_emote_hmm.gif',
    'images/ro_emote_ho.gif',
    'images/ro_emote_kis2.gif',
    'images/ro_emote_lv.gif',
    'images/ro_emote_no1.gif',
    'images/ro_emote_ook.gif',
    'images/ro_emote_questionmark.gif',
    'images/ro_emote_swt.gif',
];

emoticonUrls.forEach((url, index) => {
    class CustomEmoticonBlot extends InlineEmbed {
        static create(value) {
            let node = super.create(value);
            node.setAttribute('src', value);
            return node;
        }
    }

    CustomEmoticonBlot.blotName = `custom-emoticon-${index + 1}`; // Use unique class name
    CustomEmoticonBlot.tagName = 'img';

    Quill.register(CustomEmoticonBlot); // Register the custom blot class
});

function initializeQuill(className) {
    const quill = new Quill(className, {
        theme: 'snow',
        modules: {
            toolbar: generateToolbarConfig(emoticonUrls),
        },
        placeholder: 'Write your reply here...',
        readOnly: false,
    });

    

    function generateToolbarConfig(emoticonUrls) {
        const toolbarConfig = {
            container: [
                [{ 'font': [] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'header': '1'}, { 'header': '2' }, 'blockquote', 'code-block'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
                ['direction', { 'align': [] }],
                ['link', 'image', 'video', 'clean'],
            ],
            handlers: {}
        };
    
        emoticonUrls.forEach((url, index) => {
            const buttonName = `custom-emoticon-${index + 1}`;
            toolbarConfig.container.push([buttonName]);
            toolbarConfig.handlers[buttonName] = function() {
                insertEmoticon(url, index);
            };
        });
    
        return toolbarConfig;
    }

    function insertEmoticon(emoticonUrl, index) {
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, `custom-emoticon-${index + 1}`, emoticonUrl, Quill.sources.USER);
        quill.setSelection(range.index + 1, Quill.sources.SILENT);
    }

    function updateQuillHeight() {
        let editor = document.querySelector('.ql-editor');
        if (editor.scrollHeight <= 1000) { // Adjust the value to match max-height
            editor.style.height = 'auto';
            editor.style.height = editor.scrollHeight + 'px';
        } else {
            editor.style.height = '1000px'; // Set max-height
        }
    }

    quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
        // Loop through all the ops in the delta
        delta.ops.forEach(op => {
            // If the op has an insert property and it's an object
            if (op.insert && typeof op.insert === 'object') {
                // If the insert object has a background property, delete it
                if (op.insert.background) {
                    delete op.insert.background;
                }
            }
            // If the op has attributes
            if (op.attributes) {
                // If the attributes object has a background property, delete it
                if (op.attributes.background) {
                    delete op.attributes.background;
                }
            }
        });
        return delta;
    });

    function addPasteEventListener(quillInstance) {
        const quillContainer = quillInstance.container.querySelector('.ql-editor');
    
        quillContainer.addEventListener('paste', function(event) {
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    
            setTimeout(function() {
                window.scrollTo(0, scrollPosition);
            }, 1);
        });
    }

    // Update Quill container height when content changes
    quill.on('text-change', updateQuillHeight);

    // Initially set Quill container height
    updateQuillHeight();
    addPasteEventListener(quill);

    return quill;
}

// Use the function to initialize Quill on '#editor-container'
const postQuill = initializeQuill('#editor-container');

emoticonUrls.forEach((url, index) => {
    const buttonName = `.ql-custom-emoticon-${index + 1}`;
    const button = document.querySelector(buttonName);
    if (button) {
        button.innerHTML = `<img src="${url}" class="emoji-toolbar-icon">`;
    }
});
