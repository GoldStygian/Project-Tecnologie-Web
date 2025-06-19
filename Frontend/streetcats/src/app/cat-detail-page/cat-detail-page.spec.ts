import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatDetailPage } from './cat-detail-page';

describe('CatDetailPage', () => {
  let component: CatDetailPage;
  let fixture: ComponentFixture<CatDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatDetailPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
