import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../api.js';
import './login.css';
import './Voting.css';

export default function Voting() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [votingFor, setVotingFor] = useState(null);
  const [voteCount, setVoteCount] = useState(1);
  const [voteHistory, setVoteHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  const user = localStorage.getItem("currentUser");
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    if (!user || user === 'admin') {
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate]);

  // Load all necessary data
  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadCandidates(),
        loadVoteHistory(),
        loadResults()
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Failed to load voting data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load candidates from backend
  const loadCandidates = async () => {
    try {
      const backendCandidates = await ApiService.fetchCandidates();
      setCandidates(backendCandidates);
    } catch (error) {
      console.error('Failed to load candidates:', error);
      // Fallback to local storage if needed
      const localCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
      setCandidates(localCandidates);
    }
  };

  // Load vote history
  const loadVoteHistory = async () => {
    try {
      const history = await ApiService.getVoteHistory();
      setVoteHistory(history);
    } catch (error) {
      console.error('Failed to load vote history:', error);
      // Fallback to localStorage
      const localHistory = JSON.parse(localStorage.getItem(`${user}_votes`) || '[]');
      setVoteHistory(localHistory);
    }
  };

  // Load results
  const loadResults = async () => {
    try {
      const resultsData = await ApiService.getResults();
      setResults(resultsData);
    } catch (error) {
      console.error('Failed to load results:', error);
    }
  };

  // Cast vote
  const handleVote = async (candidateId) => {
    if (!candidateId || voteCount < 1 || voteCount > 10) {
      setError('Please select a valid number of votes (1-10)');
      return;
    }

    try {
      setLoading(true);
      
      // Try backend first
      try {
        await ApiService.castVote({
          candidate_id: candidateId,
          votes_count: voteCount
        });
        
        const candidate = candidates.find(c => c.id === candidateId);
        setSuccess(`Successfully cast ${voteCount} vote(s) for ${candidate.name}!`);
        
        // Reload data
        await loadData();
        
      } catch (backendError) {
        console.log('Backend voting failed, using localStorage fallback:', backendError.message);
        
        // Fallback to localStorage
        const candidate = candidates.find(c => c.id === candidateId);
        if (!candidate) {
          setError('Candidate not found');
          return;
        }

        // Check if user has already voted today (localStorage fallback)
        const userVotes = JSON.parse(localStorage.getItem(`${user}_votes`) || '[]');
        const today = new Date().toDateString();
        const todayVotes = userVotes.filter(vote => 
          new Date(vote.date).toDateString() === today
        );

        if (todayVotes.length >= 3) {
          setError('You have reached your daily voting limit (3 votes per day)');
          return;
        }

        // Add vote to localStorage
        const newVote = {
          id: Date.now(),
          candidate_id: candidateId,
          candidate_name: candidate.name,
          votes_count: voteCount,
          date: new Date().toISOString()
        };

        userVotes.push(newVote);
        localStorage.setItem(`${user}_votes`, JSON.stringify(userVotes));
        
        // Update local results
        const localResults = JSON.parse(localStorage.getItem('voting_results') || '{}');
        localResults[candidateId] = (localResults[candidateId] || 0) + voteCount;
        localStorage.setItem('voting_results', JSON.stringify(localResults));
        
        setSuccess(`Successfully cast ${voteCount} vote(s) for ${candidate.name}!`);
        await loadVoteHistory();
      }
      
      setVotingFor(null);
      setVoteCount(1);
      
    } catch (error) {
      console.error('Voting failed:', error);
      setError('Failed to cast vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Purchase more votes (placeholder)
  const handlePurchaseVotes = async (votesToPurchase) => {
    try {
      setLoading(true);
      
      const response = await ApiService.purchaseVotes({
        votes_count: votesToPurchase
      });
      
      setSuccess(`Successfully purchased ${votesToPurchase} votes for $${votesToPurchase}.00!`);
      
    } catch (error) {
      console.error('Purchase failed:', error);
      setError('Vote purchase is currently unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('auth_token');
    navigate('/');
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (loading && candidates.length === 0) {
    return (
      <div className="voting-container">
        <div className="loading">Loading voting data...</div>
      </div>
    );
  }

  return (
    <div className="voting-container">
      {/* Header */}
      <div className="voting-header">
        <div className="header-content">
          <h2>Pageant Voting System</h2>
          <p className="welcome-text">Welcome, {user}!</p>
        </div>
        <div className="header-actions">
          <button 
            className="action-btn history-btn"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? 'Hide History' : 'Vote History'}
          </button>
          <button 
            className="action-btn results-btn"
            onClick={() => setShowResults(!showResults)}
          >
            {showResults ? 'Hide Results' : 'View Results'}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Vote History */}
      {showHistory && (
        <div className="section vote-history-section">
          <h3>Your Vote History</h3>
          {voteHistory.length === 0 ? (
            <p className="no-data">No votes cast yet.</p>
          ) : (
            <div className="history-list">
              {voteHistory.map((vote, index) => (
                <div key={vote.id || index} className="history-item">
                  <div className="history-info">
                    <strong>{vote.candidate?.name || vote.candidate_name}</strong>
                    <span className="vote-count">{vote.votes_count} vote(s)</span>
                  </div>
                  <div className="history-date">
                    {new Date(vote.created_at || vote.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {showResults && (
        <div className="section results-section">
          <h3>Current Results</h3>
          {results.length === 0 ? (
            <p className="no-data">No results available yet.</p>
          ) : (
            <div className="results-list">
              {results
                .sort((a, b) => b.total_votes - a.total_votes)
                .map((result, index) => (
                  <div key={result.id} className="result-item">
                    <div className="result-rank">#{index + 1}</div>
                    <div className="result-info">
                      <strong>{result.name}</strong>
                      <div className="result-stats">
                        <span className="total-votes">{result.total_votes} total votes</span>
                        <span className="unique-voters">{result.unique_voters} voters</span>
                      </div>
                    </div>
                    <div className="result-percentage">
                      {results.reduce((sum, r) => sum + parseInt(r.total_votes), 0) > 0
                        ? Math.round((result.total_votes / results.reduce((sum, r) => sum + parseInt(r.total_votes), 0)) * 100)
                        : 0
                      }%
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Voting Section */}
      <div className="section voting-section">
        <h3>Cast Your Vote</h3>
        {candidates.length === 0 ? (
          <div className="no-candidates">
            <p>No candidates available for voting at this time.</p>
          </div>
        ) : (
          <div className="candidates-grid">
            {candidates.map(candidate => (
              <div key={candidate.id} className="candidate-card">
                <div className="candidate-image">
                  <img 
                    src={candidate.image || 'https://via.placeholder.com/300x300?text=No+Image'} 
                    alt={candidate.name}
                  />
                </div>
                
                <div className="candidate-info">
                  <h4>{candidate.name}</h4>
                  {candidate.description && (
                    <p className="description">{candidate.description}</p>
                  )}
                </div>
                
                <div className="voting-controls">
                  {votingFor === candidate.id ? (
                    <div className="vote-form">
                      <div className="vote-input-group">
                        <label>Number of votes:</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={voteCount}
                          onChange={(e) => setVoteCount(parseInt(e.target.value))}
                          className="vote-input"
                        />
                      </div>
                      <div className="vote-actions">
                        <button 
                          className="confirm-vote-btn"
                          onClick={() => handleVote(candidate.id)}
                          disabled={loading}
                        >
                          {loading ? 'Voting...' : 'Confirm Vote'}
                        </button>
                        <button 
                          className="cancel-vote-btn"
                          onClick={() => {
                            setVotingFor(null);
                            setVoteCount(1);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      className="vote-btn"
                      onClick={() => setVotingFor(candidate.id)}
                      disabled={loading}
                    >
                      Vote for {candidate.name}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Purchase Votes Section */}
      <div className="section purchase-section">
        <h3>Purchase Additional Votes</h3>
        <div className="purchase-options">
          <div className="purchase-info">
            <p>Need more votes? Purchase additional votes for $1.00 each.</p>
          </div>
          <div className="purchase-buttons">
            <button 
              className="purchase-btn"
              onClick={() => handlePurchaseVotes(5)}
              disabled={loading}
            >
              Buy 5 votes - $5.00
            </button>
            <button 
              className="purchase-btn"
              onClick={() => handlePurchaseVotes(10)}
              disabled={loading}
            >
              Buy 10 votes - $10.00
            </button>
            <button 
              className="purchase-btn"
              onClick={() => handlePurchaseVotes(25)}
              disabled={loading}
            >
              Buy 25 votes - $25.00
            </button>
          </div>
        </div>
      </div>

      <footer className="voting-footer">
        <p>&copy; Altatech Solutions Inc</p>
      </footer>
    </div>
  );
}