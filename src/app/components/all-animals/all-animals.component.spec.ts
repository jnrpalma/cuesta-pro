import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAnimalsComponent } from './all-animals.component';

describe('AllAnimalsComponent', () => {
  let component: AllAnimalsComponent;
  let fixture: ComponentFixture<AllAnimalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllAnimalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllAnimalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
