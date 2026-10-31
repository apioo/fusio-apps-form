import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ErrorService, FormButtonComponent, FusioService} from "ngx-fusio-sdk";
import {ConsumerForm} from "fusio-sdk";
import {ActivatedRoute} from "@angular/router";
import {JsonFormsModule} from "@jsonforms/angular";
import {JsonPipe} from "@angular/common";
import {JsonSchema, UISchemaElement} from "@jsonforms/core";
import {bootstrapRenderers} from "../renderer";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-form-detail',
  imports: [
    JsonFormsModule,
    JsonPipe,
    FormButtonComponent,
  ],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail implements OnInit {

  form = signal<ConsumerForm|undefined>(undefined);
  response = signal<any>(undefined);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);

  renderers = bootstrapRenderers;

  schema = computed<JsonSchema|undefined>(() => this.form()?.jsonSchema as JsonSchema|undefined);

  /**
   * An empty ui schema (i.e. {}) has no type and thus no renderer matches, in this case we return undefined so that
   * JSON Forms generates a default layout based on the json schema
   */
  uiSchema = computed<UISchemaElement|undefined>(() => {
    const uiSchema = this.form()?.uiSchema as UISchemaElement|undefined;
    return uiSchema && typeof uiSchema.type === 'string' ? uiSchema : undefined;
  });

  /**
   * The initial data passed to JSON Forms, we keep this separate from the data signal so that changes emitted by
   * JSON Forms are not fed back into the form
   */
  initialData: Record<string, any> = {};
  data = signal<Record<string, any>>({});

  private fusio = inject(FusioService);
  private error = inject(ErrorService);
  private activatedRoute = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);

  async ngOnInit(): Promise<void> {
    this.activatedRoute.paramMap.subscribe((params) => {
      const formId = params.get('id');
      if (formId) {
        this.loadForm(formId);
      }
    });
  }

  async loadForm(formId: string) {
    this.loading.set(true);
    this.initialData = {};
    this.data.set({});

    try {
      this.form.set(await this.fusio.getClient().consumer().form().get(formId));
    } catch (error) {
      this.response.set(this.error.convert(error));
    }

    this.loading.set(false);
  }

  async submitForm() {
    const form = this.form();
    if (!form) {
      return;
    }

    const data = this.data();
    console.log(data);

    const httpMethod = form.method;
    const url = form.action;
    if (!httpMethod || !url) {
      return;
    }

    const accessToken = this.fusio.getTokenStore().get()?.access_token;
    if (!accessToken) {
      return;
    }

    this.submitting.set(true);

    const options = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
      body: this.data(),
    };

    this.httpClient.request<any>(httpMethod, url, options).subscribe({
      next: (data) => {
        this.response.set(data);
        this.submitting.set(false);
      },
      error: (err) => {
        this.response.set(err.error);
        this.submitting.set(false);
      },
    });
  }

  onDataChange(data: any) {
    this.data.set(data);
  }

}
