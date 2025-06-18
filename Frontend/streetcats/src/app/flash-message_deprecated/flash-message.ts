// import { Component, OnInit } from '@angular/core';
// import { FlashMessageService, FlashMessage } from '../_services/flash-message/flash-message';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-flash-messages',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './flash-message.html',
//   styleUrl: './flash-message.scss'
// })
// export class FlashMessageComponent implements OnInit{
  // messages: FlashMessage[] = [];

  // constructor(private flash: FlashMessageService) {}

  // ngOnInit() {
  //   this.flash.messages$.subscribe(msg => {
  //     this.messages.push(msg);
  //     const duration = msg.duration ?? 3000;
  //     setTimeout(() => this.remove(msg), duration);
  //   });
  // }

  // remove(msg: FlashMessage) {
  //   this.messages = this.messages.filter(m => m !== msg);
  // }
// }
