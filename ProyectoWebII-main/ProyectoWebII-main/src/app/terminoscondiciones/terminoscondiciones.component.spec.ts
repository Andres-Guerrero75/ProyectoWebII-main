import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminoscondicionesComponent } from './terminoscondiciones.component';

describe('TerminoscondicionesComponent', () => {
  let component: TerminoscondicionesComponent;
  let fixture: ComponentFixture<TerminoscondicionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminoscondicionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminoscondicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
