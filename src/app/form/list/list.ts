import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonMessage, ConsumerForm} from "fusio-sdk";
import {RouterLink} from "@angular/router";
import {ErrorService, FusioService, MessageComponent} from "ngx-fusio-sdk";

@Component({
  selector: 'app-form-list',
  templateUrl: './list.html',
  imports: [
    MessageComponent,
    RouterLink,

  ],
  styleUrls: ['./list.css']
})
export class List implements OnInit {

  forms = signal<Array<ConsumerForm>>([]);
  response = signal<CommonMessage|undefined>(undefined);
  loading = signal<boolean>(false);

  private fusio = inject(FusioService);
  private error = inject(ErrorService);

  async ngOnInit(): Promise<void> {
    this.loading.set(true);

    try {
      const response = await this.fusio.getClient().consumer().form().getAll(0, 1024);
      this.forms.set(response.entry || []);
    } catch (error) {
      this.response.set(this.error.convert(error));
    }

    this.loading.set(false);
  }

}
