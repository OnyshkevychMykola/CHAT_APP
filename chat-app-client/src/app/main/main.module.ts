import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {MatListModule} from "@angular/material/list";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import { CreateRoomComponent } from './components/create-room/create-room.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import { SelectUsersComponent } from './components/select-users/select-users.component';
import {MatLegacyChipsModule} from "@angular/material/legacy-chips";
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';


@NgModule({
  declarations: [
    DashboardComponent,
    CreateRoomComponent,
    SelectUsersComponent,
    ChatMessageComponent,
    ChatRoomComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatListModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatLegacyChipsModule
  ]
})
export class MainModule { }
