import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColaboradorDashboard } from './colaborador-dashboard';

describe('ColaboradorDashboard', () => {
  let component: ColaboradorDashboard;
  let fixture: ComponentFixture<ColaboradorDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColaboradorDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(ColaboradorDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
