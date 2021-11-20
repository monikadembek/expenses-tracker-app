import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphTileComponent } from './graph-tile.component';

describe('GraphTileComponent', () => {
  let component: GraphTileComponent;
  let fixture: ComponentFixture<GraphTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
