import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCats } from './my-cats';

describe('MyCats', () => {
  let component: MyCats;
  let fixture: ComponentFixture<MyCats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
