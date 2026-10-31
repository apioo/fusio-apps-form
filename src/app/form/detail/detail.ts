import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ErrorService, FusioService} from "ngx-fusio-sdk";
import {CommonMessage, ConsumerForm} from "fusio-sdk";
import {ActivatedRoute} from "@angular/router";
import {JsonFormsModule} from "@jsonforms/angular";
import {JsonPipe} from "@angular/common";
import {JsonSchema, UISchemaElement} from "@jsonforms/core";
import {bootstrapRenderers} from "../renderer";

@Component({
  selector: 'app-form-detail',
  imports: [
    JsonFormsModule,
    JsonPipe,
  ],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail implements OnInit {

  form = signal<ConsumerForm|undefined>(undefined);
  response = signal<CommonMessage|undefined>(undefined);
  loading = signal<boolean>(false);

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

  }

  onDataChange(event: { data: any; errors: any[] }) {
    this.data.set(event.data);
  }

}
