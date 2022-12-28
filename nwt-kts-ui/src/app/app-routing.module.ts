import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientpageMapComponent } from './features/clientpage/components/clientpage-map/clientpage-map.component';
import { StartpageTabContainerComponent } from './features/startpage/components/startpage-tab-container/startpage-tab-container.component';

const routes: Routes = [
  { path: '', component: StartpageTabContainerComponent },

  //*************//
  { path: 'clientmap', component: ClientpageMapComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
