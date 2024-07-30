import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAnimalComponent } from './update-animal.component';

describe('UpdateAnimalComponent', () => {
  let component: UpdateAnimalComponent;
  let fixture: ComponentFixture<UpdateAnimalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAnimalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAnimalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
