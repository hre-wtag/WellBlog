import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Blog } from '../interfaces/blog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
blogs$=new BehaviorSubject<Blog[]|null>(null);
  constructor() { }
}
