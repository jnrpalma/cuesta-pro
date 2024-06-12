import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAnimalComponent } from './register-animal.component';

describe('RegisterAnimalComponent', () => {
  let component: RegisterAnimalComponent;
  let fixture: ComponentFixture<RegisterAnimalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterAnimalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterAnimalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
