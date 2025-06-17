import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatsPage } from './cats-page';

describe('CatsPage', () => {
  let component: CatsPage;
  let fixture: ComponentFixture<CatsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
