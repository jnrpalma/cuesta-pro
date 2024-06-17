import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterBatchComponent } from './register-batch.component';

describe('RegisterBatchComponent', () => {
  let component: RegisterBatchComponent;
  let fixture: ComponentFixture<RegisterBatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterBatchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
