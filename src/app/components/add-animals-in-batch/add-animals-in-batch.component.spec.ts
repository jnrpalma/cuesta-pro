import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnimalsInBatchComponent } from './add-animals-in-batch.component';

describe('AddAnimalsInBatchComponent', () => {
  let component: AddAnimalsInBatchComponent;
  let fixture: ComponentFixture<AddAnimalsInBatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAnimalsInBatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAnimalsInBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
