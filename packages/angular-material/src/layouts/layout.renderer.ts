/*
  The MIT License

  Copyright (c) 2018 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import { JsonFormsBaseRenderer } from '@jsonforms/angular';
import {
    JsonFormsState,
    Layout,
    mapStateToLayoutProps,
    OwnPropsOfRenderer,
    UISchemaElement
} from '@jsonforms/core';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

export class LayoutRenderer<T extends Layout>
    extends JsonFormsBaseRenderer implements OnInit, OnDestroy {

    private elements: OwnPropsOfRenderer[];
    private subscription: Subscription;

    constructor(private ngRedux: NgRedux<JsonFormsState>) {
        super();
    }

    ngOnInit() {
        this.subscription = this.ngRedux
            .select()
            .subscribe((state: JsonFormsState) => {
                const props = mapStateToLayoutProps(state, this.getOwnProps());
                const uischema = props.uischema as T;
                const schema = props.schema;
                const path = props.path;
                this.uischema = uischema;
                this.schema = schema;
                this.path = path;
                this.elements = (uischema.elements || []).map((el: UISchemaElement) => ({
                    uischema: el,
                    schema,
                    path
                }));
            });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    get renderProps() {
        return this.elements;
    }
}