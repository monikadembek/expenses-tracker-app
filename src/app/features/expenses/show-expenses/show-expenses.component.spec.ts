import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowExpensesComponent } from './show-expenses.component';

describe('ShowExpensesComponent', () => {
  let component: ShowExpensesComponent;
  let fixture: ComponentFixture<ShowExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowExpensesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
