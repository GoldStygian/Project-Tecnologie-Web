import { TestBed } from '@angular/core/testing';

import { ThemeSwitch } from '../theme-switch';

describe('ThemeSwitch', () => {
  let service: ThemeSwitch;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeSwitch);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
