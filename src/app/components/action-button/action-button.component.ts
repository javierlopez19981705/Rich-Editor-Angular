import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-action-button[src]',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements OnInit {

  @Input() src:String = '';
  @Input() action:String = '';
  @Input() value?:String;

  constructor() { }

  ngOnInit(): void {
  }

  changeFontSize(){
    if(this.action !== null && this.action !== '' )
    document.execCommand(`${this.action}`, false, `${this.value}`);
    // window.getSelection()?.getRangeAt(0).surroundContents(a);
  }

}
