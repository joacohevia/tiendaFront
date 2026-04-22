import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisUsuarios } from './mis-usuarios';

describe('MisUsuarios', () => {
  let component: MisUsuarios;
  let fixture: ComponentFixture<MisUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MisUsuarios],
    }).compileComponents();

    fixture = TestBed.createComponent(MisUsuarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
