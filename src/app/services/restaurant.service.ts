import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  private apiUrl = 'https://smarty.kerzz.com:4004/api/mock/getFeed';
  private apiKey = 'bW9jay04ODc3NTU2NjExMjEyNGZmZmZmZmJ2';

  constructor(private http: HttpClient) { }

  getRestaurants(limit: number, skip: number, latitude: number, longitude: number): Observable<any> {
    const headers = new HttpHeaders({
      'apiKey': this.apiKey
    });

    const body = {
      limit: limit,
      skip: skip,
      latitude: latitude,
      longitude: longitude
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
