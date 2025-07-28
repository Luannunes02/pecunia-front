import { HttpHeaders } from '@angular/common/http';

export function requestHeaders(newHeaders?: any) {
  const token = localStorage.getItem('token'); // ou onde você salva o token JWT
  let headers: any = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (newHeaders) {
    headers = { ...headers, ...newHeaders };
  }

  return {
    headers: new HttpHeaders(headers),
  };
}
