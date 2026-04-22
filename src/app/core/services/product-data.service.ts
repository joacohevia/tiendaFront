import { Injectable } from '@angular/core';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})
export class productDataService {

  constructor(private api: Api) { }

  
}
