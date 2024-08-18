import { Injectable, inject } from '@angular/core';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private toasterService = inject(ToasterService);

  imageDropHandler(ev: DragEvent): File | null {
    if (ev.dataTransfer?.items) {
      const files = Array.from(ev.dataTransfer.items);
      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file && this.validateFileType(file.type)) {
            return file;
          } else {
            this.toasterService.warning(
              'Invalid!',
              'Only jpeg, jpg, & png images are allowed.'
            );
            setTimeout(() => {
              this.toasterService.toasterInfo$.next(null);
            }, 5000);
          }
        }
      }
    }
    return null;
  }

  validateFileType(fileType: string | undefined): boolean | null {
    if (fileType) {
      const allowedTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png'];
      return allowedTypes.includes(fileType);
    }
    return null;
  }
}