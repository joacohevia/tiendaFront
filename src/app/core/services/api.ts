import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//export const API_BASE_URL = 'http://localhost:8082/api';
export const API_BASE_URL = 'https://api-tienda-production-b6fb.up.railway.app';

@Injectable({
  providedIn: 'root',
})
export class Api {
  constructor(public http: HttpClient) {}
}
