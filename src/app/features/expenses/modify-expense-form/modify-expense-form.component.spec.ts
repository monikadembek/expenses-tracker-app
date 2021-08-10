import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyExpenseFormComponent } from './modify-expense-form.component';

describe('ModifyExpenseFormComponent', () => {
  let component: ModifyExpenseFormComponent;
  let fixture: ComponentFixture<ModifyExpenseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyExpenseFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyExpenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
