const API_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:3001';

export function apiGet(path, { signal } = {}) {
    return fetch(`${API_URL}${path}`, { signal })
        .then(async res => {
            if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new Error(text || `Request failed: ${res.status}`);
            }
            return res.json();
        });
}

export function apiPost(path, body, { signal } = {}) {
    return fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal
    }).then(async res => {
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(text || `Request failed: ${res.status}`);
        }
        return res.json();
    });
}

export { API_URL };
