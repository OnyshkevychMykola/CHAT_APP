import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { tokenGetter } from 'src/app/app.module';

const config: SocketIoConfig = {
  url: 'http://localhost:3000', options: {
    extraHeaders: {
      Authorization: tokenGetter() || '' // Provide an empty string as a default value
    }
  }
};

@Injectable({providedIn: 'root'})
export class ChatSocket extends Socket {
  constructor() {
    super(config)
  }
}
