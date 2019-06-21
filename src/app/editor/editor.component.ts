import { Component, OnInit } from '@angular/core';
//import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import ClassicEditor from '../../build/ckeditor';
//import Mention from '@ckeditor/ckeditor5-mention/src/mention';
//const BalloonEditor = require( '@ckeditor/ckeditor5-build-balloon' );
//import { BalloonEditor, Mention } from '@ckeditor/ckeditor5-build-balloon/build/ckeditor';
declare global {
    interface Window { MyNamespace: any; }
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  
  constructor() {}
  ngOnInit() {
        window.MyNamespace = window.MyNamespace || {};
        this.InitializeEditor('#editor');
        this.InitializeEditor('#editor1');
  }

  InitializeEditor(id: string){
    ClassicEditor
    .create( document.querySelector( id ) , {
        extraPlugins: [this.MentionCustomization],
        mention: {
        feeds: [
          {
            marker: 'ǂ',
            feed: this.getFeedItems,//[ '@a - Corporate Name', '@b - Subordinate Unit', '@c - Location of meeting' ],
            minimumCharacters: 0,
            itemRenderer: this.customItemRenderer
          }
        ]
      },
    //   heading: {                
    //       options: [
    //           { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
    //           { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
    //           { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
    //       ]
    //   }
  } )
    .then(editor =>{        
        CKEditorInspector.attach( editor );   
        
        // editor.editing.view.document.on( 'keydown', ( evt, data ) => {
        //     console.log('Tab Clicked');
        //     //console.log(data.domTarget.childNodes);
        //    // console.log(editor.data.get( { rootName: 'root' } ));
        //     data.preventDefault(); 
        //     evt.stop();
        // });    

        editor.keystrokes.set( 'Ctrl+d', ( data, stop ) => {   
              
            editor.model.change( writer =>{
            //new MentionCustomization(editor);
          let root = editor.model.document.getRoot();
          let child = editor.model.document.getRoot().getChild(0);
          console.log('start');
          //console.log(editor.model.document.getRoot().getChild(0).getAttributes());
          console.log('end');
          //let paragraph = writer.createElement( 'paragraph' );
          writer.appendText( 'ǂ', child );
          writer.append( child, root );
          //var result = data.filter((item)=>{
            //console.log(data);
            //return item.name === 'rest';
         // });
          
          //console.log(root.getChild(1));
          //console.log(root.getChild(2));
          //writer.setSelectionFocus(root, 0);
          //writer.setSelection( root, 'in' );
        });
        //console.log( editor.data );
        stop(); // Works like data.preventDefault() + evt.stop()
    } );
    
    
    editor.keystrokes.set( 'tab', ( data, stop ) => {
        let view = editor.data.processor.toView(editor.model.document.getRoot());
        stop();
        //console.log(view);
        editor.model.change( writer =>{
            var startPosition = editor.model.createPositionFromPath(editor.model.document.getRoot().getChild(0),[0]);
            let nextTextNode = startPosition.getShiftedBy(1).textNode.nextSibling;
            if(nextTextNode === null)
            return;
            //console.log(editor.model.document.selection.anchor.getShiftedBy(1).textNode);
            if(editor.model.document.selection.anchor.textNode!==null){
                let nextTextNode = editor.model.document.selection.anchor.textNode.nextSibling;
                if( nextTextNode!==null){
                    
                    if(nextTextNode.hasAttribute("mention"))
                    {
                        var start = nextTextNode.startOffset;
                        var end = nextTextNode.endOffset;
                        var path = nextTextNode.getPath();
                    //console.log(`${start}-${end}-${path}`);
        
                    writer.setSelection(nextTextNode,'after')
                    }
                }
                else{
                    console.log(editor.model.createPositionFromPath(editor.model.document.getRoot().getChild(0),[0]));
                            var startPosition = editor.model.createPositionFromPath(editor.model.document.getRoot().getChild(0),[0]);
                            let nextTextNode = startPosition.getShiftedBy(1).textNode.nextSibling;
                            console.log(nextTextNode);
                            writer.setSelection(nextTextNode,'after')
                }
            }
            else{
                //let rootLastOffset = editor.model.document.getRoot().lastOffset;
                let isAtEnd = editor.model.document.selection.anchor.isAtEnd;
                //var result = currentPosition.compareWith(lastPosition);
                console.log(`result:::: ${isAtEnd}`);    
                let nextTextNode = null;
                
                if(!isAtEnd)
                    nextTextNode = editor.model.document.selection.anchor.getShiftedBy(1).textNode;
                

                if( nextTextNode!==null){
                    
                    if(nextTextNode.hasAttribute("mention"))
                    {
                        var start = nextTextNode.startOffset;
                    var end = nextTextNode.endOffset;
                    var path = nextTextNode.getPath();
                    //console.log(`${start}-${end}-${path}`);
        
                    writer.setSelection(nextTextNode,'after')
                    }
                    else{
                        nextTextNode = editor.model.document.selection.anchor.getShiftedBy(1).textNode.nextSibling;
                        if( nextTextNode!==null){
                        
                            if(nextTextNode.hasAttribute("mention"))
                            {
                                var start = nextTextNode.startOffset;
                            var end = nextTextNode.endOffset;
                            var path = nextTextNode.getPath();
                            //console.log(`${start}-${end}-${path}`);
                
                            writer.setSelection(nextTextNode,'after')
                            }
                        }
                        else{
                            console.log(editor.model.createPositionFromPath(editor.model.document.getRoot().getChild(0),[0]));
                            var startPosition = editor.model.createPositionFromPath(editor.model.document.getRoot().getChild(0),[0]);
                            let nextTextNode = startPosition.getShiftedBy(1).textNode.nextSibling;
                            console.log(nextTextNode);
                            writer.setSelection(nextTextNode,'after')
                        }
                    }
                }
                else{
                     console.log(editor.model.createPositionFromPath(editor.model.document.getRoot().getChild(0),[0]));
                            var startPosition = editor.model.createPositionFromPath(editor.model.document.getRoot().getChild(0),[0]);
                            let nextTextNode = startPosition.getShiftedBy(1).textNode.nextSibling;
                            console.log(nextTextNode);
                            writer.setSelection(nextTextNode,'after')
                }
            }
            
                
            // console.log(editor.model.createPositionByPath(editor.model.document.getRoot(),[0]))
            //                 var startPosition = editor.model.createPositionByPath(editor.model.document.getRoot(),[0])
            //                 let nextTextNode = startPosition.textNode.nextSibling;
            //                 if( nextTextNode!==null){
                            
            //                     if(nextTextNode.hasAttribute("mention"))
            //                     {
            //                         var start = nextTextNode.startOffset;
            //                     var end = nextTextNode.endOffset;
            //                     var path = nextTextNode.getPath();
            //                     //console.log(`${start}-${end}-${path}`);
                    
            //                     writer.setSelection(nextTextNode,'after')
            //                     }
            //                 }
            
            
            //writer.setSelectionFocus(editor.model.document.selection.anchor.textNode.nextSibling,'after');
            //writer.
            //var element:any = document.getElementsByClassName("mention")[0];
            //var range = writer.createRange(start, end);
            //var ele = editor.plugins.get( 'Mention' ).toMentionAttribute( element, { userId: '1' } );  
            //var position = writer.createPositionAt(editor.model.document.getRoot().getChild(0));
            //console.log(editor.ui.inputtext);
             //if(element) {
            //     element.scrollIntoView();
            //     //console.log(editor.view.position);
            //     //range = writer.createRange(editor.model.document.getRoot().getNodeByPath(0),'before');
            //     //console.log(range);
            //     //range.moveToPosition(element, editor.POSITION_AFTER_START);
            //     //editor.getSelection().selectRanges([range]);
                 //console.log(editor.view);
            //     console.log(editor.model.document.getRoot().getChild(0).nextSibling);
            //     console.log(editor.model.document.getRoot().getChild(0).getNodeByPath( [ 0 ] ));
            //     range = writer.createRangeIn(editor.model.document.getRoot().getChild(0))
            //     console.log(range);
            //     writer.setSelectionFocus(range.start);
            // }
            
        });
        //console.log(editor.model.document.selection.getFirstPosition());
        //console.log(editor.model.document.getRoot().getChild(0).getChild(0));
        //console.log(editor.model.document.getRoot().getChild(0));
        //console.log(editor.model.document.getRoot().getChild(0).getPath());
        //var element = document.getElementsByClassName("mention")[0];
        //var list = document.getElementById('mention-list-item-id-1');
        // var range;
        // if(element) {
        //     element.scrollIntoView();

        //     // Thank you S/O
        //     // http://stackoverflow.com/questions/16835365/set-cursor-to-specific-position-in-ckeditor
        //     console.log(element);
        //     //range = editor.view.createPositionAfter(editor.model.document.getRoot().getChild(0));
        //     //range.moveToPosition(element, editor.POSITION_AFTER_START);
        //     //editor.getSelection().selectRanges([range]);
        // }
        // stop();
        // editor.model.change( writer =>{
        //     console.log('Tab Clicked');
            
        //     console.log(data.domTarget.childNodes[0].childNodes[1].path);
        //     stop();
        // })
    });          
        
      //editor.execute( 'mention', { marker: '@', mention: '@John' } );
      //console.log(editor.config);
      //console.log(editor.config.get( 'toolbar' ));
    })
    .catch( (error: any) => {
        console.error( error );
    } );

  }

  MentionCustomization( editor ): void {
    // The upcast converter will convert <a class="mention" href="" data-user-id="">
    // elements to the model 'mention' attribute.
    editor.conversion.for( 'upcast' ).elementToAttribute( {
        view: {
            name: 'a',
            key: 'data-mention',
            classes: 'mention',
            attributes: {
                href: true,
                'data-user-id': true
            }
        },
        model: {
            key: 'mention',
            value: viewItem => {
                // The mention feature expects that the mention attribute value
                // in the model is a plain object with a set of additional attributes.
                // In order to create a proper object, use the toMentionAttribute helper method:
                const mentionAttribute = editor.plugins.get( 'Mention' ).toMentionAttribute( viewItem, {
                    // Add any other properties that you need.
                    link: viewItem.getAttribute( 'href' ),
                    userId: viewItem.getAttribute( 'data-user-id' )
                } );

                return mentionAttribute;
            }
        },
        converterPriority: 'high'
    } );

    // Downcast the model 'mention' text attribute to a view <a> element.
    // editor.conversion.for( 'downcast' ).attributeToElement( {
    //     model: 'mention',
    //     view: ( modelAttributeValue, viewWriter ) => {
    //         // Do not convert empty attributes (lack of value means no mention).
    //         if ( !modelAttributeValue ) {
    //             return;
    //         }

    //         return viewWriter.createAttributeElement( 'a', {
    //             class: 'mention',
    //             'data-mention': modelAttributeValue.id,
    //             'data-user-id': modelAttributeValue.userId,
    //             'href': modelAttributeValue.link
    //         } );
    //     },
    //     converterPriority: 'high'
    // } );
}



getFeedItems( queryText ): Promise<any> {
    // As an example of an asynchronous action, return a promise
    // that resolves after a 100ms timeout.
    // This can be a server request or any sort of delayed action.
    return new Promise( resolve => {
        setTimeout( () => {
          let items = [
            { id: 'ǂa', userId: '1', name: 'a - Barney Stinson', link: 'https://www.imdb.com/title/tt0460649/characters/nm0000439' },
            { id: 'ǂb', userId: '2', name: 'b - Lily Aldrin', link: 'https://www.imdb.com/title/tt0460649/characters/nm0004989' },
            { id: 'ǂc', userId: '3', name: 'c - Marshall Eriksen', link: 'https://www.imdb.com/title/tt0460649/characters/nm0781981' },
            { id: 'ǂd', userId: '4', name: 'd - Robin Scherbatsky', link: 'https://www.imdb.com/title/tt0460649/characters/nm1130627' },
            { id: 'ǂe', userId: '5', name: 'e - Ted Mosby', link: 'https://www.imdb.com/title/tt0460649/characters/nm1102140' }
        ];
            //console.log(items);
            const itemsToDisplay = items
                // Filter out the full list of all items to only those matching the query text.
                .filter( isItemMatching )
                // Return 10 items max - needed for generic queries when the list may contain hundreds of elements.
                .slice( 0, 10 );

            resolve( itemsToDisplay );
        }, 100 );
    } );

    // Filtering function - it uses `name` and `username` properties of an item to find a match.
    function isItemMatching( item ) {
        // Make the search case-insensitive.
        const searchString = queryText.toLowerCase();

        // Include an item in the search results if name or username includes the current user input.
        return (
            item.name.toLowerCase().includes( searchString ) ||
            item.id.toLowerCase().includes( searchString )
        );
    }
}

customItemRenderer( item ): HTMLSpanElement {
    const itemElement = document.createElement( 'p' );

     itemElement.classList.add( 'custom-item' );
     itemElement.id = `mention-list-item-id-${ item.userId }`;
     itemElement.textContent = `${ item.name } `;

    const usernameElement = document.createElement( 'span' );
    usernameElement.classList.add( 'custom-item' );
    //usernameElement.textContent = item.name;
    //usernameElement.id = `mention-list-item-id-${ item.userId }`
    itemElement.appendChild(usernameElement);

    return itemElement;
}
  

}