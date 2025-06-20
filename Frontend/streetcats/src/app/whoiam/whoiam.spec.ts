import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Whoiam } from './whoiam';

describe('Whoiam', () => {
  let component: Whoiam;
  let fixture: ComponentFixture<Whoiam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Whoiam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Whoiam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
