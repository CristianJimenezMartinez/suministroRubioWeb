import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        // Agrega cualquier dependencia necesaria, como Router, si AuthGuard la utiliza
        { provide: Router, useValue: {} }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // Si necesitas testear el método canActivate:
  // it('should allow activation', () => {
  //   const result = guard.canActivate(/* parámetros necesarios */);
  //   expect(result).toBeTruthy();
  // });
});
