import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'edittext';
  valueInnerHTML = '';

  editor:any;
  toolbar:any;
  buttons:any;
  contentArea:any;
  visuellView:any;
  htmlView:any;
  modal:any;

  ngOnInit(): void {
    this.editor = document.getElementsByClassName('wp-webdeasy-comment-editor')[0];
    this.toolbar = this.editor.getElementsByClassName('toolbar')[0];
    this.buttons = this.toolbar.querySelectorAll('.editor-btn:not(.has-submenu)');
    this.contentArea = this.editor.getElementsByClassName('content-area')[0];
    this.visuellView = this.contentArea.getElementsByClassName('visuell-view')[0];
    this.htmlView = this.contentArea.getElementsByClassName('html-view')[0];
    this.modal = document.getElementsByClassName('modal')[0];

    this.visuellView.addEventListener('DOMSubtreeModified',()=>{
      this.valueInnerHTML = this.visuellView.innerHTML
    });

    for(let i = 0; i < this.buttons.length; i++) {
      let button = this.buttons[i];

      button.addEventListener('click', (e:any) => {
        const action = button.attributes.getNamedItem('data-action')?.value;
        switch(action) {
          case 'toggle-view':
            this.execCodeAction(button,this.editor);
            break;
          case 'createLink':
            this.execLinkAction();
            break;
          case 'font-size':
            const valueFont = button.attributes.getNamedItem('value-font')?.value;
            console.log(valueFont);
            this.changeFontSize(valueFont);
            break;
          default:
            this.execDefaultAction(action);
        }

      });
    }
  }



  changeFontSize(value:any){
    console.log('AQUI');
    document.execCommand('fontSize', false,'6');
  }

  execCodeAction(button:any, editor:any) {
    if(button.classList.contains('active')) { // show visuell view
      this.visuellView.innerHTML = this.htmlView.value;
      this.htmlView.style.display = 'none';
      this.visuellView.style.display = 'block';

      button.classList.remove('active');
    } else {  // show html view
      this.htmlView.innerText = this.visuellView.innerHTML;
      this.visuellView.style.display = 'none';
      this.htmlView.style.display = 'block';

      button.classList.add('active');
    }
  }

  execLinkAction() {
    this.modal.style.display = 'block';
    let selection = this.saveSelection();

    let submit = this.modal.querySelectorAll('button.done')[0];
    let close = this.modal.querySelectorAll('.close')[0];

    // done button active => add link
    submit.addEventListener('click', (e:any) => {
      e.preventDefault();
      let newTabCheckbox = this.modal.querySelectorAll('#new-tab')[0];
      let linkInput = this.modal.querySelectorAll('#linkValue')[0];
      let linkValue = linkInput.value;
      let newTab = newTabCheckbox.checked;

      this.restoreSelection(selection);

      if(window.getSelection()?.toString()) {
        let a = document.createElement('a');
        a.href = linkValue;
        if(newTab) a.target = '_blank';
        window.getSelection()?.getRangeAt(0).surroundContents(a);
      }

      this.modal.style.display = 'none';
      linkInput.value = '';

      // deregister modal events
      submit.removeEventListener('click', ()=>{
        arguments.callee
      });
      close.removeEventListener('click', ()=>{
        arguments.callee
      });
    });

    // close modal on X click
    close.addEventListener('click', (e:any) => {
      e.preventDefault();
      let linkInput = this.modal.querySelectorAll('#linkValue')[0];

      this.modal.style.display = 'none';
      linkInput.value = '';

      // deregister modal events
      submit.removeEventListener('click', ()=>{
        arguments.callee
      });
      close.removeEventListener('click', ()=>{
        arguments.callee
      });
    });
  }

  execDefaultAction(action:any) {
    document.execCommand(action, false);
  }

  saveSelection() {
    if(window.getSelection) {
        const sel = window.getSelection();
        if(sel?.getRangeAt && sel.rangeCount) {
            let ranges = [];
            for(var i = 0, len = sel.rangeCount; i < len; ++i) {
                ranges.push(sel.getRangeAt(i));
            }
            return ranges;
        }
    } else if (document.getSelection() && document.getSelection()?.addRange) {
        return document.getSelection()?.addRange;
    }
    return null;
  }

  restoreSelection(savedSel:any) {
    if(savedSel) {
        if(window.getSelection) {
            const sel = window.getSelection();
            sel?.removeAllRanges();
            for(var i = 0, len = savedSel.length; i < len; ++i) {
                sel?.addRange(savedSel[i]);
            }
        } else if(document.getSelection() && savedSel.select) {
            savedSel.select();
        }
    }
  }


}
