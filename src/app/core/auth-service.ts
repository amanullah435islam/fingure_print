import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private baseUrl = 'http://localhost:8080/auth/passkey';

  // ===== BUFFER UTILS =====
  bufferDecode(value: string): ArrayBuffer {
    return Uint8Array.from(
      atob(value.replace(/-/g, '+').replace(/_/g, '/')),
      c => c.charCodeAt(0)
    ).buffer;
  }

  bufferEncode(value: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(value)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  // ================= REGISTER =================
  async register(email: string) {

    const res = await fetch(`${this.baseUrl}/register-challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    let options = await res.json();

    options.challenge = this.bufferDecode(options.challenge);
    options.user.id = this.bufferDecode(options.user.id);

    if (options.excludeCredentials) {
      options.excludeCredentials = options.excludeCredentials.map((c: any) => ({
        ...c,
        id: this.bufferDecode(c.id)
      }));
    }

    const credential: any = await navigator.credentials.create({
      publicKey: options
    });

    const fixedCredential = {
      id: credential.id,
      rawId: this.bufferEncode(credential.rawId),
      type: credential.type,
      response: {
        clientDataJSON: this.bufferEncode(credential.response.clientDataJSON),
        attestationObject: this.bufferEncode(credential.response.attestationObject)
      },
      clientExtensionResults: {} // 🔥 MUST
    };

    await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, credential: fixedCredential })
    });

    alert('✅ Registered with Fingerprint');
  }

  // ================= LOGIN =================
  async login(email: string){

    const res = await fetch(`${this.baseUrl}/login-challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    
    let options = await res.json();
    const pk = options.publicKeyCredentialRequestOptions;

    pk.challenge = this.bufferDecode(pk.challenge);

    if (pk.allowCredentials) {
      pk.allowCredentials = pk.allowCredentials.map((c: any) => ({
        ...c,
        id: this.bufferDecode(c.id),
        transports: c.transports || ['internal'] // 🔥 fix
      }));
    }

    const assertion: any = await navigator.credentials.get({
      publicKey: pk
    });

    const loginRes = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        assertion: {
          id: assertion.id,
          rawId: this.bufferEncode(assertion.rawId),
          type: assertion.type,
          response: {
            clientDataJSON: this.bufferEncode(assertion.response.clientDataJSON),
            authenticatorData: this.bufferEncode(assertion.response.authenticatorData),
            signature: this.bufferEncode(assertion.response.signature),
            userHandle: assertion.response.userHandle
              ? this.bufferEncode(assertion.response.userHandle)
              : null
          },
          clientExtensionResults: {} // 🔥 MUST
        }
      })
    });

    const data = await loginRes.json();

    localStorage.setItem('token', data.token);

    return data;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}
