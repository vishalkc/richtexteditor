import { Component, OnInit } from '@angular/core';
//import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import ClassicEditor from '../../build/ckeditor';
import Mention from '../../build/ckeditor';
import MentionCustomization from '../../build/ckeditor';
//import Mention from '@ckeditor/ckeditor5-mention/src/mention';
//const BalloonEditor = require( '@ckeditor/ckeditor5-build-balloon' );
//import { BalloonEditor, Mention } from '@ckeditor/ckeditor5-build-balloon/build/ckeditor';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  constructor() {}
  ngOnInit() {
    ClassicEditor
        .create( document.querySelector( '#editor' ) , {
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
          heading: {                
              options: [
                  { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                  { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                  { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
              ]
          }
      } )
        .then(editor =>{        
          editor.keystrokes.set( 'Ctrl+d', ( data, stop ) => {            
            editor.model.change( writer =>{
              let root = editor.model.document.getRoot();
              let child = editor.model.document.getRoot().getChild(0);
              //let paragraph = writer.createElement( 'paragraph' );
              writer.appendText( 'ǂ', child );
              writer.append( child, root );
              //console.log(root.getChild(0));
              //console.log(root.getChild(1));
              //console.log(root.getChild(2));
              //writer.setSelectionFocus(root, 0);
              //writer.setSelection( root, 'in' );
            });
            //console.log( editor.data );
            stop(); // Works like data.preventDefault() + evt.stop()
        } );
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
    editor.conversion.for( 'downcast' ).attributeToElement( {
        model: 'mention',
        view: ( modelAttributeValue, viewWriter ) => {
            // Do not convert empty attributes (lack of value means no mention).
            if ( !modelAttributeValue ) {
                return;
            }

            return viewWriter.createAttributeElement( 'a', {
                class: 'mention',
                'data-mention': modelAttributeValue.id,
                'data-user-id': modelAttributeValue.userId,
                'href': modelAttributeValue.link
            } );
        },
        converterPriority: 'high'
    } );
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
            console.log(items);
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
    const itemElement = document.createElement( 'span' );

    // itemElement.classList.add( 'custom-item' );
    // itemElement.id = `mention-list-item-id-${ item.userId }`;
    // itemElement.textContent = `${ item.name } `;

    const usernameElement = document.createElement( 'span' );

    usernameElement.classList.add( 'custom-item' );
    usernameElement.textContent = item.name;

    itemElement.appendChild(usernameElement);

    return itemElement;
}
  

}