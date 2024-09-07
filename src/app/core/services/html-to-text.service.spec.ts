import { TestBed } from '@angular/core/testing';
import { HtmlToTextService } from './html-to-text.service';

describe('HtmlToTextService', () => {
  let service: HtmlToTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HtmlToTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
