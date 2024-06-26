import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../services/restaurant.service';
import { Restaurant } from '../models/restaurant';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  restaurants: Restaurant[] = [];
  limit = 10;
  skip = 0;
  latitude: number = 0;
  longitude: number = 0;

  constructor(private restaurantService: RestaurantService) { }

  ngOnInit() {
    this.getCurrentLocation();
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.loadRestaurants();
      }, (error) => {
        console.error('Error getting location', error);
        this.latitude = 0;
        this.longitude = 0;
        this.loadRestaurants();
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.latitude = 0;
      this.longitude = 0;
      this.loadRestaurants();
    }
  }

  loadRestaurants(event?: CustomEvent) {
    this.restaurantService.getRestaurants(this.limit, this.skip, this.latitude, this.longitude).subscribe((data: any) => {
      if (data && data.response && Array.isArray(data.response)) {
        console.log(this.restaurants);
        const newRestaurants = data.response.map((restaurant: Restaurant) => {
          restaurant.distance = this.getDistanceFromLatLonInKm(
            this.latitude,
            this.longitude,
            restaurant.storeInfo.geoLocation.latitude,
            restaurant.storeInfo.geoLocation.longitude
          );
          restaurant.isOpen = this.checkIfOpen(restaurant.storeInfo.workingHours);
          return restaurant;
        });
        this.restaurants = [...this.restaurants, ...newRestaurants];
      } else {
        console.error('Invalid data structure:', data);
      }
      if (event) {
        const target = event.target as HTMLIonInfiniteScrollElement;
        if (target) {
          target.complete();
        }
      }
      this.skip += this.limit;
    });
  }

  loadMore(event: CustomEvent) {
    this.loadRestaurants(event);
  }

  getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return parseFloat(distance.toFixed(1));
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  checkIfOpen(workingHours: { day: number; open: string; close: string; closed: boolean }[]): boolean {
    const now = new Date();
    const day = now.getDay();
    const time = now.getHours() + ':' + ('0' + now.getMinutes()).slice(-2);

    for (const hours of workingHours) {
      if (hours.day === day && !hours.closed) {
        if (hours.open <= time && time <= hours.close) {
          return true;
        }
      }
    }
    return false;
  }
}
