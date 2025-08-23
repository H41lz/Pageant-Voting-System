// Frontend_Altatech/src/api.js
const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
    static getAuthHeaders() {
        const token = localStorage.getItem('auth_token');
        return {
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    // Authentication
    static async login(credentials) {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            
            if (!response.ok) {
                throw new Error('Login failed');
            }
            
            const data = await response.json();
            
            if (data.token) {
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('currentUser', credentials.email);
            }
            
            return data;
        } catch (error) {
            console.error('API Login Error:', error);
            throw error;
        }
    }

    static async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Register Error:', error);
            throw error;
        }
    }

    // Candidates
    static async fetchCandidates() {
        try {
            const response = await fetch(`${API_BASE_URL}/candidates`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch candidates');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Fetch Candidates Error:', error);
            throw error;
        }
    }

    // Voting
    static async castVote(voteData) {
        try {
            const response = await fetch(`${API_BASE_URL}/votes`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(voteData)
            });
            
            if (!response.ok) {
                throw new Error('Vote failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Vote Error:', error);
            throw error;
        }
    }

    static async getVoteHistory() {
        try {
            const response = await fetch(`${API_BASE_URL}/votes/history`, {
                headers: this.getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch vote history');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Vote History Error:', error);
            throw error;
        }
    }

    static async purchaseVotes(purchaseData) {
        try {
            const response = await fetch(`${API_BASE_URL}/votes/purchase`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(purchaseData)
            });
            
            if (!response.ok) {
                throw new Error('Purchase failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Purchase Error:', error);
            throw error;
        }
    }

    // Results
    static async getResults() {
        try {
            const response = await fetch(`${API_BASE_URL}/results`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch results');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Results Error:', error);
            throw error;
        }
    }

    // Admin functions - Updated for FormData support
    static async createCandidate(candidateData) {
        try {
            const headers = this.getAuthHeaders();
            
            // If it's FormData (file upload), don't set Content-Type
            if (!(candidateData instanceof FormData)) {
                headers['Content-Type'] = 'application/json';
            }
            
            const response = await fetch(`${API_BASE_URL}/candidates`, {
                method: 'POST',
                headers,
                body: candidateData instanceof FormData ? candidateData : JSON.stringify(candidateData)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to create candidate');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Create Candidate Error:', error);
            throw error;
        }
    }

    static async updateCandidate(id, candidateData) {
        try {
            const headers = this.getAuthHeaders();
            
            // If it's FormData (file upload), don't set Content-Type
            if (!(candidateData instanceof FormData)) {
                headers['Content-Type'] = 'application/json';
            }
            
            const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
                method: 'PUT', // Using POST with _method for Laravel
                headers,
                body: candidateData instanceof FormData ? candidateData : JSON.stringify(candidateData)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update candidate');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Update Candidate Error:', error);
            throw error;
        }
    }

    static async deleteCandidate(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to delete candidate');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Delete Candidate Error:', error);
            throw error;
        }
    }

    static async getAdminVotes() {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/votes`, {
                headers: this.getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch admin votes');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Admin Votes Error:', error);
            throw error;
        }
    }

    // Utility function to check if backend is available
    static async checkBackendConnection() {
        try {
            const response = await fetch(`${API_BASE_URL}/candidates`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}

export default ApiService;