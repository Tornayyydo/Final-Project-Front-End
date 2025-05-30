import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { TestErrorComponent } from './test-error/test-error.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { ToastrModule } from 'ngx-toastr';
import { BreadcrumbComponent, BreadcrumbItemDirective } from 'xng-breadcrumb';
import { SectionHeaderComponent } from './section-header/section-header.component'
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [NavBarComponent, TestErrorComponent, NotFoundComponent, ServerErrorComponent, SectionHeaderComponent, FooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    BreadcrumbComponent,
    BreadcrumbItemDirective,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
  ],
  exports: [NavBarComponent, SectionHeaderComponent, FooterComponent]
})
export class CoreModule { }
