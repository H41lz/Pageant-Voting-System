import './bootstrap';

// Pageant Voting System Frontend
class PageantVotingSystem {
    constructor() {
        this.apiBase = 'http://localhost:8000/api';
        this.token = localStorage.getItem('auth_token');
        this.currentUser = null;
        this.candidates = [];
        this.results = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuth();
        this.loadCandidates();
        this.loadResults();
    }

    setupEventListeners() {
        // Auth forms
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm')?.addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.handleLogout());

        // Voting
        document.getElementById('voteForm')?.addEventListener('submit', (e) => this.handleVote(e));
        document.getElementById('purchaseForm')?.addEventListener('submit', (e) => this.handlePurchase(e));

        // Navigation
        document.getElementById('showLogin')?.addEventListener('click', () => this.showSection('login'));
        document.getElementById('showRegister')?.addEventListener('click', () => this.showSection('register'));
        document.getElementById('showVoting')?.addEventListener('click', () => this.showSection('voting'));
        document.getElementById('showResults')?.addEventListener('click', () => this.showSection('results'));
        document.getElementById('showHistory')?.addEventListener('click', () => this.showSection('history'));
    }

    async checkAuth() {
        if (this.token) {
            try {
                const response = await this.apiCall('GET', '/user');
                this.currentUser = response.user;
                this.updateUI();
            } catch (error) {
                this.logout();
            }
        }
    }

    async apiCall(method, endpoint, data = null) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            method,
            headers,
        };

        if (data) {
            config.body = JSON.stringify(data);
        }

        const response = await fetch(`${this.apiBase}${endpoint}`, config);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'API Error');
        }

        return result;
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const response = await this.apiCall('POST', '/login', {
                email: formData.get('email'),
                password: formData.get('password'),
            });

            this.token = response.access_token;
            this.currentUser = response.user;
            localStorage.setItem('auth_token', this.token);
            
            this.showSuccess('Login successful!');
            this.updateUI();
            this.showSection('voting');
        } catch (error) {
            this.showError(error.message);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const response = await this.apiCall('POST', '/register', {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
            });

            this.token = response.access_token;
            this.currentUser = response.user;
            localStorage.setItem('auth_token', this.token);
            
            this.showSuccess('Registration successful!');
            this.updateUI();
            this.showSection('voting');
        } catch (error) {
            this.showError(error.message);
        }
    }

    async handleLogout() {
        try {
            await this.apiCall('POST', '/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.logout();
        }
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('auth_token');
        this.updateUI();
        this.showSection('login');
    }

    async handleVote(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            await this.apiCall('POST', '/votes', {
                candidate_id: formData.get('candidate_id'),
                type: formData.get('vote_type'),
            });

            this.showSuccess('Vote cast successfully!');
            this.loadResults();
            e.target.reset();
        } catch (error) {
            this.showError(error.message);
        }
    }

    async handlePurchase(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const response = await this.apiCall('POST', '/votes/purchase', {
                candidate_id: formData.get('candidate_id'),
                quantity: parseInt(formData.get('quantity')),
            });

            this.showSuccess(`Purchase successful! You got ${response.total_votes_granted} votes (${response.paid_votes} paid + ${response.bonus_vote} bonus)`);
            this.loadResults();
            e.target.reset();
        } catch (error) {
            this.showError(error.message);
        }
    }

    async loadCandidates() {
        try {
            const response = await this.apiCall('GET', '/candidates');
            this.candidates = response;
            this.renderCandidates();
        } catch (error) {
            this.showError('Failed to load candidates');
        }
    }

    async loadResults() {
        try {
            const response = await this.apiCall('GET', '/results');
            this.results = response;
            this.renderResults();
        } catch (error) {
            this.showError('Failed to load results');
        }
    }

    async loadVoteHistory() {
        if (!this.currentUser) return;

        try {
            const response = await this.apiCall('GET', '/votes/history');
            this.renderVoteHistory(response);
        } catch (error) {
            this.showError('Failed to load vote history');
        }
    }

    renderCandidates() {
        const container = document.getElementById('candidatesList');
        if (!container) return;

        container.innerHTML = this.candidates.map(candidate => `
            <div class="bg-white rounded-lg shadow-md p-6 mb-4">
                <div class="flex items-center space-x-4">
                    ${candidate.image ? `<img src="${candidate.image}" alt="${candidate.name}" class="w-16 h-16 rounded-full object-cover">` : ''}
                    <div class="flex-1">
                        <h3 class="text-xl font-semibold text-gray-900">${candidate.name}</h3>
                        <p class="text-gray-600">${candidate.description || 'No description available'}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderResults() {
        const container = document.getElementById('resultsList');
        if (!container) return;

        const sortedResults = this.results.sort((a, b) => b.total_votes - a.total_votes);

        container.innerHTML = sortedResults.map((result, index) => `
            <div class="bg-white rounded-lg shadow-md p-6 mb-4 ${index === 0 ? 'border-2 border-yellow-400' : ''}">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        ${result.candidate.image ? `<img src="${result.candidate.image}" alt="${result.candidate.name}" class="w-12 h-12 rounded-full object-cover">` : ''}
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">${result.candidate.name}</h3>
                            <p class="text-sm text-gray-600">${result.candidate.description || ''}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold text-blue-600">${result.total_votes}</div>
                        <div class="text-sm text-gray-500">
                            ${result.free_votes} free • ${result.paid_votes} paid
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderVoteHistory(votes) {
        const container = document.getElementById('voteHistory');
        if (!container) return;

        container.innerHTML = votes.map(vote => `
            <div class="bg-white rounded-lg shadow-sm p-4 mb-3">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-semibold text-gray-900">${vote.candidate.name}</h4>
                        <p class="text-sm text-gray-600">${new Date(vote.created_at).toLocaleString()}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-medium ${
                        vote.type === 'free' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }">
                        ${vote.type.toUpperCase()}
                    </span>
                </div>
            </div>
        `).join('');
    }

    updateUI() {
        const authSection = document.getElementById('authSection');
        const userSection = document.getElementById('userSection');
        const userName = document.getElementById('userName');

        if (this.currentUser) {
            authSection?.classList.add('hidden');
            userSection?.classList.remove('hidden');
            if (userName) userName.textContent = this.currentUser.name;
        } else {
            authSection?.classList.remove('hidden');
            userSection?.classList.add('hidden');
        }
    }

    showSection(sectionName) {
        const sections = ['login', 'register', 'voting', 'results', 'history'];
        sections.forEach(section => {
            const element = document.getElementById(`${section}Section`);
            if (element) {
                element.classList.add('hidden');
            }
        });

        const targetSection = document.getElementById(`${sectionName}Section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }

        if (sectionName === 'history') {
            this.loadVoteHistory();
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PageantVotingSystem();
});
