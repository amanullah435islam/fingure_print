import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('token');

  if (token) {
    return true; // ✅ ঢুকতে পারবে
  } else {
    alert("Login first!");
    return false; // ❌ ঢুকতে পারবে না
  }
};