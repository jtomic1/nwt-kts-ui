import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartpageTabContainerComponent } from './features/startpage/components/startpage-tab-container/startpage-tab-container.component';

const routes: Routes = [
  { path: '', component: StartpageTabContainerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
