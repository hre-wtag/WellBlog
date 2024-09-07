import { Injectable } from '@angular/core';
import DOMPurify from 'dompurify';

@Injectable({
  providedIn: 'root',
})
export class HtmlToTextService {
  htmlToText(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = DOMPurify.sanitize(html);
    return temp.textContent || '';
  }
}
