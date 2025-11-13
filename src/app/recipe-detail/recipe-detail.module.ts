import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeDetailPageRoutingModule } from './recipe-detail-routing.module';

import { RecipeDetailPage } from './recipe-detail.page';
import { BypassSecurityTrustResourceUrlPipe } from '../pipes/bypassSecurityTrustResourceUrl.pipe';
import { HighlightDirective } from '../directives/highlight.directive';
import { BackHighlightDirective } from '../directives/backhighligth.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipeDetailPageRoutingModule,
    HighlightDirective,
    BackHighlightDirective
  ],
  declarations: [
    RecipeDetailPage,
    BypassSecurityTrustResourceUrlPipe,
  ]
})
export class RecipeDetailPageModule {}
