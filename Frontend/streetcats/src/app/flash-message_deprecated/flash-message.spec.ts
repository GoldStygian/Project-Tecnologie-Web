import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashMessage } from './flash-message';

describe('FlashMessage', () => {
  let component: FlashMessage;
  let fixture: ComponentFixture<FlashMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashMessage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
